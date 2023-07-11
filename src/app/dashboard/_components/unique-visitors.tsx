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

export default async function UniqueVisitors() {
  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);
  const duration = endDateObj.getTime() - startDateObj.getTime();
  const pastEndDateObj = new Date(startDateObj.getTime() - duration);

  const [sessions, pastSessions] = await Promise.all([
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

  const uniqueValues = new Set();

  sessions.forEach((session) => {
    uniqueValues.add(session.session_id);
  });
  const uniqueVisitor = Array.from(uniqueValues);
  const pastUniqueValues = new Set();
  pastSessions.forEach((session) => {
    pastUniqueValues.add(session.session_id);
  });
  const pastUniqueVisitor = Array.from(pastUniqueValues);
  const change = pastUniqueVisitor.length
    ? Math.floor(
        ((uniqueVisitor.length - pastUniqueVisitor.length) /
          pastUniqueVisitor.length) *
          100
      )
    : 100;

  const stats = {
    total: uniqueVisitor.length,
    change: change > 100 ? 100 : change,
  };

  return (
    <Card className="w-[22vw] h-[200px]">
      <CardHeader>
        <CardTitle className="text-xl">
          <div className="flex items-center justify-between">
            Unique Visitors
            <FaceIcon className="w-6 h-6" />
          </div>
        </CardTitle>
        <CardDescription className="h-[40px]">
          The amount of unique visitors.
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
