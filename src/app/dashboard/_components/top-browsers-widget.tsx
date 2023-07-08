import Widget from "@/app/dashboard/_components/widget";
import { db } from "@/lib/db";
import { logsTable } from "@/lib/db/schema";
import { tremorPieChartColors } from "@/lib/theme";
import { formatNumber, getBrowser } from "@/lib/utils";
import { DonutChart } from "@tremor/react";
import { sql } from "drizzle-orm";
import { Fragment } from "react";

export default async function TopBrowsersWidget() {
  const logs = await db
    .select({
      user_agent: logsTable.user_agent,
      count: sql<number>`count(${logsTable.user_agent})`.mapWith(Number),
      visits: sql<number>`count(distinct ${logsTable.session_id})`.mapWith(
        Number
      ),
    })
    .from(logsTable)
    .groupBy(logsTable.user_agent)
    .orderBy(sql`COUNT(${logsTable.user_agent}) DESC`);

  return (
    <Widget>
      <Widget.Title>Top Browsers</Widget.Title>
      <Widget.Content>
        <div className="w-full h-full grid grid-cols-2">
          <DonutChart
            data={logs}
            category="visits"
            index="device"
            colors={tremorPieChartColors.map(([color]) => color)}
            showLabel={false}
            // valueFormatter={formatNumber}
          />
          <div className="justify-self-end">
            <div className="grid grid-cols-2 gap-y-1 gap-4">
              <div className="text-xs tracking-widest font-medium uppercase text-center truncate">
                Device
              </div>
              <div className="text-xs tracking-widest font-medium uppercase text-right truncate">
                Visitors
              </div>
              {logs.map(({ user_agent, visits }, index) => (
                <Fragment key={getBrowser(user_agent)}>
                  <div className="flex items-center gap-2 text-sm leading-5 text-neutral-64 h-9 px-4 py-2 rounded-md z-10">
                    <div
                      className="h-4 min-w-[1rem]"
                      style={{
                        backgroundColor: tremorPieChartColors[index][1],
                      }}
                    />
                    <span>{getBrowser(user_agent)}</span>
                  </div>
                  <div className="flex items-center justify-end text-neutral-64 h-9">
                    {formatNumber(visits)}
                  </div>
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </Widget.Content>
    </Widget>
  );
}
