import React, { ReactNode } from 'react'
import { WorkspaceList } from './_components/WorkspaceList';
import { CreateWorkspace } from './_components/CreateWorkspace';
import { UserNav } from './_components/UserNav';
import { getQueryClient, HydrateClient } from '@/lib/query/hydration';
// Ensure server router client exists before @/lib/orpc evaluates (avoids ReferenceError / wrong client on RSC).
import '@/lib/orpc.server';

const WorkspaceLayout = async ({ children }: { children: ReactNode }) => {
  const queryClient = getQueryClient();
  const { orpc } = await import('@/lib/orpc');
  await queryClient.prefetchQuery(orpc.workspace.list.queryOptions());
  return (
    <div className="flex w-full h-screen">
      <div className="flex h-full w-16 flex-col items-center bg-secondary py-3 px-2 border-r border-border">
        <HydrateClient client={queryClient}>
          <WorkspaceList />
          <div className="mt-4">
            <CreateWorkspace />
          </div>
          <div className="mt-auto">
            <HydrateClient client={queryClient}>
              <UserNav />

            </HydrateClient>
          </div>
        </HydrateClient>
      </div>
      {children}
    </div>
  )
}

export default WorkspaceLayout;
