import { PageData } from "@/app/dashboard/[website]/_components/content";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import { Eye } from "lucide-react";

type PageViewsProps = {
  pageViews: PageData["pageViews"];
  pastPageViews: PageData["pastPageViews"];
};

export default async function PageViews(props: PageViewsProps) {
  const { pageViews, pastPageViews } = props;

  const hits = pageViews.length;
  const pastHits = pastPageViews.length;

  const change = pastHits
    ? Math.floor(((hits - pastHits) / pastHits) * 100)
    : 100;

  const stats = {
    total: hits,
    change: change > 100 ? 100 : change,
  };

  return (
    <Card className="w-[22vw] h-[200px]">
      <CardHeader>
        <CardTitle className="text-xl">
          <div className="flex items-center justify-between">
            Page Views
            <Eye className="w-6 h-6" />
          </div>
        </CardTitle>
        <CardDescription className="h-[40px]">
          The amount of page views, dupplicates are also counted.
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
