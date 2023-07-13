import AddWebsiteDialog from "@/app/dashboard/_components/add-website-dialog";
import EditWebsiteDialog from "@/app/dashboard/_components/edit-website-dialog";
import Header from "@/app/dashboard/_components/header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { db } from "@/lib/db";
import { auth } from "@/lib/lucia";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardExample() {
  const authRequest = auth.handleRequest({ cookies });
  const { session } = await authRequest.validateUser();
  if (!session) redirect("/login");
  const websites = await db.query.websitesTable.findMany({
    where: (table, { eq }) => eq(table.user_id, session.userId),
  });
  return (
    <>
      <Header websites={websites} />
      <div className="h-full w-full px-8 py-5 mt-4">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">Websites</h1>
          <AddWebsiteDialog />
        </div>
        <p className="text-gray-500 text-lg dark:text-gray-700 mt-1">
          Manage all your websites here
        </p>
        {websites.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-4 items-center">
            {websites.map((website) => (
              <Card
                key={website.id}
                className="w-[300px] h-[150px] rounded-lg shadow-md p-4"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{website.name}</h3>
                  <EditWebsiteDialog website={website} />
                </div>
                <p className="text-sm">{website.url}</p>
                <div className="mt-8 flex justify-end items-center">
                  <Link href={`/dashboard/${website.id}`}>
                    <Button variant="link">Go to dashboard</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
        {websites.length === 0 && (
          <div className="mt-8 flex justify-center h-[75%] items-center">
            <p className="text-gray-500 dark:text-gray-700 mt-1">
              No website yet.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
