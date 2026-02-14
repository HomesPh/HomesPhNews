import { create } from 'zustand';
import { Editor } from '@tiptap/react';

interface EditorStore {
    activeEditor: Editor | null;
    setActiveEditor: (editor: Editor | null) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
    activeEditor: null,
    setActiveEditor: (editor) => set({ activeEditor: editor }),
}));
