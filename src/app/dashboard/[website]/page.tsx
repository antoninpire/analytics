import DashboardContent from "@/app/dashboard/[website]/_components/content";
import CopySnippetButton from "@/app/dashboard/[website]/_components/copy-snippet-button";
import Header from "@/app/dashboard/_components/header";
import { db } from "@/lib/db";
import { webVisitorsTable } from "@/lib/db/schema";
import dayjs from "dayjs";
import { eq, sql } from "drizzle-orm";

export type CurrentValue =
  | "last-24h"
  | "yersteday"
  | "last-7"
  | "last-30"
  | "last-90"
  | "last-365"
  | "custom";

type DateSearchParams = {
  f?: CurrentValue;
};

function getDatesFromCurrentValue(currentValue?: CurrentValue) {
  if (currentValue === "yersteday")
    return {
      startDate: dayjs().subtract(1, "day").startOf("day").toDate(),
      endDate: dayjs().subtract(1, "day").endOf("day").toDate(),
    };
  else if (currentValue === "last-7")
    return {
      startDate: dayjs().subtract(7, "day").startOf("day").toDate(),
      endDate: dayjs().toDate(),
    };
  else if (currentValue === "last-30")
    return {
      startDate: dayjs().subtract(30, "day").startOf("day").toDate(),
      endDate: dayjs().toDate(),
    };
  else if (currentValue === "last-90")
    return {
      startDate: dayjs().subtract(90, "day").startOf("day").toDate(),
      endDate: dayjs().toDate(),
    };
  else if (currentValue === "last-365")
    return {
      startDate: dayjs().subtract(365, "day").startOf("day").toDate(),
      endDate: dayjs().toDate(),
    };
  return {
    startDate: dayjs().subtract(1, "day").toDate(),
    endDate: dayjs().toDate(),
  };
}

export default async function WebsitePage({
  params,
  searchParams,
}: {
  params: { website: string };
  searchParams?: DateSearchParams & {
    [key: string]: string | string[] | undefined;
  };
}) {
  const { website } = params;
  const script = `<script defer data-token="${website}"\n src="https://analytics.antonin.dev/static/script.js">\n</script>`;

  const currentValue = searchParams?.f ?? "last-24h";

  const { startDate, endDate } = getDatesFromCurrentValue(currentValue);

  const visitors = await db
    .select({
      count: sql<number>`COUNT(*)`.mapWith(Number),
    })
    .from(webVisitorsTable)
    .where(eq(webVisitorsTable.website_id, website));

  const visitorsCount = visitors?.[0]?.count ?? 0;

  return (
    <>
      <Header website={website} />
      {visitorsCount === 0 && (
        <div className="h-[90%] w-full flex justify-center items-center flex-col gap-3">
          <p>You didn&apos;t get any visitors yet.</p>
          <p>
            To get started, simply copy this snippet below and add it to the
            <b>{" <head>"}</b> of your website
          </p>
          <pre className="mt-2 rounded-md bg-muted p-4 relative font-mono text-sm">
            <CopySnippetButton snippet={script} />
            <code>{script}</code>
          </pre>
        </div>
      )}
      {visitorsCount !== 0 && (
        <DashboardContent
          websiteId={website}
          startDate={startDate}
          endDate={endDate}
          currentValue={currentValue}
        />
      )}
    </>
  );
}
