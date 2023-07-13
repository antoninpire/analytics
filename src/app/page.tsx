import { ThemeToggle } from "@/app/dashboard/_components/theme-toggle";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/lucia";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const authRequest = auth.handleRequest({ cookies });
  const { session } = await authRequest.validateUser();
  if (session) redirect("/dashboard");
  return (
    <main className="h-screen w-screen flex justify-center items-center">
      <header className="fixed top-0 left-0 w-full justify-end flex px-8 gap-2 items-center pt-5">
        <ThemeToggle />
        <Link href="/login">
          <Button>Login</Button>
        </Link>
        <Link href="/signup">
          <Button variant="outline">Sign Up</Button>
        </Link>
      </header>
      <div className="flex flex-col gap-5">
        <h1 className="text-6xl font-bold">Analytics</h1>
        <h4 className="text-2xl font-medium">
          A lightweight analytics solution for all your websites.
        </h4>
      </div>
    </main>
  );
}
