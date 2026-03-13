"use client";

import { useState, useCallback, useMemo, useEffect } from 'react';
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
    original_url: string;
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
            views: 0,
            original_url: ""
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
            id: crypto.randomUUID(),
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
            id: crypto.randomUUID(),
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
     * Memoized state for aggregating texts from content blocks
     * into one text array.
     */
    const contentString = useMemo(() => {
        return state.blocks
            .filter(blk => blk.type === "text")
            .map(blk => blk.content.text as string)
            .join("");
    }, [state.blocks]);

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
            const context = contentString;
            const instructions = `You are a professional copywriter for editorial and marketing materials.
                Your output must be plain text only — no markdown, no bullet symbols, no explanations, no preamble.
                Tone: confident, clear, and modern.

                Guidelines:
                - Write in a natural, human voice — avoid AI-sounding filler phrases like "In today's world" or "It's important to note"
                - Be concise: say more with less
                - Match the register of the surrounding content (professional, conversational, persuasive, etc.)
                - Do not introduce yourself, explain your output, or add any commentary
                - Output only the requested copy and nothing else`;
            const prompt = `Create text about these details: ${context}`;

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
    }, [state.blocks, updateBlockContent, contentString]);

    /**
     * Generate one or more images from a prompt and write them into a target block.
     * The specific field we update depends on the block type (`src`, `image`, or `images`).
     */
    const generateImagesForBlock = useCallback(async (params: {
        blockId: string;
        /**
         * Number of images to request (default 1).
         * The API returns an array of URLs.
         */
        count?: number;
    }) => {
        const { blockId, count = 1 } = params;

        setIsGenerating(true);
        setBlockLoading(blockId, true);
        setGenerationError(null);
        try {
            const context = contentString;
            const prompt = `You are a professional visual content creator for editorial and marketing materials.
                Generate a high-quality, photorealistic image that visually represents the provided content.
                Guidelines:
                - The image should feel editorial, clean, and modern
                - Avoid text, watermarks, or overlaid typography
                - Use natural lighting and composition
                - Match the tone of the content (professional, warm, dramatic, etc.)
                - Prefer wide/landscape orientation for banner and hero blocks
                Create an image about these details: ${context}
                `;

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
    }, [state.blocks, updateBlockContent, contentString]);

    const [isGenerateTitleLoading, setGenerateTitleLoading] = useState<boolean>(false);
    const generateTitle = useCallback(async () => {
        setGenerateTitleLoading(true);

        // content block text, reduced into string array
        const context = contentString;
        const instructions = `
            You are a clickbait title generator. Given the provided text content, generate a single attention-grabbing, curiosity-inducing title.
            Guidelines:
            - Return ONLY the title text with no explanations or quotes
            - Keep it between 5–12 words
            - Use proven clickbait patterns such as:
            - "You Won't Believe..."
            - "X Reasons Why..."
            - "The Secret to..."
            - "Why Everyone Is Talking About..."
            - "This Changes Everything About..."
            - "Nobody Tells You About..."
            - Create a curiosity gap that compels the reader to click
            - Use power words like: shocking, secret, proven, instant, effortless, surprising
            - If the content is too vague or empty, return "You Won't Believe What We Found"
            `;
        const prompt = `Create a title about these details: ${context}`;

        try {
            const res = await generateText({ prompt, options: { instructions } });
            const text = res.data?.data?.text ?? "";

            console.log("[useBlockEditor.ts][generateTitle]:", res);
            updateDetails({ title: text });
        } catch {
            console.log("[useBlockEditor.ts][generateTitle]: error generating title");
        } finally {
            setGenerateTitleLoading(false);
        }
    }, [contentString, updateDetails]);

    const [isGenerateSummaryLoading, setGenerateSummaryLoading] = useState<boolean>(false);
    const generateSummary = useCallback(async () => {
        setGenerateSummaryLoading(true);

        // content block text, reduced into string array
        const context = contentString;
        const instructions = `
            You are a content summarization assistant. Given the provided text content, generate a concise and informative summary.
            Guidelines:
            - Return ONLY the summary text with no explanations, labels, or formatting
            - Keep it between 2–4 sentences
            - Capture the key points and main ideas of the content
            - Use clear, neutral, and professional language
            - Preserve the original meaning without adding interpretation or opinion
            - If the content is too vague or empty, return "No summary available"
        `;
        const prompt = `Summarize the following content: ${context}`;

        try {
            const res = await generateText({ prompt, options: { instructions } });
            const text = res.data?.data?.text ?? "";

            console.log("[useBlockEditor.ts][generateSummary]:", res);
            updateDetails({ summary: text });
        } catch {
            console.log("[useBlockEditor.ts][generateSummary]: error generating title");
        } finally {
            setGenerateSummaryLoading(false);
        }
    }, [contentString, updateDetails]);

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
        loadData,

        // Generate Title
        isGenerateTitleLoading,
        generateTitle,

        // Generate Summary
        isGenerateSummaryLoading,
        generateSummary,
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
