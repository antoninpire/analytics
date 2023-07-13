"use client";

import { PageData } from "@/app/dashboard/[website]/_components/content";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import { useState } from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type VisitorsEvolutionProps = {
  sessions: PageData["sessions"];
  startDate: Date;
  endDate: Date;
  label: string;
};

const getTimeRange = (startDate: Date, endDate: Date) => {
  const diff = endDate.getTime() - startDate.getTime();
  return diff;
};

export default function VisitorsEvolution(props: VisitorsEvolutionProps) {
  let { sessions, startDate, endDate, label } = props;

  const [unique, setUnique] = useState(true);

  const ONE_DAY = 1000 * 60 * 60 * 24;
  const range = getTimeRange(startDate, endDate);
  const uniqueVisitorsSessions = sessions.filter(
    (session, index, self) =>
      index === self.findIndex((s) => s.visitor_id === session.visitor_id)
  );
  sessions = unique ? uniqueVisitorsSessions : sessions;

  const formatOptions: Intl.DateTimeFormatOptions = {
    // timeZone: timezone,
  };

  if (range / ONE_DAY <= 2) {
    formatOptions.hour = "numeric";
  } else if (range / ONE_DAY <= 364) {
    formatOptions.day = "numeric";
    formatOptions.month = "short";
  } else {
    formatOptions.month = "short";
  }

  const visitors = sessions.reduce((acc, session) => {
    const date = new Date(session.created_at).toLocaleString(
      "default",
      formatOptions
    );
    const isFound = acc.find((p) => p.date === date);
    if (isFound) {
      isFound.visits++;
    } else {
      acc.push({
        originalDate: session.created_at,
        date,
        visits: 1,
      });
    }
    return acc.sort(
      (a, b) =>
        new Date(a.originalDate).getTime() - new Date(b.originalDate).getTime()
    );
  }, [] as { date: string; visits: number; originalDate: Date }[]);

  return (
    <Card className="w-[55%] h-[475px]">
      <CardHeader>
        <CardTitle className="text-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {unique ? "Visitors" : "Sessions"} Evolution
              <span className="text-sm text-gray-400 ml-2">{label}</span>
              <div className="flex items-center gap-1.5 ml-2">
                <Button
                  onClick={() => {
                    setUnique(true);
                  }}
                  size="sm"
                  variant={unique ? "default" : "outline"}
                >
                  Visitors
                </Button>
                <Button
                  onClick={() => {
                    setUnique(false);
                  }}
                  size="sm"
                  variant={!unique ? "default" : "outline"}
                >
                  Sessions
                </Button>
              </div>
            </div>
            <LineChart className="w-6 h-6" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        <div className="flex items-center h-full">
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={visitors}>
              <XAxis
                dataKey="date"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Line dataKey="visits" fill="#fff" label="Visitors" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "black",
                  borderRadius: "10px",
                }}
                itemStyle={{
                  color: "white",
                }}
                label="visitors"
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="tw-custom-tooltip dark:tw-bg-black tw-bg-white/80 tw-px-2 tw-border tw-rounded-md tw-border-gray-700 tw-py-2">
                        <div className=" tw-flex tw-items-center tw-gap-2 dark:tw-text-emphasis tw-text-black">
                          <User size={16} />
                          <p className=" tw-font-medium">{`${
                            payload[0] && payload[0].value
                          } ${name}`}</p>
                        </div>
                        <p className="tw-text-gray-400 tw-text-sm">{label}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
