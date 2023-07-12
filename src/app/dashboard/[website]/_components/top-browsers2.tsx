import { PageData } from "@/app/dashboard/[website]/_components/content";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Chrome } from "lucide-react";

type TopBrowsersProps = {
  sessions: PageData["sessions"];
};

export default async function TopBrowsers(props: TopBrowsersProps) {
  const { sessions } = props;
  const browsers: Record<string, number> = {};

  sessions.forEach((session) => {
    if (!session.browser) return;
    if (!browsers[session.browser]) browsers[session.browser] = 0;
    browsers[session.browser]++;
  });

  const topBrowsers = Object.entries(browsers).sort((a, b) => b[1] - a[1]);
  const totalBrowsers = topBrowsers.reduce((acc, [_, count]) => acc + count, 0);

  return (
    <Card className="w-[35vw] h-[400px]">
      <CardHeader>
        <CardTitle className="text-xl">
          <div className="flex items-center justify-between">
            Top Browsers
            <Chrome className="w-6 h-6" />
          </div>
        </CardTitle>
        <CardDescription className="h-[20px]">
          All the browsers used by your visitors, ranked.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between px-2 mb-1.5 text-sm text-gray-400 uppercase">
          <p>Browser</p>
          <p>Count</p>
        </div>
        <ScrollArea>
          <div className="flex flex-col gap-2">
            {topBrowsers.map(([device, count]) => (
              <div
                key={"device-" + device}
                className="flex items-center justify-between relative px-2 py-1"
              >
                <div
                  className="absolute top-0 left-0 h-full bg-blue-400 rounded-md"
                  style={{
                    width: `${(count / totalBrowsers) * 100}%`,
                  }}
                />
                <p className="text-sm z-10">{device}</p>
                <p className="text-sm z-10">{count}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
