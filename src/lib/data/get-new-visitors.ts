import { PageData } from "@/app/dashboard/[website]/_components/content";

export function getNewVisitors(
  visitors: PageData["visitors"],
  pastVisitors: PageData["pastVisitors"]
) {
  const count = visitors?.[0]?.count ?? 0;
  const pastCount = pastVisitors?.[0]?.count ?? 0;

  const change = pastCount
    ? Math.floor(((count - pastCount) / pastCount) * 100)
    : 100;
  return {
    total: count,
    change: change > 100 ? 100 : change,
  };
}
