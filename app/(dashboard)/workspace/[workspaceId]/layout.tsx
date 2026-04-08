"use client";
import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { WorkspaceHeader } from "./_components/workspaceHeader";
import { CreateNewChannel } from "./_components/CreateNewChannel";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ChannelList } from "./_components/ChannelList";
import { WorkspaceMembersList } from "./_components/WorkspaceMembersList";
import { HydrateClient } from "@/lib/query/hydration";

export default function ChannelListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();

  return (
    <div className="flex h-screen">
      <div className="flex h-full w-80 flex-col bg-secondary border-r border-border">
        {/* Header */}
        <div className="flex h-14 items-center border-b border-border px-4">
          <WorkspaceHeader />
        </div>

        <div className="px-4 py-2">
          <CreateNewChannel />
        </div>

        {/* Channel List */}
        <div className="flex-1 overflow-y-auto px-4">
          <Collapsible defaultOpen>
            <CollapsibleTrigger
              className="flex w-full items-center
                    justify-between px-2 py-1 text-sm font-medium text-muted-foreground hover:text-accent-foreground 
                    [&[data-state=open]>svg:rotate-180]"
            >
              Main
              <ChevronUp className="size-4 transition-transform duration-200" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <HydrateClient client={queryClient}>
                <ChannelList />
              </HydrateClient>
            </CollapsibleContent>
          </Collapsible>
        </div>
        {children}
    </>
)

        {/* Members List */}
        <div className="border-5 border-border px-4 py-2">
          <Collapsible defaultOpen>
            <CollapsibleTrigger
              className="flex w-full items-center
                justify-between px-2 py-1 text-sm font-medium text-muted-foreground hover:text-accent-foreground"
            >
              Members
              <ChevronDown className="size-4 transition-transform duration-200" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <HydrateClient client={queryClient}>
                <WorkspaceMembersList />
              </HydrateClient>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
      <main className="flex-1">{children}</main>
    </div>
  );
}
