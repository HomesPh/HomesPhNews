import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import Color from '@tiptap/extension-color';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect } from 'react';
import { useEditorStore } from '@/hooks/useEditorStore';
import { cn } from '@/lib/utils';
import { Block } from '@/hooks/useBlockEditor';
import { FontSize } from '@/lib/tiptap/FontSize';

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    editable?: boolean;
    className?: string;
    placeholder?: string;
    style?: React.CSSProperties;
    blockId: string; // To identify which block this editor belongs to
}

const RichTextEditor = ({ content, onChange, editable = true, className, placeholder, style, blockId }: RichTextEditorProps) => {
    const { setActiveEditor, activeEditor } = useEditorStore();

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Placeholder.configure({
                placeholder: placeholder || 'Start typing...',
                emptyEditorClass: 'is-editor-empty before:content-[attr(data-placeholder)] before:text-gray-400 before:float-left before:pointer-events-none before:h-0',
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-500 underline cursor-pointer',
                },
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            TextStyle,
            FontFamily,
            Color,
            FontSize,
        ],
        content: content,
        editable: editable,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        onFocus: ({ editor }) => {
            setActiveEditor(editor);
        },
        onBlur: ({ editor }) => {
            // Optional: clear active editor on blur if needed, but often better to keep it
            // ensuring toolbar doesn't flicker. However, for multiple blocks, we want to know who is active.
            // checks if related target is within toolbar? complex.
            // simplistic: keep it active until another one is focused.
        },
        editorProps: {
            attributes: {
                class: cn(
                    "tiptap focus:outline-none min-h-[1.5em] break-words",
                    " [&_ul]:list-disc [&_ul]:list-outside [&_ul]:pl-10 [&_ol]:list-decimal [&_ol]:list-outside [&_ol]:pl-10 [&_ul]:m-0 [&_ol]:m-0 [&_p]:m-0 [&_li]:mb-1",
                    className
                ),
                style: style as any
            }
        },
        immediatelyRender: false,
    });

    // Sync content if it changes externally (e.g. undo/redo)
    useEffect(() => {
        if (!editor || content === editor.getHTML()) return;

        if (!editor.isFocused) {
            editor.commands.setContent(content, { emitUpdate: false }); 
        } else if (content === "") {
            // Special case: external clear while focused
            editor.commands.setContent("");
        }
    }, [content, editor]);

    // Update active editor ref if this block is active
    useEffect(() => {
        return () => {
            if (activeEditor === editor) {
                setActiveEditor(null);
            }
        };
    }, [editor, activeEditor, setActiveEditor]);

    // Sync styles and classes when props change
    useEffect(() => {
        if (editor) {
            // Update attributes only if they differ to avoid loops
            const currentAttr = editor.options.editorProps.attributes as any || {};
            const nextClass = cn(
                "tiptap focus:outline-none min-h-[1.5em] break-words",
                " [&_ul]:list-disc [&_ul]:list-outside [&_ul]:pl-10 [&_ol]:list-decimal [&_ol]:list-outside [&_ol]:pl-10 [&_ul]:m-0 [&_ol]:m-0 [&_p]:m-0 [&_li]:mb-1",
                className
            );

            if (currentAttr.class !== nextClass || JSON.stringify(currentAttr.style) !== JSON.stringify(style)) {
                editor.setOptions({
                    editorProps: {
                        attributes: {
                            class: nextClass,
                            style: style as any
                        }
                    }
                });
            }
        }
    }, [editor, style, className]);


    return (
        <EditorContent editor={editor} className="w-full" />
    );
};

export default RichTextEditor;
