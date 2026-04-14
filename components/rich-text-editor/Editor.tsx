'use client';
import { EditorContent, useEditor } from "@tiptap/react";
import { editorExtensions } from "./extension";
import { MenuBar } from "./MenuBar";
import { ReactNode } from "react";


interface iAppProps {
    field: any;
    sendButton: ReactNode;
    footerLeft?: ReactNode;
}
export function RichTextEditor({field, sendButton, footerLeft}: iAppProps) {
    const editor = useEditor({
        immediatelyRender: false,
        content: (() => {
            if(!field?.value) {
                return "";
            }

            try {
                return JSON.parse(field.value);
            }

            catch {
                return "";
            }
        })(),
        onUpdate: ({editor}) => {
            if(field?.onChange) {
                field.onChange(JSON.stringify(editor.getJSON()));
            }
        },
        extensions: editorExtensions,
        editorProps: {
            attributes: {
                class: "tiptap max-w-none min-h-[125px] focus:outline-none p-4 !w-full !max-w-none",
            }
        }
        
    });

    return (
        <div className="relative flex w-full flex-col overflow-hidden rounded-lg border border-input dark:bg-input/30">
            <MenuBar editor={editor} />
            <EditorContent
                editor={editor}
                className="max-h-[200px] overflow-y-auto"
            />
            <div className="flex items-center justify-between gap-2 border-t border-input bg-card px-3 py-2">
                <div className="flex min-h-8 items-center">{footerLeft}</div>
                <div className="shrink-0">{sendButton}</div>
            </div>
        </div>
    );

}