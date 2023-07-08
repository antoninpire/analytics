import Widget from "@/app/dashboard/_components/widget";
import { db } from "@/lib/db";
import { logsTable } from "@/lib/db/schema";
import { formatNumber } from "@/lib/utils";
import { BarList } from "@tremor/react";
import { sql } from "drizzle-orm";

export default async function TopSourcesWidget() {
  const logs = await db
    .select({
      referrer: logsTable.referrer,
      count: sql<number>`count(${logsTable.referrer})`.mapWith(Number),
      visits: sql<number>`count(distinct ${logsTable.session_id})`.mapWith(
        Number
      ),
    })
    .from(logsTable)
    .groupBy(logsTable.referrer)
    .orderBy(sql`COUNT(${logsTable.referrer}) DESC`);

  const chartData = logs.map(({ referrer, count }) => ({
    name: referrer || "Direct",
    value: count,
    href: referrer || undefined,
  }));

  return (
    <Widget>
      <Widget.Title>Top Sources</Widget.Title>
      <Widget.Content>
        <div className="grid grid-cols-5 gap-x-4 gap-y-2">
          <div className="col-span-4 text-xs font-semibold tracking-widest text-gray-500 uppercase h-5">
            Refs
          </div>
          <div className="col-span-1 font-semibold text-xs text-right tracking-widest uppercase h-5">
            Visitors
          </div>

          <div className="col-span-4">
            <BarList data={chartData} valueFormatter={(_) => ""} />
          </div>
          <div className="flex flex-col col-span-1 row-span-4 gap-2">
            {logs.map(({ referrer, visits }) => (
              <div
                key={referrer || "Direct"}
                className="flex items-center justify-end w-full text-neutral-64 h-9"
              >
                {formatNumber(visits ?? 0)}
              </div>
            ))}
          </div>
        </div>
      </Widget.Content>
    </Widget>
  );
}
