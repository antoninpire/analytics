"use client";

import { CommandItem } from "@/components/ui/command";
import { Website } from "@/lib/db/schema";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";

type HeaderCommandItemProps = {
  website: Website;
  currentWebsite?: Website;
};

export default function HeaderCommandItem(props: HeaderCommandItemProps) {
  const { website, currentWebsite } = props;

  const router = useRouter();

  return (
    <CommandItem
      className="hover:cursor-pointer"
      onSelect={() => {
        if (website.id === currentWebsite?.id) return;
        router.push(`/dashboard/${website.id}`);
      }}
    >
      <Check
        className={cn(
          "mr-2 h-4 w-4",
          currentWebsite?.name === website.name ? "opacity-100" : "opacity-0"
        )}
      />
      {website.name}
    </CommandItem>
  );
}
