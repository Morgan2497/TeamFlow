import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar";
  
  const members: { id: string; name: string; imageUrl?: string }[] = [
    {
      id: "1",
      name: "Morgan Kim",
      imageUrl: "https://avatar.vercel.sh/morgan",
    },
    {
      id: "2",
      name: "Sumiran Mishara",
      imageUrl: "https://avatar.vercel.sh/sumiran",
    },
    {
      id: "3",
      name: "Joshua Park",
      imageUrl: "https://avatar.vercel.sh/joshua",
    },
  ];
  
  export function WorkspaceMembersList() {
    return (
      <div className="space-y-0.5 py-1">
        {members.map((member) => (
          <div key={member.id}>
            <div className="relative">
              <Avatar>
                {member.imageUrl ? (
                  <AvatarImage
                    src={member.imageUrl}
                    alt={member.name}
                    className="object-cover"
                  />
                ) : null}
                <AvatarFallback>
                  {member.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        ))}
      </div>
    );
  }