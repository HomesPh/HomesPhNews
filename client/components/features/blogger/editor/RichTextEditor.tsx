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
                class: cn("focus:outline-none min-h-[1.5em] [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5", className),
                style: style as any
            }
        },
        immediatelyRender: false,
    });

    // Sync content if it changes externally (e.g. undo/redo)
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            // Avoid loop if content is visually same but HTML differs slightly, 
            // Tiptap handles this usually, but a basic check:
            if (editor.getText() === "" && content === "") return; // both empty

            // Only update if not focused to avoid cursor jumping, or use finer diffing.
            // For undo/redo, the block key usually changes or we need to force update.
            // Simpler approach: verify if content is significantly different.
            // Editor.commands.setContent(content)

            // The issue with useEffect sync is cursor position loss.
            // We rely on the parent key changing to re-mount the editor for Undo/Redo often.
            // Or we just check if focused.
            if (!editor.isFocused) {
                editor.commands.setContent(content);
            }
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
        if (editor && style) {
            // We use editor.view.dom to directly manipulate styles as setOptions/editorProps is less reliable for dynamic style updates in some Tiptap versions
            const dom = editor.view.dom;
            Object.assign(dom.style, style);

            // Also update classes if needed, though usually static
            if (className) {
                const combinedClass = cn("focus:outline-none min-h-[1.5em] [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5", className);
                if (dom.className !== combinedClass) {
                    // CAUTION: overwriting className might remove ProseMirror class? 
                    // Tiptap usually manages the class via attributes. 
                    // Safer to update via editor.setOptions for attributes
                    editor.setOptions({
                        editorProps: {
                            attributes: {
                                class: combinedClass,
                                style: style as any
                            }
                        }
                    });
                } else {
                    // Just update attributes to be safe for Tiptap internal state
                    editor.setOptions({
                        editorProps: {
                            attributes: {
                                style: style as any
                            }
                        }
                    });
                }
            } else {
                editor.setOptions({
                    editorProps: {
                        attributes: {
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
