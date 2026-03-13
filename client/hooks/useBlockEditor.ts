"use client";

import { useState, useCallback } from 'react';
import { generateImages, generateText } from "@/lib/api-v2";

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
    province_id: string | number;
    city_id: string | number;
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
    /**
     * ============================================================
     * Initial state
     * ============================================================
     * The editor manages two things:
     * - `blocks`: the actual content blocks (text, images, layouts)
     * - `details`: article/blog metadata (title, slug, etc.)
     */
    const initialState: EditorState = {
        blocks: [],
        details: {
            title: "",
            slug: "",
            summary: "",
            category: "",
            country: "",
            province_id: "",
            city_id: "",
            tags: [],
            author: "",
            authorTitle: "",
            publishDate: new Date().toISOString().split('T')[0],
            publishTime: "12:00",
            platforms: [],
            views: 0
        }
    };

    /**
     * ============================================================
     * Core editor state + history (undo/redo)
     * ============================================================
     */
    const [state, setState] = useState<EditorState>(initialState);
    const [history, setHistory] = useState<EditorState[]>([initialState]);
    const [historyIndex, setHistoryIndex] = useState(0);

    /**
     * ============================================================
     * AI generation state (simple UI wiring)
     * ============================================================
     * Consumers can show a spinner / error toast while generation runs.
     */
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationError, setGenerationError] = useState<string | null>(null);
    const [loadingByBlockId, setLoadingByBlockId] = useState<Record<string, boolean>>({});
    const setBlockLoading = (blockId: string, value: boolean) => {
        setLoadingByBlockId(prev => ({ ...prev, [blockId]: value }));
    };

    /**
     * ============================================================
     * Sync helper
     * ============================================================
     * Keeps derived fields consistent (currently: slug from title).
     */
    const syncState = useCallback((newState: EditorState): EditorState => {
        const updatedDetails = { ...newState.details };

        // Auto-slug from title (URL-friendly)
        updatedDetails.slug = updatedDetails.title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');

        return { ...newState, details: updatedDetails };
    }, []);

    /**
     * Push a new state snapshot into history (with undo/redo support).
     * Note: we cap history length to keep memory bounded.
     */
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

    /**
     * ============================================================
     * Block operations
     * ============================================================
     */
    /**
     * Add a new block to the end of the document.
     */
    const addBlock = useCallback((type: BlockType) => {
        const newBlock: Block = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            content: getDefaultContent(type),
            settings: { textAlign: 'left', fontSize: '18px' }
        };
        updateStateWithHistory({ ...state, blocks: [...state.blocks, newBlock] });
    }, [state, updateStateWithHistory]);

    /**
     * Insert a new block at a specific index (used by the editor "add between blocks" UI).
     */
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

    /**
     * Remove a block by id.
     */
    const removeBlock = useCallback((id: string) => {
        updateStateWithHistory({ ...state, blocks: state.blocks.filter(b => b.id !== id) });
    }, [state, updateStateWithHistory]);

    /**
     * Move a block up/down by swapping it with its neighbor.
     */
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

    /**
     * Update a block's content by shallow-merging into existing `content`.
     * This keeps per-block schemas flexible across block types.
     */
    const updateBlockContent = useCallback((id: string, newContent: any) => {
        const newBlocks = state.blocks.map(b => b.id === id ? { ...b, content: { ...b.content, ...newContent } } : b);
        updateStateWithHistory({ ...state, blocks: newBlocks });
    }, [state, updateStateWithHistory]);

    /**
     * Update a block's settings (typography, alignment, etc.) by shallow-merging.
     */
    const updateBlockSettings = useCallback((id: string, updates: Partial<Block['settings']>) => {
        const newBlocks = state.blocks.map(b => b.id === id ? { ...b, settings: { ...b.settings, ...updates } } : b);
        updateStateWithHistory({ ...state, blocks: newBlocks });
    }, [state, updateStateWithHistory]);

    /**
     * ============================================================
     * Undo / redo
     * ============================================================
     */
    /**
     * Step back one history snapshot (if possible).
     */
    const undo = useCallback(() => {
        if (historyIndex > 0) {
            setHistoryIndex(prev => prev - 1);
            setState(history[historyIndex - 1]);
        }
    }, [history, historyIndex]);

    /**
     * Step forward one history snapshot (if possible).
     */
    const redo = useCallback(() => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(prev => prev + 1);
            setState(history[historyIndex + 1]);
        }
    }, [history, historyIndex]);

    /**
     * ============================================================
     * Details (metadata) operations
     * ============================================================
     */
    /**
     * Update blog/article metadata (title, summary, tags, etc.).
     * Note: slug is auto-derived from title by `syncState`.
     */
    const updateDetails = useCallback((updates: Partial<BlogDetails>) => {
        const newDetails = { ...state.details, ...updates };
        updateStateWithHistory({ ...state, details: newDetails });
    }, [state, updateStateWithHistory]);

    /**
     * Reorder blocks by moving an item from dragIndex to hoverIndex.
     * Used by drag-and-drop.
     */
    const reorderBlocks = useCallback((dragIndex: number, hoverIndex: number) => {
        const newBlocks = [...state.blocks];
        const dragBlock = newBlocks[dragIndex];
        newBlocks.splice(dragIndex, 1);
        newBlocks.splice(hoverIndex, 0, dragBlock);
        updateStateWithHistory({ ...state, blocks: newBlocks });
    }, [state, updateStateWithHistory]);

    /**
     * ============================================================
     * AI helpers
     * ============================================================
     * These functions call the admin AI endpoints and write the result back
     * into the specified block content.
     */
    /**
     * Generate text from a prompt and write it into a target block.
     * Intended for `text` blocks, but writes to `content.text` generically.
     */
    const generateTextForBlock = useCallback(async (params: {
        blockId: string;
        prompt: string;
        instructions?: string;
        /**
         * If true, the generated text will be appended to existing content (when applicable).
         * If false (default), it replaces the existing text field.
         */
        append?: boolean;
    }) => {
        const { blockId, prompt, instructions, append = false } = params;
        if (!prompt?.trim()) return;

        setIsGenerating(true);
        setBlockLoading(blockId, true);
        setGenerationError(null);
        try {
            const res = await generateText({ prompt, options: { instructions } });
            const text = res.data?.data?.text ?? "";

            console.log("[useBlockEditor.ts]:", res);

            // Primary target: 'text' blocks use `{ text: string }`
            const target = state.blocks.find(b => b.id === blockId);
            const existingText = (target?.content?.text ?? "") as string;
            const nextText = append ? `${existingText}${existingText ? "\n" : ""}${text}` : text;

            updateBlockContent(blockId, { text: nextText });
            return text;
        } catch (e: any) {
            const message = e?.message || "Failed to generate text.";
            setGenerationError(message);
            throw e;
        } finally {
            setBlockLoading(blockId, false);
            setIsGenerating(false);
        }
    }, [state.blocks, updateBlockContent]);

    /**
     * Generate one or more images from a prompt and write them into a target block.
     * The specific field we update depends on the block type (`src`, `image`, or `images`).
     */
    const generateImagesForBlock = useCallback(async (params: {
        blockId: string;
        prompt: string;
        /**
         * Number of images to request (default 1).
         * The API returns an array of URLs.
         */
        count?: number;
    }) => {
        const { blockId, prompt, count = 1 } = params;
        if (!prompt?.trim()) return;

        setIsGenerating(true);
        setBlockLoading(blockId, true);
        setGenerationError(null);
        try {
            const urls = await generateImages(prompt, count);

            console.log("[BlockRenderer.tsx]: Generate button clicked!");
            console.log("[BlockRenderer.tsx]:", urls);

            // Map results to common block schemas used in this editor.
            const target = state.blocks.find(b => b.id === blockId);
            if (!target) return urls;

            if (target.type === "grid" || target.type === "dynamic-images") {
                updateBlockContent(blockId, { images: urls });
            } else if (target.type === "left-image" || target.type === "right-image") {
                updateBlockContent(blockId, { image: urls?.[0] ?? "" });
            } else {
                // 'image' / 'centered-image' and other image-like blocks use `{ src: string }`
                updateBlockContent(blockId, { src: urls?.[0] ?? "" });
            }

            return urls;
        } catch (e: any) {
            const message = e?.message || "Failed to generate image(s).";
            setGenerationError(message);
            throw e;
        } finally {
            setBlockLoading(blockId, false);
            setIsGenerating(false);
        }
    }, [state.blocks, updateBlockContent]);

    /**
     * Replace the entire blocks array (still recorded into history).
     * Useful when the UI needs to bulk-update blocks (e.g., paste/import).
     */
    const setBlocks = useCallback((newBlocks: Block[]) => {
        updateStateWithHistory({ ...state, blocks: newBlocks });
    }, [state, updateStateWithHistory]);

    /**
     * Load a full editor snapshot (blocks + details) and reset history to that snapshot.
     * Useful when loading an existing article from the server.
     */
    const loadData = useCallback((data: EditorState) => {
        setState(data);
        setHistory([data]);
        setHistoryIndex(0);
    }, []);

    return {
        /**
         * Expose the full editor surface area to UI components.
         * (Blocks/details + CRUD + history + AI helpers)
         */
        blocks: state.blocks,
        details: state.details,
        loadingByBlockId,
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
        isGenerating,
        generationError,
        generateText: generateTextForBlock,
        generateImages: generateImagesForBlock,
        setBlocks,
        loadData
    };
}

/**
 * Provide a sane initial content shape for each block type.
 * Keep this in sync with what renderers/editors expect.
 */
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
