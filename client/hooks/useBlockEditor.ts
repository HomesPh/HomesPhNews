"use client";

import { useState, useCallback, useMemo, useEffect } from 'react';

export type BlockType =
    | 'text'
    | 'image'
    | 'grid'
    | 'split-left'
    | 'split-right'
    | 'dynamic-images'
    | 'centered-image'
    | 'left-image'
    | 'right-image';

export interface Block {
    id: string;
    type: BlockType;
    content: any;
    settings?: {
        fontSize?: string;
        fontWeight?: string;
        textAlign?: 'left' | 'center' | 'right' | 'justify';
        color?: string;
        isUnderline?: boolean;
        isItalic?: boolean;
        fontFamily?: string;
        listType?: 'bullet' | 'number';
        link?: string;
        imagePosition?: { x: number; y: number };
    };
}

export interface BlogDetails {
    title: string;
    slug: string;
    summary: string;
    category: string;
    country: string;
    tags: string[];
    author: string;
    authorTitle?: string;
    publishDate: string;
    publishTime: string;
    platforms: string[];
    views: number;
}

interface EditorState {
    blocks: Block[];
    details: BlogDetails;
}

export function useBlockEditor() {
    // Initial State
    const initialState: EditorState = {
        blocks: [],
        details: {
            title: "",
            slug: "",
            summary: "",
            category: "",
            country: "",
            tags: [],
            author: "",
            authorTitle: "",
            publishDate: new Date().toISOString().split('T')[0],
            publishTime: "12:00",
            platforms: [],
            views: 0
        }
    };

    const [state, setState] = useState<EditorState>(initialState);
    const [history, setHistory] = useState<EditorState[]>([initialState]);
    const [historyIndex, setHistoryIndex] = useState(0);

    // Sync Helper: Primarily for slug generation now
    const syncState = useCallback((newState: EditorState): EditorState => {
        const updatedDetails = { ...newState.details };

        // Auto-slug if title changes
        updatedDetails.slug = updatedDetails.title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');

        return { ...newState, details: updatedDetails };
    }, []);

    const updateStateWithHistory = useCallback((newState: EditorState) => {
        const syncedState = syncState(newState);
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(syncedState);

        // Limit history to 30 steps
        if (newHistory.length > 30) newHistory.shift();

        setState(syncedState);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    }, [history, historyIndex, syncState]);

    const addBlock = useCallback((type: BlockType) => {
        const newBlock: Block = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            content: getDefaultContent(type),
            settings: { textAlign: 'left', fontSize: '18px' }
        };
        updateStateWithHistory({ ...state, blocks: [...state.blocks, newBlock] });
    }, [state, updateStateWithHistory]);

    const addBlockAt = useCallback((index: number, type: BlockType = 'text') => {
        const newBlock: Block = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            content: getDefaultContent(type),
            settings: { textAlign: 'left', fontSize: '18px' }
        };
        const newBlocks = [...state.blocks];
        newBlocks.splice(index, 0, newBlock);
        updateStateWithHistory({ ...state, blocks: newBlocks });
    }, [state, updateStateWithHistory]);

    const removeBlock = useCallback((id: string) => {
        updateStateWithHistory({ ...state, blocks: state.blocks.filter(b => b.id !== id) });
    }, [state, updateStateWithHistory]);

    const moveBlock = useCallback((id: string, direction: 'up' | 'down') => {
        const index = state.blocks.findIndex(b => b.id === id);
        if (index === -1) return;
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === state.blocks.length - 1) return;

        const newBlocks = [...state.blocks];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
        updateStateWithHistory({ ...state, blocks: newBlocks });
    }, [state, updateStateWithHistory]);

    const updateBlockContent = useCallback((id: string, newContent: any) => {
        const newBlocks = state.blocks.map(b => b.id === id ? { ...b, content: { ...b.content, ...newContent } } : b);
        updateStateWithHistory({ ...state, blocks: newBlocks });
    }, [state, updateStateWithHistory]);

    const updateBlockSettings = useCallback((id: string, updates: Partial<Block['settings']>) => {
        const newBlocks = state.blocks.map(b => b.id === id ? { ...b, settings: { ...b.settings, ...updates } } : b);
        updateStateWithHistory({ ...state, blocks: newBlocks });
    }, [state, updateStateWithHistory]);

    const undo = useCallback(() => {
        if (historyIndex > 0) {
            setHistoryIndex(prev => prev - 1);
            setState(history[historyIndex - 1]);
        }
    }, [history, historyIndex]);

    const redo = useCallback(() => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(prev => prev + 1);
            setState(history[historyIndex + 1]);
        }
    }, [history, historyIndex]);

    const updateDetails = useCallback((updates: Partial<BlogDetails>) => {
        const newDetails = { ...state.details, ...updates };
        updateStateWithHistory({ ...state, details: newDetails });
    }, [state, updateStateWithHistory]);

    const reorderBlocks = useCallback((dragIndex: number, hoverIndex: number) => {
        const newBlocks = [...state.blocks];
        const dragBlock = newBlocks[dragIndex];
        newBlocks.splice(dragIndex, 1);
        newBlocks.splice(hoverIndex, 0, dragBlock);
        updateStateWithHistory({ ...state, blocks: newBlocks });
    }, [state, updateStateWithHistory]);

    return {
        blocks: state.blocks,
        details: state.details,
        addBlock,
        addBlockAt,
        removeBlock,
        moveBlock,
        reorderBlocks,
        updateBlockContent,
        updateBlockSettings,
        updateDetails,
        undo,
        redo,
        canUndo: historyIndex > 0,
        canRedo: historyIndex < history.length - 1,
        setBlocks: (newBlocks: Block[]) => updateStateWithHistory({ ...state, blocks: newBlocks }),
        loadData: (data: EditorState) => {
            setState(data);
            setHistory([data]);
            setHistoryIndex(0);
        }
    };
}

function getDefaultContent(type: BlockType) {
    switch (type) {
        case 'text':
            return { text: "" };
        case 'image':
        case 'centered-image':
            return { src: "", caption: "" };
        case 'left-image':
        case 'right-image':
            return { image: "", text: "", caption: "" }; // Fixed: renderer expects 'image' and 'text', not 'src'
        case 'grid':
            return { images: ["", ""] }; // Start with 2 images
        case 'split-left':
        case 'split-right':
            return { text: "Enter text here", image: "" };
        case 'dynamic-images':
            return { images: [] };
        default:
            return {};
    }
}
