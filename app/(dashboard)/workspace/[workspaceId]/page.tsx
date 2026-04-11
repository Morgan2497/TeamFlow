import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { client } from "@/lib/orpc";
import { ArrowUpRightIcon, Cloud } from "lucide-react";
import { redirect } from "next/navigation";
import { CreateNewChannel } from "./_components/CreateNewChannel";
interface iAppProps {
    params: Promise<{workspaceId: string}>
}

const WorkspaceidPage = async ({params}: iAppProps) => {
    const {workspaceId} = await params;
    const { channels } = await client.channel.list();
    if (channels.length > 0) {
        return redirect(`/workspace/${workspaceId}/channel/${channels[0].id}`);
    }
    return (
        <div className="flex h-full w-full items-center justify-center">
        <Empty className="border border-dashed from-muted/50 to-background h-full
        bg-gradient-to-b from-30%">
            <EmptyHeader>
                <EmptyMedia variant="icon">
                <Cloud />
                </EmptyMedia>
                <EmptyTitle>No channels yet</EmptyTitle>
                <EmptyDescription>
                Create your first channel to get started!
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent className="flex-row justify-center gap-2">
                <CreateNewChannel />
            </EmptyContent>
        </Empty>
        </div>
        
    )
}

export default WorkspaceidPage;