"use client";

import { useRef, useEffect, useState } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, Link as LinkIcon, RotateCcw, RotateCw, ExternalLink } from 'lucide-react';
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ArticleRichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    rows?: number;
}

export default function ArticleRichTextEditor({
    value,
    onChange,
    placeholder = "Write your content here...",
    className,
    rows = 6
}: ArticleRichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const [savedSelection, setSavedSelection] = useState<Range | null>(null);

    // Sync external value with internal HTML only when externally changed
    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            editorRef.current.innerHTML = value || '';
        }
    }, [value]);

    const execCommand = (command: string, arg?: string) => {
        document.execCommand(command, false, arg);
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const saveSelection = () => {
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
            setSavedSelection(sel.getRangeAt(0));
        }
    };

    const restoreSelection = () => {
        if (savedSelection) {
            const sel = window.getSelection();
            if (sel) {
                sel.removeAllRanges();
                sel.addRange(savedSelection);
            }
        }
    };

    const openLinkDialog = () => {
        saveSelection();
        setIsLinkDialogOpen(true);
    };

    const applyLink = () => {
        restoreSelection();
        if (linkUrl) {
            // Standard execCommand for links
            execCommand('createLink', linkUrl);

            // Post-process to ensure links open in new tab and have proper styling
            if (editorRef.current) {
                const links = editorRef.current.querySelectorAll('a');
                links.forEach(link => {
                    if (link.getAttribute('href') === linkUrl) {
                        link.setAttribute('target', '_blank');
                        // Ensure it has the blue underlined style even in the editor
                        link.classList.add('text-blue-600', 'underline');
                    }
                });
                onChange(editorRef.current.innerHTML);
            }
        }
        setIsLinkDialogOpen(false);
        setLinkUrl('');
    };

    const handleHeading = (type: string) => {
        execCommand('formatBlock', `<${type}>`);
    };

    const handleFocus = () => {
        document.execCommand('defaultParagraphSeparator', false, 'p');
        if (!editorRef.current?.innerHTML || editorRef.current.innerHTML === '<br>') {
            execCommand('formatBlock', '<p>');
        }
    };

    // Style the min/max height based on rows
    const heightStyle = {
        minHeight: rows ? `${rows * 28}px` : '150px',
        maxHeight: rows ? `${rows * 100}px` : 'auto'
    };

    return (
        <div className={cn("overflow-hidden border border-[#d1d5db] rounded-[6px] bg-white relative", className)}>
            {/* Toolbar */}
            <div className="border-b border-[#d1d5db] px-3 py-2 flex items-center gap-1 flex-wrap bg-[#f9fafb]">
                <select
                    className="px-2 py-1 text-[13px] border border-[#d1d5db] rounded bg-white focus:outline-none cursor-pointer"
                    onChange={(e) => {
                        if (e.target.value === 'p') execCommand('formatBlock', '<p>');
                        else if (e.target.value === 'h1') handleHeading('h1');
                        else if (e.target.value === 'h2') handleHeading('h2');
                        e.target.value = 'p';
                    }}
                    value="p"
                >
                    <option value="p">Paragraph</option>
                    <option value="h1">Heading 1</option>
                    <option value="h2">Heading 2</option>
                </select>
                <div className="w-px h-6 bg-[#d1d5db] mx-1" />
                <button
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); execCommand('bold'); }}
                    className="p-1.5 hover:bg-gray-200 rounded transition-colors group"
                    title="Bold"
                >
                    <Bold className="w-4 h-4 text-[#374151] group-hover:text-[#111827]" />
                </button>
                <button
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); execCommand('italic'); }}
                    className="p-1.5 hover:bg-gray-200 rounded transition-colors group"
                    title="Italic"
                >
                    <Italic className="w-4 h-4 text-[#374151] group-hover:text-[#111827]" />
                </button>
                <button
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); execCommand('underline'); }}
                    className="p-1.5 hover:bg-gray-200 rounded transition-colors group"
                    title="Underline"
                >
                    <Underline className="w-4 h-4 text-[#374151] group-hover:text-[#111827]" />
                </button>
                <div className="w-px h-6 bg-[#d1d5db] mx-1" />
                <button
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); execCommand('insertUnorderedList'); }}
                    className="p-1.5 hover:bg-gray-200 rounded transition-colors group"
                    title="Bulleted List"
                >
                    <List className="w-4 h-4 text-[#374151] group-hover:text-[#111827]" />
                </button>
                <button
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); execCommand('insertOrderedList'); }}
                    className="p-1.5 hover:bg-gray-200 rounded transition-colors group"
                    title="Numbered List"
                >
                    <ListOrdered className="w-4 h-4 text-[#374151] group-hover:text-[#111827]" />
                </button>
                <div className="w-px h-6 bg-[#d1d5db] mx-1" />
                <button
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); execCommand('justifyLeft'); }}
                    className="p-1.5 hover:bg-gray-200 rounded transition-colors group"
                    title="Align Left"
                >
                    <AlignLeft className="w-4 h-4 text-[#374151] group-hover:text-[#111827]" />
                </button>
                <button
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); execCommand('justifyCenter'); }}
                    className="p-1.5 hover:bg-gray-200 rounded transition-colors group"
                    title="Align Center"
                >
                    <AlignCenter className="w-4 h-4 text-[#374151] group-hover:text-[#111827]" />
                </button>
                <div className="w-px h-6 bg-[#d1d5db] mx-1" />
                <button
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); openLinkDialog(); }}
                    className="p-1.5 hover:bg-gray-200 rounded transition-colors group"
                    title="Insert Link"
                >
                    <LinkIcon className="w-4 h-4 text-[#374151] group-hover:text-[#111827]" />
                </button>
                <div className="w-px h-6 bg-[#d1d5db] mx-1" />
                <button
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); execCommand('undo'); }}
                    className="p-1.5 hover:bg-gray-200 rounded transition-colors group"
                    title="Undo"
                >
                    <RotateCcw className="w-4 h-4 text-[#374151] group-hover:text-[#111827]" />
                </button>
                <button
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); execCommand('redo'); }}
                    className="p-1.5 hover:bg-gray-200 rounded transition-colors group"
                    title="Redo"
                >
                    <RotateCw className="w-4 h-4 text-[#374151] group-hover:text-[#111827]" />
                </button>
            </div>

            {/* Editable Area */}
            <div
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                onFocus={handleFocus}
                className="w-full px-4 py-3 text-[15px] text-[#111827] focus:outline-none overflow-y-auto prose prose-sm max-w-none prose-p:mb-6 [&_b]:font-bold [&_i]:italic [&_u]:underline [&_a]:text-blue-600 [&_a]:underline"
                style={heightStyle}
            />

            {/* Placeholder */}
            {(!value || value === '<p><br></p>' || value === '') && (
                <div className="absolute top-[52px] left-4 text-[#9ca3af] pointer-events-none text-[15px] py-3">
                    {placeholder}
                </div>
            )}

            {/* Link Dialog */}
            <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <ExternalLink className="w-4 h-4" />
                            Insert Link
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-[13px] font-medium text-gray-700">Enter URL:</label>
                            <Input
                                value={linkUrl}
                                onChange={(e) => setLinkUrl(e.target.value)}
                                placeholder="https://example.com"
                                className="h-10"
                                autoFocus
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        applyLink();
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <DialogFooter className="flex-row items-center justify-between gap-2 sm:justify-end">
                        <Button
                            variant="outline"
                            onClick={() => setIsLinkDialogOpen(false)}
                            className="flex-1 sm:flex-none"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={applyLink}
                            className="flex-1 sm:flex-none bg-[#C10007] hover:bg-[#a10006] text-white"
                        >
                            Insert Link
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
