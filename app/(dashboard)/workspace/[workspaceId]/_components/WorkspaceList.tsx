import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ToggleLeft } from "lucide-react"

const workspaces = [
    {
        id: '1',
        name: 'TeamFlow 1',
        avatar: "TF 1",
    },
    {
        id: '2',
        name: 'TeamFlow 2',
        avatar: "TF 2",
    },
    {
        id: '3',
        name: 'TeamFlow 3',
        avatar: "TF 3",
    }
]

export function WorkspaceList() {
    return (
        <TooltipProvider>
            <div className="flex flex-col gap-2">
                {workspaces.map((ws) => (
                    <Tooltip key={ws.id}>
                        <TooltipTrigger asChild>
                            <Button>
                                <span className="text-sm font-semibold">{ws.avatar}</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{ws.name}</p>
                        </TooltipContent>
                    </Tooltip>
                ))}
            </div>
        </TooltipProvider>
    )
}

/*
    In React, when you have a list of data like the workspace array, you use the .map() method to
    transform each object in that array into a UI element. Think of .map() as an assemly line: 
    it takes a "plan" (the object) and produces a "product" (the Tooltip component) for every item it finds.

    1. Why do we need key={ws.id}?
    React uses the 'key' prop to keep track of which item is which in a list. It helps React to update only the specific item that changed, 
    rather than re-rendering the whole list.

    2. What is asChild?
    This is a special prop that tells React to use the child element as the trigger.
    n standard React, if you want a Button to act as a link, you might wrap it: <Link><Button>Click</Button></Link>. This creates two nested tags in your HTML, which can break your CSS layout and confuse screen readers.
    With asChild, you tell the parent component: "Don't render your own tag. Just take your logic and styles and 'squash' them onto my child element".

    => Use Cases
    - When you want a button to look like a link (like in a navigation menu).
    - When you want to use a button's hover/focus/disabled states without creating extra nesting.
    - When you want to pass the button's props (like onClick) to a child element.
*/