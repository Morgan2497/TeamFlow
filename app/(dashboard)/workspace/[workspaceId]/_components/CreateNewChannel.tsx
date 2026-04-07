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
import { orpc } from "@/lib/orpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export function CreateNewChannel() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<z.input<typeof channelNameSchema>>({
    resolver: zodResolver(channelNameSchema),
    defaultValues: {
      name: "",
    },
  });

  const createChannelMutation = useMutation(
    orpc.channel.create.mutationOptions({
      onSuccess: (channel) => {
        toast.success(`Channel ${channel.name} created successfully`);
        queryClient.invalidateQueries({
          queryKey: orpc.workspace.list.queryKey(),
        });
        form.reset();
        setOpen(false);
      },
      onError: () => {
        toast.error("Failed to create channel, try again!");
      },
    })
  );

  function onSubmit(values: z.output<typeof channelNameSchema>) {
    createChannelMutation.mutate(values);
  }

  const watchedName = form.watch("name");
  const transformedName = watchedName ? transformChannelName(watchedName) : "";

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
                  <FormControl className="mt-2">
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

            <Button
              disabled={createChannelMutation.isPending}
              type="submit"
            >
              {createChannelMutation.isPending
                ? "Creating..."
                : "Create new channel"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
