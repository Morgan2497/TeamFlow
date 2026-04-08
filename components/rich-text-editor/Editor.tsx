'use client';
import { EditorContent, useEditor } from "@tiptap/react";
import { editorExtensions } from "./extension";
import { MenuBar } from "./MenuBar";

export function RichTextEditor() {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: editorExtensions,
        editorProps: {
            attributes: {
                class: "tiptap max-w-none min-h-[125px] focus:outline-none p-4 !w-full !max-w-none",
            }
        }
        
    });

    return (
        <div className="relative w-full border border-input rounded-lg overflow-hidden
        dark:bg-input/30 flex flex-col">

            <MenuBar editor={editor} />
            <EditorContent editor={editor}
            className="max-h-[200px] overflow-y-auto"
            />
        </div>
    )

}