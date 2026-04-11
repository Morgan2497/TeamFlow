import { RichTextEditor } from "@/components/rich-text-editor/Editor";
import { Button } from "@/components/ui/button";
import { ImageIcon, Send } from "lucide-react";
import { ReactNode } from "react";

interface MessageComposerProps {
    value: string;
    onChange: (next: string) => void;
    footerLeft?: ReactNode;
    onSubmit: () => void;
    isSubmitting?: boolean;
}

export function MessageComposer({ value, onChange, footerLeft, onSubmit, isSubmitting }: MessageComposerProps) {
    return (
        <>
        <RichTextEditor 
            field={{value, onChange}}
            sendButton={
            <Button disabled={isSubmitting} 
                type="button" 
                size="sm" onClick={onSubmit}>
                <Send className="size-4 mr-1" />
                Send
            </Button>}
            footerLeft={
                <Button type="button" size="sm" variant="outline">
                    <ImageIcon className="size-4 mr-1" />
                    Attatch
                </Button>
            }
        />
        </>
    )
}

