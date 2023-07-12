import { PageData } from "@/app/dashboard/[website]/_components/content";
import TopDevicesChart from "@/app/dashboard/[website]/_components/top-devices-chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MonitorSmartphone } from "lucide-react";

type TopDevicesProps = {
  sessions: PageData["sessions"];
};

export default async function TopDevices(props: TopDevicesProps) {
  const { sessions } = props;
  const devices: Record<string, number> = {};

  sessions.forEach((session) => {
    if (!session.device) return;
    if (!devices[session.device]) devices[session.device] = 0;
    devices[session.device]++;
  });

  const topDevices = Object.entries(devices).map(([device, count]) => ({
    name: device,
    value: count,
  }));

  return (
    <Card className="w-[55%] h-[400px]">
      <CardHeader>
        <CardTitle className="text-xl">
          <div className="flex items-center justify-between">
            Top Devices
            <MonitorSmartphone className="w-6 h-6" />
          </div>
        </CardTitle>
        <CardDescription className="h-[20px]">
          All the devices used by your visitors, ranked.
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <div className="flex items-center gap-2 h-full">
          <TopDevicesChart topDevices={topDevices} />
          <div className="w-[55%] h-full">
            <div className="flex items-center justify-between px-2 mb-1.5 text-sm text-gray-400 uppercase">
              <p>Device</p>
              <p>Count</p>
            </div>
            <ScrollArea>
              <div className="flex flex-col gap-2">
                {topDevices.map(({ name, value }, index) => (
                  <div
                    key={"device-" + name}
                    className="flex items-center justify-between relative px-2 py-1"
                  >
                    <p className="text-sm z-10">{name}</p>
                    <p className="text-sm z-10">{value}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
