import { convertJsonToHtml } from "@/lib/query/json-to-html";
import { JSONContent } from "@tiptap/react";
import DOMPurify from "dompurify";
import parse from "html-react-parser";

interface iAppProps {
    content: JSONContent;
    className?: string;
}

export function SafeContent({content}: iAppProps) {
    const html = convertJsonToHtml(content);
    
    const clean = DOMPurify.sanitize(html);
    return <div>{parse(clean)}</div>
}