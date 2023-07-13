"use client";

import { CalendarIcon } from "@radix-ui/react-icons";
import * as React from "react";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

type Props = {
  startDate: Date;
  endDate: Date;
  websiteId: string;
};

export function DateRangePicker({
  className,
  startDate,
  endDate,
  websiteId,
}: Props & React.HTMLAttributes<HTMLDivElement>) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: startDate,
    to: endDate,
  });

  const router = useRouter();

  const handleSelect = (date: DateRange | undefined) => {
    setDate(date);
    if (date?.from !== undefined && date?.to !== undefined)
      router.push(
        "/dashboard/" +
          websiteId +
          "?f=custom&from=" +
          date.from.toISOString() +
          "&to=" +
          date.to.toISOString()
      );
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {dayjs(date.from).format("MMM DD, YYYY")} -{" "}
                  {dayjs(date.to).format("MMM DD, YYYY")}
                </>
              ) : (
                dayjs(date.from).format("MMM DD, YYYY")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
            disabled={{
              after: dayjs().add(1, "day").toDate(),
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
