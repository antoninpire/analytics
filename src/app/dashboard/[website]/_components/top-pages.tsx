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

type TopPagesProps = {
  pageViews: PageData["pageViews"];
};

export default async function TopPages(props: TopPagesProps) {
  const { pageViews } = props;
  const pages: Record<string, number> = {};

  pageViews.forEach((pageView) => {
    if (!pageView.pathname) return;
    if (!pages[pageView.pathname]) pages[pageView.pathname] = 0;
    pages[pageView.pathname]++;
  });

  const topPages = Object.entries(pages).sort((a, b) => b[1] - a[1]);
  const totalPages = topPages.reduce((acc, [_, count]) => acc + count, 0);

  return (
    <Card className="w-[45%] h-[400px]">
      <CardHeader>
        <CardTitle className="text-xl">
          <div className="flex items-center justify-between">
            Top Pages
            <Chrome className="w-6 h-6" />
          </div>
        </CardTitle>
        <CardDescription className="h-[20px]">
          All the pages visited by your visitors, ranked.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between px-3 mb-1.5 text-sm text-gray-400 uppercase">
          <p>Page</p>
          <p>Count</p>
        </div>
        <ScrollArea className="h-[250px] px-1">
          <div className="flex flex-col gap-2">
            {topPages.map(([page, count]) => (
              <div
                key={"page-" + page}
                className="flex items-center justify-between relative px-2 py-1"
              >
                <div
                  className="absolute top-0 left-0 h-full bg-red-400 dark:bg-red-500 rounded-md"
                  style={{
                    width: `${(count / totalPages) * 100}%`,
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
