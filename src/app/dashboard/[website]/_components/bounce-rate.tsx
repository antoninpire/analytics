import { PageData } from "@/app/dashboard/[website]/_components/content";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowBottomLeftIcon } from "@radix-ui/react-icons";
import { Activity } from "lucide-react";

type BounceRateProps = {
  sessions: PageData["sessions"];
  pastSessions: PageData["pastSessions"];
  pageViews: PageData["pageViews"];
  pastPageViews: PageData["pastPageViews"];
};

export default async function BounceRate(props: BounceRateProps) {
  const { pageViews, pastPageViews, pastSessions, sessions } = props;

  let stats = {
    total: 0,
    change: 0,
  };
  const totalSessions = sessions.length;
  const totalPageViews = pageViews.length;
  if (totalSessions === 0 || totalPageViews === 0)
    stats = {
      total: 0,
      change: 0,
    };
  else {
    const singlePageViewSessions = sessions.filter((session) => {
      const sessionPageViews = pageViews.filter(
        (pageView) => pageView.session_id === session.id
      );
      return sessionPageViews.length === 1;
    });
    const pastSinglePageViewSessions = pastSessions.filter((session) => {
      const sessionPageViews = pastPageViews.filter(
        (pageView) => pageView.session_id === session.id
      );
      return sessionPageViews.length === 1;
    });
    const bounceRate = (singlePageViewSessions.length / sessions.length) * 100;
    const pastBounceRate =
      (pastSinglePageViewSessions.length / pastSessions.length) * 100;
    const change = pastBounceRate
      ? Math.floor(((bounceRate - pastBounceRate) / pastBounceRate) * 100)
      : 100;
    stats = {
      total: parseFloat(bounceRate.toFixed(2)),
      change: change > 100 ? 100 : parseFloat(change.toFixed(2)),
    };
  }

  return (
    <Card className="w-[22vw] h-[200px]">
      <CardHeader>
        <CardTitle className="text-xl">
          <div className="flex items-center justify-between">
            Bounce Rate
            <Activity className="w-6 h-6" />
          </div>
        </CardTitle>
        <CardDescription className="h-[40px]">
          The percentage of users who left your website and exited quickly.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{stats.total}%</p>
        <div className="flex items-center gap-1 text-sm">
          <ArrowBottomLeftIcon className="text-red-500" />
          {stats.change}%
        </div>
      </CardContent>
    </Card>
  );
}
