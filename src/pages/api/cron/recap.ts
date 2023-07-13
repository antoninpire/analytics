import { getNewVisitors } from "@/lib/data/get-new-visitors";
import { getUniqueVisitors } from "@/lib/data/get-unique-visitors";
import { db } from "@/lib/db";
import {
  webPageHitsTable,
  webSessionsTable,
  webVisitorsTable,
} from "@/lib/db/schema";
import { verifySignature } from "@upstash/qstash/nextjs";
import dayjs from "dayjs";
import { and, eq, sql } from "drizzle-orm";
import { NextApiRequest, NextApiResponse } from "next";
import { sendEmail } from "../../../../emails";
import Summary from "../../../../emails/summary";

// Runs every first on the month
async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const startDateObj = dayjs().startOf("month").toDate();
  const endDateObj = dayjs().endOf("month").toDate();
  const duration = endDateObj.getTime() - startDateObj.getTime();
  const pastEndDateObj = new Date(startDateObj.getTime() - duration);

  const websites = await db.query.websitesTable.findMany({
    with: {
      user: true,
    },
  });

  for (const website of websites) {
    const websiteId = website.id;
    const [sessions, pastSessions, pageViews, visitors, pastVisitors] =
      await Promise.all([
        db
          .select({
            id: webSessionsTable.id,
            duration: webSessionsTable.duration,
            visitor_id: webSessionsTable.visitor_id,
            device: webSessionsTable.device,
            browser: webSessionsTable.browser,
            referrer: webSessionsTable.referrer,
            country: webSessionsTable.country,
            updated_at: webSessionsTable.updated_at,
            created_at: webSessionsTable.created_at,
          })
          .from(webSessionsTable)
          .where(
            and(
              sql`${webSessionsTable.created_at} >= ${startDateObj} AND ${webSessionsTable.created_at} <= ${endDateObj}`,
              eq(webSessionsTable.website_id, websiteId)
            )
          ),
        db
          .select({
            id: webSessionsTable.id,
            duration: webSessionsTable.duration,
            visitor_id: webSessionsTable.visitor_id,
          })
          .from(webSessionsTable)
          .where(
            and(
              sql`${webSessionsTable.created_at} >= ${pastEndDateObj} AND ${webSessionsTable.created_at} <= ${startDateObj}`,
              eq(webSessionsTable.website_id, websiteId)
            )
          ),
        db
          .select({
            session_id: webPageHitsTable.session_id,
            pathname: webPageHitsTable.pathname,
          })
          .from(webPageHitsTable)
          .where(
            and(
              sql`${webPageHitsTable.created_at} >= ${startDateObj} AND ${webPageHitsTable.created_at} <= ${endDateObj}`,
              eq(webPageHitsTable.website_id, websiteId)
            )
          ),
        db
          .select({
            count: sql<number>`COUNT(*)`.mapWith(Number),
          })
          .from(webVisitorsTable)
          .where(
            and(
              sql`${webVisitorsTable.created_at} >= ${startDateObj} AND ${webVisitorsTable.created_at} <= ${endDateObj}`,
              eq(webVisitorsTable.website_id, websiteId)
            )
          ),
        db
          .select({
            count: sql<number>`COUNT(*)`.mapWith(Number),
          })
          .from(webVisitorsTable)
          .where(
            and(
              sql`${webVisitorsTable.created_at} >= ${pastEndDateObj} AND ${webVisitorsTable.created_at} <= ${startDateObj}`,
              eq(webVisitorsTable.website_id, websiteId)
            )
          ),
      ]);

    const uniqueVisitorsStats = getUniqueVisitors(sessions, pastSessions);
    const newVisitorsStats = getNewVisitors(visitors, pastVisitors);
    const pages: Record<string, number> = {};

    pageViews.forEach((pageView) => {
      if (!pageView.pathname) return;
      if (!pages[pageView.pathname]) pages[pageView.pathname] = 0;
      pages[pageView.pathname]++;
    });

    const topPages = Object.entries(pages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    await sendEmail({
      email: website.user.email,
      subject: `Your 30-day analytics summary for ${website.name} (${dayjs(
        startDateObj
      ).format("MMMM")})`,
      react: Summary({
        uniqueVisitors: uniqueVisitorsStats,
        newVisitors: newVisitorsStats,
        from: startDateObj.toISOString(),
        to: endDateObj.toISOString(),
        topPages: topPages,
        websiteId: website.id,
        websiteName: website.name,
      }),
    });
  }

  return res.json({ success: true });
}

export default verifySignature(handler);
