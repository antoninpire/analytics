import { PageData } from "@/app/dashboard/[website]/_components/content";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getNewVisitors } from "@/lib/data/get-new-visitors";
import { ArrowBottomLeftIcon, ArrowTopRightIcon } from "@radix-ui/react-icons";
import { UserPlus } from "lucide-react";

type NewVisitorsProps = {
  visitors: PageData["visitors"];
  pastVisitors: PageData["pastVisitors"];
};

export default async function NewVisitors(props: NewVisitorsProps) {
  const { visitors, pastVisitors } = props;

  const stats = getNewVisitors(visitors, pastVisitors);

  return (
    <Card className="w-[22vw] h-[200px]">
      <CardHeader>
        <CardTitle className="text-xl">
          <div className="flex items-center justify-between">
            New Visitors
            <UserPlus className="w-6 h-6" />
          </div>
        </CardTitle>
        <CardDescription className="h-[40px]">
          The amount of new visitors.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{stats.total}</p>
        <div className="flex items-center gap-1 text-sm">
          {stats.change >= 0 && (
            <ArrowTopRightIcon className="text-green-500" />
          )}
          {stats.change < 0 && <ArrowBottomLeftIcon className="text-red-500" />}{" "}
          {stats.change}%
        </div>
      </CardContent>
    </Card>
  );
}
