import Widget from "@/app/dashboard/_components/widget";
import { db } from "@/lib/db";
import { logsTable } from "@/lib/db/schema";
import { cx, formatNumber } from "@/lib/utils";
import { BarList } from "@tremor/react";
import { sql } from "drizzle-orm";

export default async function TopPagesWidget() {
  const logs = await db
    .select({
      pathname: logsTable.pathname,
      count: sql<number>`count(${logsTable.pathname})`.mapWith(Number),
      visits: sql<number>`count(distinct ${logsTable.session_id})`.mapWith(
        Number
      ),
    })
    .from(logsTable)
    .groupBy(logsTable.pathname)
    .orderBy(sql`COUNT(${logsTable.pathname}) DESC`);

  const chartData = logs.map(({ pathname, count }) => ({
    name: pathname,
    value: count,
    href: `/dashboard/logs?pathname=${pathname}`,
  }));

  return (
    <Widget>
      <Widget.Title>Top Pages</Widget.Title>
      <Widget.Content>
        <div className="grid grid-cols-5 gap-x-4 gap-y-2">
          <div className="col-span-3 text-xs font-semibold tracking-widest text-gray-500 uppercase h-5">
            Content
          </div>
          <div
            className={cx(
              "col-span-1 font-semibold text-xs text-right tracking-widest uppercase cursor-pointer h-5"
              //   sorting === TopPagesSorting.Visitors && 'text-primary'
            )}
            // onClick={() => setSorting(TopPagesSorting.Visitors)}
          >
            Visits
          </div>
          <div
            className={cx(
              "col-span-1 row-span-1 font-semibold text-xs text-right tracking-widest uppercase cursor-pointer h-5"
              //   sorting === TopPagesSorting.Pageviews && 'text-primary'
            )}
            // onClick={() => setSorting(TopPagesSorting.Pageviews)}
          >
            Pageviews
          </div>

          <div className="col-span-3">
            <BarList data={chartData} valueFormatter={(_) => ""} />
          </div>
          <div className="flex flex-col col-span-1 row-span-4 gap-2">
            {logs.map(({ pathname, visits }) => (
              <div
                key={pathname}
                className="flex items-center justify-end w-full text-neutral-64 h-9"
              >
                {formatNumber(visits ?? 0)}
              </div>
            ))}
          </div>
          <div className="flex flex-col col-span-1 row-span-4 gap-2">
            {logs.map(({ pathname, count }) => (
              <div
                key={pathname}
                className="flex items-center justify-end w-full text-neutral-64 h-9"
              >
                {formatNumber(count)}
              </div>
            ))}
          </div>
        </div>
      </Widget.Content>
    </Widget>
  );
}
