import { PageData } from "@/app/dashboard/[website]/_components/content";
import TopBrowsersChart from "@/app/dashboard/[website]/_components/top-browsers-chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MonitorSmartphone } from "lucide-react";

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

  const topBrowsers = Object.entries(browsers).map(([device, count]) => ({
    name: device,
    value: count,
  }));

  return (
    <Card className="w-[55%] h-[400px]">
      <CardHeader>
        <CardTitle className="text-xl">
          <div className="flex items-center justify-between">
            Top Browsers
            <MonitorSmartphone className="w-6 h-6" />
          </div>
        </CardTitle>
        <CardDescription className="h-[20px]">
          All the browsers used by your visitors, ranked.
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <div className="flex items-center gap-2 h-full">
          <div className="w-[55%] h-full">
            <div className="flex items-center justify-between px-2 mb-1.5 text-sm text-gray-400 uppercase">
              <p>Browser</p>
              <p>Count</p>
            </div>
            <ScrollArea>
              <div className="flex flex-col gap-2">
                {topBrowsers.map(({ name, value }, index) => (
                  <div
                    key={"browser-" + name}
                    className="flex items-center justify-between relative px-2 py-1"
                  >
                    <p className="text-sm z-10">{name}</p>
                    <p className="text-sm z-10">{value}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
          <TopBrowsersChart topBrowsers={topBrowsers} />
        </div>
      </CardContent>
    </Card>
  );
}
