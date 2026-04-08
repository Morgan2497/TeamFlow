import { Editor, useEditorState } from "@tiptap/react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Toggle } from "../ui/toggle";
import { Button } from "../ui/button";
import { Bold, Code, Italic, List, ListOrdered, Redo2, Strikethrough, Undo2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuBarProps {
    editor: Editor | null,
}

export function MenuBar({ editor }: MenuBarProps) {
    const t = useEditorState({
        editor,
        selector: ({ editor: e }) => ({
            bold: e?.isActive("bold") ?? false,
            italic: e?.isActive("italic") ?? false,
            strike: e?.isActive("strike") ?? false,
            codeBlock: e?.isActive("codeBlock") ?? false,
            bulletList: e?.isActive("bulletList") ?? false,
            orderedList: e?.isActive("orderedList") ?? false,
            canUndo: e?.can().undo() ?? false,
            canRedo: e?.can().redo() ?? false,
        }),
    }) ?? {
        bold: false,
        italic: false,
        strike: false,
        codeBlock: false,
        bulletList: false,
        orderedList: false,
        canUndo: false,
        canRedo: false,
    };

    if (!editor) {
        return null;
    }

    return (
        <div className="border border-input border-x-0
        rounded-t-lg p-2 bg-card flex flex-wrap
        gap-1 items-center">
            <TooltipProvider>
                <div className="flex flex-wrap gap-1">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                disabled={!t.canUndo}
                                className="text-muted-foreground"
                                onClick={() =>
                                    editor.chain().focus().undo().run()
                                }
                            >
                                <Undo2 />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Undo</p></TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                disabled={!t.canRedo}
                                className="text-muted-foreground"
                                onClick={() =>
                                    editor.chain().focus().redo().run()
                                }
                            >
                                <Redo2 />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Redo</p></TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={t.bold}
                                onPressedChange={() =>
                                    editor.chain().focus().toggleBold().run()
                                }
                                className={cn(
                                    t.bold && "bg-muted text-muted-foreground"
                                )}
                            >
                                <Bold />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent><p>Bold</p></TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={t.italic}
                                onPressedChange={() =>
                                    editor.chain().focus().toggleItalic().run()
                                }
                                className={cn(
                                    t.italic && "bg-muted text-muted-foreground"
                                )}
                            >
                                <Italic />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent><p>Italic</p></TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={t.strike}
                                onPressedChange={() =>
                                    editor.chain().focus().toggleStrike().run()
                                }
                                className={cn(
                                    t.strike && "bg-muted text-muted-foreground"
                                )}
                            >
                                <Strikethrough />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent><p>Strike</p></TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={t.codeBlock}
                                onPressedChange={() =>
                                    editor.chain().focus().toggleCodeBlock().run()
                                }
                                className={cn(
                                    t.codeBlock && "bg-muted text-muted-foreground"
                                )}
                            >
                                <Code />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent><p>Code Block</p></TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={t.bulletList}
                                onPressedChange={() =>
                                    editor.chain().focus().toggleBulletList().run()
                                }
                                className={cn(
                                    t.bulletList && "bg-muted text-muted-foreground"
                                )}
                            >
                                <List />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent><p>Bullet list</p></TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={t.orderedList}
                                onPressedChange={() =>
                                    editor.chain().focus().toggleOrderedList().run()
                                }
                                className={cn(
                                    t.orderedList && "bg-muted text-muted-foreground"
                                )}
                            >
                                <ListOrdered />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent><p>Numbered list</p></TooltipContent>
                    </Tooltip>
                </div>
            </TooltipProvider>
        </div>
    )
}
