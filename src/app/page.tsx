import { ThemeToggle } from "@/app/dashboard/_components/theme-toggle";
import { Button } from "@/components/ui/button";
import { getPageSession } from "@/lib/get-page-session";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getPageSession();
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
        <div className="flex justify-center">
          <a
            target="_blank"
            rel="noreferrer"
            href="https://github.com/antoninpire/analytics"
          >
            <button className="px-3 py-1.5 text-sm rounded-full border border-primary inline-flex items-center">
              See on github
              <ArrowRight size={18} className="ml-1" />
            </button>
          </a>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="dark:hidden pointer-events-none absolute inset-x-0 -z-10 transform-gpu overflow-hidden blur-3xl top-[3vh]"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
        />
      </div>
      <div
        aria-hidden="true"
        className="dark:hidden pointer-events-none absolute right-0 -z-10 transform-gpu overflow-hidden blur-3xl top-[3vh] max-w-[40vw]"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#a5c7f5] to-[#8789fc] opacity-30 sm:w-[72.1875rem]"
        />
      </div>
    </main>
  );
}
