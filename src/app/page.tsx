import ApiButton from "@/app/api-button";
import { auth } from "@/lib/lucia";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const authRequest = auth.handleRequest({ cookies });
  const { session } = await authRequest.validateUser();
  if (session) redirect("/dashboard");
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ApiButton />
    </main>
  );
}
