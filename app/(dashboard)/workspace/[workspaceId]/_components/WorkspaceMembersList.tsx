import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatar } from "@/lib/get-avatar";
import { orpc } from "@/lib/orpc";
import { useSuspenseQuery } from "@tanstack/react-query";

export function WorkspaceMembersList() {
  const {data: {members}} = useSuspenseQuery(orpc.channel.list.queryOptions());
  return (
    <div className="space-y-0.5 py-1">
      {members.map((member) => (
        <div
          key={member.id}
          className="flex cursor-pointer items-center gap-3 px-3 py-2 transition-colors hover:bg-accent"
        >
          <div className="relative shrink-0">
            <Avatar className="relative size-8">
              <AvatarImage
                src={getAvatar(member.picture ?? null, member.email)}
                alt={member.name}
              />
              <AvatarFallback>
                {member.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{member.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {member.email}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}