import React, { useState } from 'react';

interface ContentEditorProps {
    initialContent?: string;
    onChange: (content: string) => void;
}

const ContentEditor: React.FC<ContentEditorProps> = ({ initialContent = '', onChange }) => {
    const [content, setContent] = useState(initialContent);

    const handleContentChange = (newContent: string) => {
        setContent(newContent);
        onChange(newContent);
    };

    const insertTag = (tag: string, closeTag: string = '') => {
        const textarea = document.getElementById('content-editor') as HTMLTextAreaElement;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const before = text.substring(0, start);
        const selection = text.substring(start, end);
        const after = text.substring(end);

        const newText = `${before}${tag}${selection}${closeTag}${after}`;
        handleContentChange(newText);

        // Restore focus and selection
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + tag.length, end + tag.length);
        }, 0);
    };

    return (
        <div className="border border-gray-300 rounded-lg overflow-hidden">
            <div className="bg-gray-100 p-2 border-b border-gray-300 flex flex-wrap gap-2">
                <button type="button" onClick={() => insertTag('# ')} className="px-2 py-1 bg-white border rounded hover:bg-gray-50 text-sm font-bold">H1</button>
                <button type="button" onClick={() => insertTag('## ')} className="px-2 py-1 bg-white border rounded hover:bg-gray-50 text-sm font-bold">H2</button>
                <button type="button" onClick={() => insertTag('### ')} className="px-2 py-1 bg-white border rounded hover:bg-gray-50 text-sm font-bold">H3</button>
                <div className="w-px bg-gray-300 mx-1"></div>
                <button type="button" onClick={() => insertTag('**', '**')} className="px-2 py-1 bg-white border rounded hover:bg-gray-50 text-sm font-bold">B</button>
                <button type="button" onClick={() => insertTag('*', '*')} className="px-2 py-1 bg-white border rounded hover:bg-gray-50 text-sm italic">I</button>
                <div className="w-px bg-gray-300 mx-1"></div>
                <button type="button" onClick={() => insertTag('- ')} className="px-2 py-1 bg-white border rounded hover:bg-gray-50 text-sm">List</button>
                <button type="button" onClick={() => insertTag('> ')} className="px-2 py-1 bg-white border rounded hover:bg-gray-50 text-sm">Quote</button>
                <div className="w-px bg-gray-300 mx-1"></div>
                <button type="button" onClick={() => insertTag('![Alt text](', ')')} className="px-2 py-1 bg-white border rounded hover:bg-gray-50 text-sm">Image</button>
                <button type="button" onClick={() => insertTag('[Link text](', ')')} className="px-2 py-1 bg-white border rounded hover:bg-gray-50 text-sm">Link</button>
            </div>
            <textarea
                id="content-editor"
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
                className="w-full h-96 p-4 focus:outline-none resize-y font-mono text-sm"
                placeholder="Write your content here using Markdown..."
            />
            <div className="bg-gray-50 p-2 text-xs text-gray-500 border-t border-gray-300">
                Supports Markdown formatting. Use the toolbar or type directly.
            </div>
        </div>
    );
};

export default ContentEditor;
