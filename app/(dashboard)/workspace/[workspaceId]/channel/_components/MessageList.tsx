"use client";

import { skipToken, useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { MessageItem } from "./message/MessageItem";
import { orpc } from "@/lib/orpc";

export function MessageList() {
  const { channelId } = useParams<{ channelId: string }>();

  const { data } = useQuery(
    orpc.message.list.queryOptions({
      input: channelId ? { channelId } : skipToken,
    }),
  );

  return (
    <div className="relative h-full">
      <div className="h-full overflow-y-auto px-4">
        {data?.map((msg) => (
          <MessageItem
            key={msg.id}
            id={msg.id}
            message={msg.content}
            date={msg.createdAt}
            avatar={msg.authorAvatar}
            userName={msg.authorName}
          />
        ))}
      </div>
    </div>
  );
}
