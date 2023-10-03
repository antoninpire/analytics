import HeaderCommandItem from "@/app/dashboard/_components/header-command-item";
import { ThemeToggle } from "@/app/dashboard/_components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { db } from "@/lib/db";
import { Website } from "@/lib/db/schema";
import { getPageSession } from "@/lib/get-page-session";
import { ArrowLeft, ChevronsUpDown } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

type HeaderProps = {
  website?: string;
  websites?: Website[];
};

export default async function Header(props: HeaderProps) {
  const session = await getPageSession();
  if (!session) redirect("/login");

  const websites =
    props.websites ??
    (await db.query.websitesTable.findMany({
      where: (table, { eq }) => eq(table.user_id, session.user.userId),
    }));

  const { website: currentWebsiteId } = props;

  const currentWebsite = websites.find((w) => w.id === currentWebsiteId);

  if (!currentWebsite && !!currentWebsiteId) redirect("/dashboard");

  return (
    <header className="w-full justify-between items-center flex border-b border-gray-300 dark:border-gray-700 pb-4">
      <div className="flex items-center gap-0.5">
        {currentWebsiteId !== undefined && (
          <TooltipProvider>
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <Link href="/dashboard">
                  <Button variant="ghost">
                    <ArrowLeft size={18} />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Go back</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-[200px] justify-between"
            >
              {currentWebsite?.name ?? "Select website..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search websites..." />
              <CommandEmpty>No website found.</CommandEmpty>
              <CommandGroup>
                {websites.map((website) => (
                  <HeaderCommandItem
                    website={website}
                    currentWebsite={currentWebsite}
                    key={website.id}
                  />
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex gap-2.5 items-center">
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button>
              <Avatar>
                <AvatarImage
                  src={`https://api.dicebear.com/6.x/micah/svg?seed=${encodeURI(
                    session.user.email
                  )}`}
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal text-gray-500 dark:text-gray-400">
              {session.user.email}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href="/dashboard">
              <DropdownMenuItem>Dashboard</DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <form action="/api/logout" method="post">
              <button type="submit" className="w-full">
                <DropdownMenuItem>Sign Out</DropdownMenuItem>
              </button>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
