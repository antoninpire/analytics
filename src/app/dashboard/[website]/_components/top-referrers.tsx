import { PageData } from "@/app/dashboard/[website]/_components/content";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowUpRightFromCircle } from "lucide-react";

type TopReferrersProps = {
  sessions: PageData["sessions"];
};

export default async function TopReferrers(props: TopReferrersProps) {
  const { sessions } = props;
  const referrers: Record<string, number> = {};

  sessions.forEach((session) => {
    if (!session.referrer) session.referrer = "Direct";
    if (!referrers[session.referrer]) referrers[session.referrer] = 0;
    referrers[session.referrer]++;
  });

  const topReferrers = Object.entries(referrers).sort((a, b) => b[1] - a[1]);
  const totalReferrers = topReferrers.reduce(
    (acc, [_, count]) => acc + count,
    0
  );

  return (
    <Card className="w-[45%] h-[475px]">
      <CardHeader>
        <CardTitle className="text-xl">
          <div className="flex items-center justify-between">
            Top Sources
            <ArrowUpRightFromCircle className="w-6 h-6" />
          </div>
        </CardTitle>
        <CardDescription className="h-[20px]">
          All the sources of your visitors, ranked.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between px-3 mb-1.5 text-sm text-gray-400 uppercase">
          <p>Source</p>
          <p>Count</p>
        </div>
        <ScrollArea className="h-[250px] px-1">
          <div className="flex flex-col gap-2">
            {topReferrers.map(([page, count]) => (
              <div
                key={"source-" + page}
                className="flex items-center justify-between relative px-2 py-1"
              >
                <div
                  className="absolute top-0 left-0 h-full bg-green-400 dark:bg-green-500 rounded-md"
                  style={{
                    width: `${(count / totalReferrers) * 100}%`,
                  }}
                />
                <p className="text-sm z-10">{page}</p>
                <p className="text-sm z-10">{count}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
