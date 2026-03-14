"use client"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CreditCard, LogOut, User } from "lucide-react";
import { LogoutLink, PortalLink } from "@kinde-oss/kinde-auth-nextjs/components";

const user = {
  picture: "/prof.jpg",
  given_name: "Morgan Kim",
  user_email: "morgan.kim@example.com",
}

export function UserNav() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="size-12 rounded-xl
                hover:rounded-lg transition-all duration-200 bg-background/50
                border-border/50 hover:bg-accent
                hover:text-accent-foreground">
          <Avatar className="relative-size-8 rounded-lg">
            <AvatarImage src={user.picture}
              alt="User Image"
              className="object-cover" />
            <AvatarFallback>
              {user.given_name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="right"
        sideOffset={8}
        className="w-[200px]"
      >
        <DropdownMenuLabel className="font-normal flex items-center gap-2 px-1
                py-1.5 text-left text-sm">
          <Avatar>
            <AvatarImage src={user.picture}
              alt="User Image"
              className="object-cover" />
            <AvatarFallback>
              {user.given_name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <p className="truncate font-medium">{user.given_name}</p>
            <p className="truncate text-xs text-muted-foreground">{user.user_email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <PortalLink>
              <User />
              Account
            </PortalLink>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <PortalLink>
              <CreditCard />
              Billing
            </PortalLink>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <LogoutLink className="flex items-center gap-2 cursor-pointer">
            <LogOut className="h-4 w-4" />
            Log out
          </LogoutLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
