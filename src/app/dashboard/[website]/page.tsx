import AverageVisitTime from "@/app/dashboard/_components/average-visit-time";
import BounceRate from "@/app/dashboard/_components/bounce-rate";
import FirstRowLoader from "@/app/dashboard/_components/first-row-loader";
import Header from "@/app/dashboard/_components/header";
import PageViews from "@/app/dashboard/_components/page-views";
import UniqueVisitors from "@/app/dashboard/_components/unique-visitors";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Suspense } from "react";

export default async function WebsitePage({
  params,
}: {
  params: { website: string };
}) {
  const { website } = params;
  return (
    <>
      <Header website={website} />
      <div className="min-h-screen py-5 text-sm leading-5 mt-4 text-secondary">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary">Last 24 hours</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Choose Range</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <DropdownMenuCheckboxItem checked />
                Last 24 hours
              </DropdownMenuItem>
              <DropdownMenuItem>
                <DropdownMenuCheckboxItem />
                Yersteday
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <DropdownMenuCheckboxItem />
              Last 7 days
            </DropdownMenuItem>
            <DropdownMenuItem>
              <DropdownMenuCheckboxItem />
              Last 30 days
            </DropdownMenuItem>
            <DropdownMenuItem>
              <DropdownMenuCheckboxItem />
              Last 90 days
            </DropdownMenuItem>
            <DropdownMenuItem>
              <DropdownMenuCheckboxItem />
              Last 365 days
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Custom</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex items-center gap-5">
          <Suspense fallback={<FirstRowLoader />}>
            <UniqueVisitors />
          </Suspense>
          <PageViews />
          <AverageVisitTime />
          <BounceRate />
        </div>
      </div>
    </>
  );
}
