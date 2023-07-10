import AverageVisitTime from "@/app/dashboard2/_components/average-visit-time";
import BounceRate from "@/app/dashboard2/_components/bounce-rate";
import FirstRowLoader from "@/app/dashboard2/_components/first-row-loader";
import PageViews from "@/app/dashboard2/_components/page-views";
import UniqueVisitors from "@/app/dashboard2/_components/unique-visitors";
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

export default function DashboardExample() {
  return (
    <div className="min-h-screen py-5 px-5 sm:px-10 text-sm leading-5 text-secondary">
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
  );
}
