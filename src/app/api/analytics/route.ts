import { db } from "@/lib/db";
import {
  webPageHitsTable,
  webSessionsTable,
  webVisitorsTable,
} from "@/lib/db/schema";
import { createId } from "@paralleldrive/cuid2";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  session_id: z.string().min(1),
  locale: z.string().min(1),
  location: z.string().min(1),
  referrer: z.string(),
  pathname: z.string().min(1),
  href: z.string().min(1),
  queryParams: z.record(z.string(), z.string()),
  os: z.string().min(1),
  device: z.string().min(1),
  browser: z.string().min(1),
  duration: z.number().min(0),
  timestamp: z.string().min(1),
  website_token: z.string().min(1),
});

export async function POST(request: Request) {
  const body = await request.json();

  const validated = schema.parse(body);

  const website = await db.query.websitesTable.findFirst({
    where: (table, { eq }) => eq(table.id, validated.website_token),
  });

  if (!website) return new NextResponse("Website not found", { status: 404 });

  const currentWebsiteUrl = new URL(request.url);
  const websiteUrl = new URL(website.url);

  console.log(
    request.url,
    website.url,
    currentWebsiteUrl.origin,
    websiteUrl.origin
  );

  if (currentWebsiteUrl.origin !== websiteUrl.origin)
    return new NextResponse("Website not found", { status: 405 });

  let ip = request.headers.get("x-real-ip") as string;

  const forwardedFor = request.headers.get("x-forwarded-for") as string;
  if (!ip && forwardedFor) {
    ip = forwardedFor?.split(",").at(0) ?? "Unknown";
  }

  const session = await db.query.webSessionsTable.findFirst({
    where: (table, { eq }) => eq(table.id, validated.session_id),
  });

  const pageHitId = createId();

  if (session === undefined) {
    // Session doesnt exist

    const visitorId = ip === "Unknown" ? createId() : ip;

    const visitor = await db.query.webVisitorsTable.findFirst({
      where: (table, { eq }) => eq(table.id, visitorId),
    });

    if (!visitor) {
      // Visitor doesnt exist
      await db.insert(webVisitorsTable).values({
        id: visitorId,
        created_at: new Date(validated.timestamp),
      });
      await db.insert(webSessionsTable).values({
        id: validated.session_id,
        visitor_id: visitorId,
        referrer: validated.referrer,
        duration: validated.duration,
        country: validated.location,
        city: validated.location,
        device: validated.device,
        os: validated.os,
        browser: validated.browser,
        language: validated.locale,
        created_at: new Date(validated.timestamp),
        query_params: JSON.stringify(validated.queryParams),
      });
      await db.insert(webPageHitsTable).values({
        created_at: new Date(validated.timestamp),
        session_id: validated.session_id,
        visitor_id: visitorId,
        href: validated.href,
        referrer: validated.referrer,
        pathname: validated.pathname,
        query_params: JSON.stringify(validated.queryParams),
        id: pageHitId,
      });
    } else {
      // Visitor already exists
      await db.insert(webSessionsTable).values({
        id: validated.session_id,
        visitor_id: visitorId,
        referrer: validated.referrer,
        duration: validated.duration,
        country: validated.location,
        city: validated.location,
        device: validated.device,
        os: validated.os,
        browser: validated.browser,
        language: validated.locale,
        created_at: new Date(validated.timestamp),
        query_params: JSON.stringify(validated.queryParams),
      });
      await db.insert(webPageHitsTable).values({
        created_at: new Date(validated.timestamp),
        session_id: validated.session_id,
        visitor_id: visitorId,
        href: validated.href,
        referrer: validated.referrer,
        pathname: validated.pathname,
        query_params: JSON.stringify(validated.queryParams),
        id: pageHitId,
      });
    }
  } else {
    // Session exists
    if (validated.duration > session.duration) {
      const pageHit = await db.query.webPageHitsTable.findFirst({
        where: (table, { and, eq }) =>
          and(
            eq(table.session_id, validated.session_id),
            eq(table.pathname, validated.pathname)
          ),
      });

      if (!pageHit)
        await Promise.all([
          db
            .update(webSessionsTable)
            .set({
              duration: validated.duration,
            })
            .where(eq(webSessionsTable.id, validated.session_id)),
          db.insert(webPageHitsTable).values({
            created_at: new Date(validated.timestamp),
            session_id: validated.session_id,
            visitor_id: session.visitor_id,
            href: validated.href,
            referrer: validated.referrer,
            pathname: validated.pathname,
            query_params: JSON.stringify(validated.queryParams),
            id: pageHitId,
          }),
        ]);
      else
        await db
          .update(webSessionsTable)
          .set({
            duration: validated.duration,
          })
          .where(eq(webSessionsTable.id, validated.session_id));
    }
  }
}
