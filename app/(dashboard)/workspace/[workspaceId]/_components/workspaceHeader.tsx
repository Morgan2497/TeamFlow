"use client";

import { orpc } from "@/lib/orpc";
import { useSuspenseQuery } from "@tanstack/react-query";

export function WorkspaceHeader() {
    const {data: {currentWorkspace}} = useSuspenseQuery({
        ...orpc.workspace.list.queryOptions(),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
    return (
        <h2 className='text-lg font-semibold'>{currentWorkspace.orgName}</h2>

    )
}