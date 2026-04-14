"use client";
import Link from "next/link";
import { Hash } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { useParams } from "next/navigation";



export function ChannelList() {
    const { data: { channels } } = useSuspenseQuery(orpc.channel.list.queryOptions());
    const { workspaceId, channelId } = useParams<{ workspaceId: string; channelId: string }>();
    return (
        <div className="space-y-0.5 py-1">
            {channels.map((channel) => {
                const isActive = channel.id === channelId;
                return (
                    <Link
                        className={buttonVariants({
                            variant: "ghost",
                            className: cn(
                                "h-7 w-full justify-start px-2 py-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                                isActive ? "rounded-lg" : "rounded-xl hover:rounded-lg"
                            ),
                        })}
                        key={channel.id}
                        href={`/workspace/${workspaceId}/channel/${channel.id}`}
                    >
                        <Hash className="size-4" />
                        <span className="truncate">{channel.name}</span>
                    </Link>
                );
            })}
        </div>
    );
}