import KpisTabs, { KPI_OPTIONS } from "@/app/dashboard/_components/kpis-tabs";
import Widget from "@/app/dashboard/_components/widget";
import { db } from "@/lib/db";
import { logsTable } from "@/lib/db/schema";
import { AreaChart } from "@tremor/react";
import dayjs from "dayjs";
import { sql } from "drizzle-orm";

const kpiOption = KPI_OPTIONS.find(({ value }) => value === "visits")!;

export default async function KpisWidget() {
  const logs = await db
    .select({
      pageViews: sql<number>`count(${logsTable.session_id})`.mapWith(Number),
      visits: sql<number>`count(distinct ${logsTable.session_id})`.mapWith(
        Number
      ),
      created_at: logsTable.created_at,
      session_id: logsTable.session_id,
    })
    .from(logsTable)
    .groupBy(logsTable.created_at, logsTable.session_id);
  // .orderBy(sql`COUNT(${logsTable.session_id}) DESC`);

  const chartData = logs.map((log) => ({
    Date: dayjs(log.created_at).format("HH:mm"),
    "Number of visits": log.visits,
  }));

  return (
    <Widget>
      <Widget.Title>KPIS</Widget.Title>
      <KpisTabs />
      <Widget.Content>
        <AreaChart
          data={chartData}
          index="Date"
          categories={[kpiOption.label]}
          colors={["blue"]}
          // valueFormatter={kpiOption.formatter}
          showLegend={false}
        />
      </Widget.Content>
    </Widget>
  );
}
