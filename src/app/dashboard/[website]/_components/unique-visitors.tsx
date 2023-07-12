import { PageData } from "@/app/dashboard/[website]/_components/content";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import { User } from "lucide-react";

type UniqueVisitorsProps = {
  sessions: PageData["sessions"];
  pastSessions: PageData["pastSessions"];
};

export default async function UniqueVisitors(props: UniqueVisitorsProps) {
  const { sessions, pastSessions } = props;

  const allVisitors = new Set<string>(),
    allPastVisitors = new Set<string>();
  sessions.forEach((session) => {
    allVisitors.add(session.visitor_id);
  });
  pastSessions.forEach((session) => {
    allPastVisitors.add(session.visitor_id);
  });

  const visitors = allVisitors.size;
  const pastVisitors = allPastVisitors.size;

  const change = visitors
    ? Math.floor(((visitors - pastVisitors) / pastVisitors) * 100)
    : 100;

  const stats = {
    total: visitors,
    change: change > 100 ? 100 : change,
  };

  return (
    <Card className="w-[22vw] h-[200px]">
      <CardHeader>
        <CardTitle className="text-xl">
          <div className="flex items-center justify-between">
            Unique Visitors
            <User className="w-6 h-6" />
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
