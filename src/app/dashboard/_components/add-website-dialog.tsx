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
import { addWebsiteSchema } from "@/lib/validation/website-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type AddWebsiteDialogProps = {};

export default function AddWebsiteDialog(props: AddWebsiteDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof addWebsiteSchema>>({
    resolver: zodResolver(addWebsiteSchema),
    defaultValues: {
      name: "",
      url: "",
    },
  });
  const { toast } = useToast();
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof addWebsiteSchema>) {
    setIsLoading(true);
    const result = await fetch("/api/website", {
      method: "POST",
      body: JSON.stringify(values),
    }).catch((err) => {
      if (err.message) {
        toast({
          title: "Uh oh! Something went wrong.",
          description: err.message,
          variant: "destructive",
        });
      }
    });
    if (result && !result.ok) {
      const data = await result.json();
      if (data?.error)
        toast({
          title: "Uh oh! Something went wrong.",
          description: data.error,
          variant: "destructive",
        });
    }
    setIsLoading(false);
    if (result && result.ok) {
      const data = await result.json();
      if (data?.websiteId) {
        router.push("/dashboard/" + data.websiteId);
      }
    } else {
      router.refresh();
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-1 flex items-center">
          <Plus size={18} />
          Add website
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a website</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            id="add-website-form"
            className="flex flex-col gap-2"
          >
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
          </form>
        </Form>
        <div className="h-2" />
        <DialogFooter>
          <Button disabled={isLoading} form="add-website-form" type="submit">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create website
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
