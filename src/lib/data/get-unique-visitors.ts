import { PageData } from "@/app/dashboard/[website]/_components/content";

export function getUniqueVisitors(
  sessions: PageData["sessions"],
  pastSessions: PageData["pastSessions"]
) {
  const allVisitors = new Set<string>(),
    allPastVisitors = new Set<string>();
  sessions.forEach((session) => {
    allVisitors.add(session.visitor_id);
  });
  pastSessions.forEach((session) => {
    allPastVisitors.add(session.visitor_id);
  });

  const visitors = allVisitors.size;
  const pastVisitors = allPastVisitors.size;

  const change = visitors
    ? Math.floor(((visitors - pastVisitors) / pastVisitors) * 100)
    : 100;

  return {
    total: visitors,
    change: change > 100 ? 100 : change,
  };
}
