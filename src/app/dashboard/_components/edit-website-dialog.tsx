"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import type { Website } from "@/lib/db/schema";
import { editWebsiteSchema } from "@/lib/validation/website-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type EditWebsiteDialogProps = {
  website: Website;
};

export default function EditWebsiteDialog(props: EditWebsiteDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof editWebsiteSchema>>({
    resolver: zodResolver(editWebsiteSchema),
    defaultValues: {
      name: props.website.name,
      url: props.website.url,
      id: props.website.id,
    },
  });
  const { toast } = useToast();
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof editWebsiteSchema>) {
    setIsLoading(true);
    const result = await fetch("/api/website", {
      method: "PATCH",
      body: JSON.stringify(values),
    }).catch((err) => {
      if (err.message)
        toast({
          title: "Uh oh! Something went wrong.",
          description: err.message,
          variant: "destructive",
        });
      return;
    });
    if (result && !result.ok) {
      const data = await result.json();
      if (data?.error)
        toast({
          title: "Uh oh! Something went wrong.",
          description: data.error,
          variant: "destructive",
        });
      return;
    }
    setIsLoading(false);
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="ghost">
          <Edit size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit website</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="flex flex-col gap-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name of your website</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="My Portfolio"
                      autoCapitalize="none"
                      autoCorrect="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Url of your website</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com"
                      autoCapitalize="none"
                      autoCorrect="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="hidden" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <div className="h-2" />
        <DialogFooter>
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              setIsLoading(true);
              const result = await fetch("/api/website", {
                method: "DELETE",
                body: JSON.stringify({ id: props.website.id }),
              }).catch((err) => {
                if (err.message)
                  toast({
                    title: "Uh oh! Something went wrong.",
                    description: err.message,
                    variant: "destructive",
                  });
                return;
              });
              if (result && !result.ok) {
                const data = await result.json();
                if (data?.error)
                  toast({
                    title: "Uh oh! Something went wrong.",
                    description: data.error,
                    variant: "destructive",
                  });

                return;
              }
              setIsLoading(false);
              setOpen(false);
              router.refresh();
            }}
            action="/api/website"
            method="DELETE"
          >
            <Button disabled={isLoading} variant="destructive" type="submit">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </form>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
