import { PageData } from "@/app/dashboard/[website]/_components/content";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapPin } from "lucide-react";

type TopCountriesProps = {
  sessions: PageData["sessions"];
};

export default async function TopCountries(props: TopCountriesProps) {
  const { sessions } = props;
  const countries: Record<string, number> = {};

  sessions.forEach((session) => {
    if (!session.country) return;
    if (!countries[session.country]) countries[session.country] = 0;
    countries[session.country]++;
  });

  const topCountries = Object.entries(countries).sort((a, b) => b[1] - a[1]);
  const totalCountries = topCountries.reduce(
    (acc, [_, count]) => acc + count,
    0
  );

  const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

  return (
    <Card className="w-[35vw] h-[400px]">
      <CardHeader>
        <CardTitle className="text-xl">
          <div className="flex items-center justify-between">
            Top Countries
            <MapPin className="w-6 h-6" />
          </div>
        </CardTitle>
        <CardDescription className="h-[20px]">
          All the countries of your visitors, ranked.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between px-3 mb-1.5 text-sm text-gray-400 uppercase">
          <p>Country</p>
          <p>Count</p>
        </div>
        <ScrollArea className="h-[250px] px-1">
          <div className="flex flex-col gap-2">
            {topCountries.map(([country, count]) => (
              <div
                key={"country-" + country}
                className="flex items-center justify-between relative px-2 py-1"
              >
                <div
                  className="absolute top-0 left-0 h-full bg-orange-400 dark:bg-orange-500 rounded-md"
                  style={{
                    width: `${(count / totalCountries) * 100}%`,
                  }}
                />
                <p className="text-sm z-10">
                  {regionNames.of(country) ?? country ?? "Unknown"}
                </p>
                <p className="text-sm z-10">{count}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
