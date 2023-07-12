import { PageData } from "@/app/dashboard/[website]/_components/content";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import { Timer } from "lucide-react";

type AverageVisitTimeProps = {
  sessions: PageData["sessions"];
  pastSessions: PageData["pastSessions"];
};

export default async function AverageVisitTime(props: AverageVisitTimeProps) {
  const { sessions, pastSessions } = props;
  sessions.forEach((session) => (session.duration /= 1000));

  let stats = {
    total: "0 sec",
    change: 0,
  };

  const total = sessions.reduce((acc, session) => {
    return acc + session.duration;
  }, 0);
  const pastTotal = pastSessions.reduce((acc, session) => {
    return acc + session.duration;
  }, 0);
  const change = pastTotal
    ? Math.floor(((total - pastTotal) / pastTotal) * 100)
    : 100;
  const seconds = Math.floor(total / sessions.length);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (seconds < 60) {
    stats = {
      total: isNaN(seconds) ? "0 sec" : `${seconds} sec`,
      change: change > 100 ? 100 : change,
    };
  } else {
    stats = {
      total: `${isNaN(minutes) ? 0 : minutes} min ${
        isNaN(remainingSeconds) ? 0 : remainingSeconds
      } sec`,
      change: change > 100 ? 100 : change,
    };
  }

  return (
    <Card className="w-[22vw] h-[200px]">
      <CardHeader>
        <CardTitle className="text-xl">
          <div className="flex items-center justify-between">
            Avg. Visit Time
            <Timer className="w-6 h-6" />
          </div>
        </CardTitle>
        <CardDescription className="h-[40px]">
          The average time spent on your website.
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
