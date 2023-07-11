import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Analytics Dashboard",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="w-[80%] mx-auto py-5 h-screen">{children}</div>;
}
