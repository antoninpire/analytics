import AverageVisitTime from "@/app/dashboard/[website]/_components/average-visit-time";
import BounceRate from "@/app/dashboard/[website]/_components/bounce-rate";
import NewVisitors from "@/app/dashboard/[website]/_components/new-visitors";
import PageViews from "@/app/dashboard/[website]/_components/page-views";
import TopBrowsers from "@/app/dashboard/[website]/_components/top-browsers";
import TopCountries from "@/app/dashboard/[website]/_components/top-countries";
import TopDevices from "@/app/dashboard/[website]/_components/top-devices";
import TopPages from "@/app/dashboard/[website]/_components/top-pages";
import TopReferrers from "@/app/dashboard/[website]/_components/top-referrers";
import UniqueVisitors from "@/app/dashboard/[website]/_components/unique-visitors";
import { CurrentValue } from "@/app/dashboard/[website]/page";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { db } from "@/lib/db";
import {
  webPageHitsTable,
  webSessionsTable,
  webVisitorsTable,
} from "@/lib/db/schema";
import { and, eq, sql } from "drizzle-orm";
import Link from "next/link";

type DashboardContentProps = {
  websiteId: string;
  startDate: Date;
  endDate: Date;
  currentValue?: CurrentValue;
};

async function fetchData(
  startDateObj: Date,
  endDateObj: Date,
  pastEndDateObj: Date,
  websiteId: string
) {
  const [
    sessions,
    pastSessions,
    pageViews,
    pastPageViews,
    visitors,
    pastVisitors,
  ] = await Promise.all([
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
        session_id: webPageHitsTable.session_id,
      })
      .from(webPageHitsTable)
      .where(
        and(
          sql`${webPageHitsTable.created_at} >= ${pastEndDateObj} AND ${webPageHitsTable.created_at} <= ${startDateObj}`,
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

  return {
    sessions,
    pastSessions,
    pageViews,
    pastPageViews,
    visitors,
    pastVisitors,
  };
}

export type PageData = Awaited<ReturnType<typeof fetchData>>;

function getLabelFromCurrentValue(currentValue?: CurrentValue) {
  if (currentValue === "yersteday") return "Yersteday";
  else if (currentValue === "last-7") return "Last 7 days";
  else if (currentValue === "last-30") return "Last 30 days";
  else if (currentValue === "last-90") return "Last 90 days";
  else if (currentValue === "last-365") return "Last 365 days";
  else if (currentValue === "custom") return "Custom";
  return "Last 24 hours";
}

export default async function DashboardContent(props: DashboardContentProps) {
  const { websiteId, startDate, endDate, currentValue } = props;

  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);
  const duration = endDateObj.getTime() - startDateObj.getTime();
  const pastEndDateObj = new Date(startDateObj.getTime() - duration);

  const {
    sessions,
    pageViews,
    pastPageViews,
    pastSessions,
    pastVisitors,
    visitors,
  } = await fetchData(startDateObj, endDateObj, pastEndDateObj, websiteId);

  const now = new Date();
  const onlineVisitors = sessions.filter((session) => {
    const diff = now.getTime() - new Date(session.updated_at).getTime();
    return diff < 1000 * 30;
  });

  return (
    <div className="min-h-screen py-5 text-sm leading-5 mt-4 text-secondary">
      <div className="flex items-center justify-between">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary">
              {getLabelFromCurrentValue(currentValue)}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Choose Range</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link href={`/dashboard/${websiteId}?f=last-24h`}>
                <DropdownMenuItem>
                  <DropdownMenuCheckboxItem
                    checked={!currentValue || currentValue === "last-24h"}
                  />
                  Last 24 hours
                </DropdownMenuItem>
              </Link>
              <Link href={`/dashboard/${websiteId}?f=yersteday`}>
                <DropdownMenuItem>
                  <DropdownMenuCheckboxItem
                    checked={currentValue === "yersteday"}
                  />
                  Yersteday
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <Link href={`/dashboard/${websiteId}?f=last-7`}>
              <DropdownMenuItem>
                <DropdownMenuCheckboxItem checked={currentValue === "last-7"} />
                Last 7 days
              </DropdownMenuItem>
            </Link>
            <Link href={`/dashboard/${websiteId}?f=last-30`}>
              <DropdownMenuItem>
                <DropdownMenuCheckboxItem
                  checked={currentValue === "last-30"}
                />
                Last 30 days
              </DropdownMenuItem>
            </Link>
            <Link href={`/dashboard/${websiteId}?f=last-90`}>
              <DropdownMenuItem>
                <DropdownMenuCheckboxItem
                  checked={currentValue === "last-90"}
                />
                Last 90 days
              </DropdownMenuItem>
            </Link>
            <Link href={`/dashboard/${websiteId}?f=last-365`}>
              <DropdownMenuItem>
                <DropdownMenuCheckboxItem
                  checked={currentValue === "last-365"}
                />
                Last 365 days
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <Link href={`/dashboard/${websiteId}?f=custom`}>
              <DropdownMenuItem>
                <DropdownMenuCheckboxItem checked={currentValue === "custom"} />
                Custom
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex items-center gap-1.5">
          <div
            className={`w-4 h-4 rounded-full ${
              onlineVisitors.length === 0 ? "bg-orange-500" : "bg-green-500"
            }`}
          />
          <p className="dark:text-white text-black">
            {onlineVisitors.length} users online
          </p>
        </div>
      </div>

      <div className="flex items-center gap-5 mt-4 justify-center">
        <UniqueVisitors pastSessions={pastSessions} sessions={sessions} />
        <PageViews pageViews={pageViews} pastPageViews={pastPageViews} />
        <AverageVisitTime pastSessions={pastSessions} sessions={sessions} />
      </div>
      <div className="flex items-center gap-5 mt-5 justify-center">
        <BounceRate
          pageViews={pageViews}
          pastPageViews={pastPageViews}
          pastSessions={pastSessions}
          sessions={sessions}
        />
        <NewVisitors pastVisitors={pastVisitors} visitors={visitors} />
      </div>
      <div className="flex gap-5 items-center mt-5">
        <TopDevices sessions={sessions} />
        <TopReferrers sessions={sessions} />
      </div>
      <div className="flex justify-between gap-5 items-center mt-5">
        <TopPages pageViews={pageViews} />
        <TopBrowsers sessions={sessions} />
      </div>
      <div className="mt-5">
        <TopCountries sessions={sessions} />
      </div>
    </div>
  );
}
