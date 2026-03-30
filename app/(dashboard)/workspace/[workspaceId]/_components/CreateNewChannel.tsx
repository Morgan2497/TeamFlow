"use client";
import {
  channelNameSchema,
  transformChannelName,
} from "@/app/schemas/channel";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export function CreateNewChannel() {
  const [open, setOpen] = useState(false);
  const form = useForm<z.input<typeof channelNameSchema>>({
    resolver: zodResolver(channelNameSchema),
    defaultValues: {
      name: "",
    },
  });

  const watchedName = form.watch("name");
  const transformedName = watchedName ? transformChannelName(watchedName) : "";

  function onSubmit(_values: z.output<typeof channelNameSchema>) {
    // Wire create-channel API here; _values.name is already transformed by Zod
    form.reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Plus className="size-4" />
          Add Channel
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Channel</DialogTitle>
          <DialogDescription>
            Create a new channel to organize your workspace.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            className="space-y-6"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My channel" {...field} />
                  </FormControl>
                  {transformedName &&
                    transformedName !== watchedName && (
                      <p className="text-sm text-muted-foreground">
                        Will be created as:{" "}
                        <code className="rounded bg-muted px-1 py-0.5 text-xs">
                          {transformedName}
                        </code>
                      </p>
                    )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Create channel</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
