import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/lib/db";
import { logsTable } from "@/lib/db/schema";
import { ArrowTopRightIcon, FaceIcon } from "@radix-ui/react-icons";
import dayjs from "dayjs";
import { sql } from "drizzle-orm";

const startDate = dayjs("2023-06-15").startOf("month").toDate();
const endDate = dayjs("2023-07-15").endOf("month").toDate();

export default async function PageViews() {
  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);
  const duration = endDateObj.getTime() - startDateObj.getTime();
  const pastEndDateObj = new Date(startDateObj.getTime() - duration);

  const [pageViews, pastPageViews] = await Promise.all([
    db
      .select()
      .from(logsTable)
      .where(
        sql`${logsTable.created_at} >= ${startDateObj} AND ${logsTable.created_at} <= ${endDateObj}`
      ),
    db
      .select()
      .from(logsTable)
      .where(
        sql`${logsTable.created_at} >= ${pastEndDateObj} AND ${logsTable.created_at} <= ${startDateObj}`
      ),
  ]);

  const change = pastPageViews.length
    ? Math.floor(
        ((pageViews.length - pastPageViews.length) / pastPageViews.length) * 100
      )
    : 100;

  const stats = {
    total: pageViews.length,
    change: change > 100 ? 100 : change,
  };

  return (
    <Card className="w-[22vw] h-[200px]">
      <CardHeader>
        <CardTitle className="text-xl">
          <div className="flex items-center justify-between">
            Page Views
            <FaceIcon className="w-6 h-6" />
          </div>
        </CardTitle>
        <CardDescription className="h-[40px]">
          The amount of page views, dupplicates are also counted.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{stats.total}</p>
        <div className="flex items-center gap-1 text-sm">
          <ArrowTopRightIcon className="text-green-500" />
          {stats.change}%
        </div>
      </CardContent>
    </Card>
  );
}
