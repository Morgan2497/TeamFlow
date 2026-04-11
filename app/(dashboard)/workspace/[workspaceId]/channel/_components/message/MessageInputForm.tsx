"use client";

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {createMessageSchema} from "@/app/schemas/message";
import { MessageComposer } from "./MessageComposer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { toast } from "sonner";
import { CreateMessageSchemaType } from "@/app/schemas/message";
interface iAppProps {
    channelId: string
}
export function MessageInputForm({channelId}: iAppProps) {
    const queryClient = useQueryClient();

    const form = useForm({
        resolver: zodResolver(createMessageSchema),
        defaultValues: {
            channelId: channelId,
            content: "",
        }
    })
    const createMessageMutation = useMutation(
        orpc.message.create.mutationOptions({
            onSuccess: () => {
                void queryClient.invalidateQueries({
                    queryKey: orpc.message.list.queryKey({ input: { channelId } }),
                });
                return toast.success('Message created successfully!')
            },
            onError: () => {
                return toast.error('Failed to create message, try again!');
            }
        })
    )
    function onSubmit(data: CreateMessageSchemaType) {
        createMessageMutation.mutate(data);

    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} >
                <FormField 
                    control={form.control}
                    name="content"
                    render={({field}) => (
                        <FormItem>
                            <FormControl>
                                <MessageComposer
                                    value={field.value}
                                    onChange={field.onChange}
                                    onSubmit={() => void form.handleSubmit(onSubmit)()}
                                    isSubmitting={createMessageMutation.isPending}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    )
}

