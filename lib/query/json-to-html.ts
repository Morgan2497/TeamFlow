import { baseExtensions, editorExtensions } from "@/components/rich-text-editor/extension";
import { generateHTML, JSONContent } from "@tiptap/react";

export function convertJsonToHtml(jsonContent: JSONContent) {
    try {
        const content = typeof jsonContent==='string' ? JSON.parse(jsonContent) : jsonContent;
        return generateHTML(content, baseExtensions);
    }
    catch {
        console.log('Error converting JSON to HTML');
        return '';
    }
}