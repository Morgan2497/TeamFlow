"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import { MessageItem } from "./message/MessageItem";
import { MESSAGE_LIST_PAGE_SIZE } from "@/lib/constants/messages";
import { orpc } from "@/lib/orpc";

export function MessageList() {
  const params = useParams<{ channelId: string }>();
  const channelId = params.channelId;
  const scrollRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const didSnapToBottom = useRef(false);

  const query = useInfiniteQuery({
    ...orpc.message.list.infiniteOptions({
      input: (pageParam: string | undefined) => ({
        channelId: channelId!,
        cursor: pageParam,
        limit: MESSAGE_LIST_PAGE_SIZE,
      }),
      initialPageParam: undefined as string | undefined,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }),
    enabled: !!channelId,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  const items = useMemo(() => {
    const pages = query.data?.pages ?? [];
    const merged = pages.flatMap((p) => p.items);
    return [...merged].reverse();
  }, [query.data]);

  useEffect(() => {
    didSnapToBottom.current = false;
  }, [channelId]);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root || !query.isSuccess || items.length === 0 || didSnapToBottom.current) {
      return;
    }
    root.scrollTop = root.scrollHeight;
    didSnapToBottom.current = true;
  }, [channelId, query.isSuccess, items.length]);

  useEffect(() => {
    if (!channelId) return;
    const root = scrollRef.current;
    const target = loadMoreRef.current;
    if (!root || !target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries[0];
        if (
          hit?.isIntersecting &&
          query.hasNextPage &&
          !query.isFetchingNextPage &&
          !query.isFetching
        ) {
          void query.fetchNextPage();
        }
      },
      { root, rootMargin: "120px" },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [channelId, query.hasNextPage, query.isFetchingNextPage, query.isFetching, query.fetchNextPage]);

  if (!channelId) {
    return null;
  }

  return (
    <div className="relative h-full">
      <div
        ref={scrollRef}
        className="flex h-full flex-col overflow-y-auto px-4"
      >
        <div
          ref={loadMoreRef}
          className="flex shrink-0 justify-center py-2 text-xs text-muted-foreground"
        >
          {query.isFetchingNextPage
            ? "Loading older messages…"
            : query.hasNextPage
              ? "Scroll up for older messages"
              : items.length > 0
                ? "Beginning of channel"
                : null}
        </div>

        {query.isError && (
          <p className="py-2 text-sm text-destructive">
            Could not load messages. Pull to retry or refresh the page.
          </p>
        )}

        {items.map((msg) => (
          <MessageItem
            key={msg.id}
            id={msg.id}
            message={msg.content}
            date={msg.createdAt}
            avatar={msg.authorAvatar}
            userName={msg.authorName}
          />
        ))}

        {query.isFetching && !query.isFetchingNextPage && items.length === 0 && (
          <p className="py-4 text-sm text-muted-foreground">Loading messages…</p>
        )}
      </div>
    </div>
  );
}
