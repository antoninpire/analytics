import Widget from "@/app/dashboard/_components/widget";
import { db } from "@/lib/db";
import { logsTable } from "@/lib/db/schema";
import { BarChart } from "@tremor/react";
import dayjs from "dayjs";
import { sql } from "drizzle-orm";

export default async function OnlineUsersWidget() {
  const logs = await db
    .select({
      count: sql<number>`count(${logsTable.session_id})`.mapWith(Number),
      visits: sql<number>`count(distinct ${logsTable.session_id})`.mapWith(
        Number
      ),
      created_at: logsTable.created_at,
    })
    .from(logsTable)
    .groupBy(logsTable.session_id, logsTable.created_at)
    .orderBy(sql`${logsTable.created_at} ASC`);

  const chartData = logs.map((log) => ({
    Date: dayjs(log.created_at).format("HH:mm"),
    "Number of visits": log.visits,
  }));

  return (
    <Widget>
      <Widget.Title>Users in last 30 minutes</Widget.Title>
      <Widget.Content>
        <BarChart
          data={chartData}
          index="Date"
          categories={["Number of visits"]}
          colors={["blue"]}
          className="h-32"
          showXAxis={false}
          showYAxis={false}
          showLegend={false}
          showGridLines={false}
        />
      </Widget.Content>
    </Widget>
  );
}
