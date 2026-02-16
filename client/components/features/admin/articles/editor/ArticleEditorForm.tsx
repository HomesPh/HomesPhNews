"use client";

import { useState, useRef, useEffect, useMemo } from 'react';
import { useBlockEditor, Block } from "@/hooks/useBlockEditor";
import EditorHeader from "@/components/features/blogger/editor/EditorHeader";
import BlockDrawer from "@/components/features/blogger/editor/BlockDrawer";
import Canvas from "@/components/features/blogger/editor/Canvas";
import EditorToolbar from "@/components/features/blogger/editor/EditorToolbar";
import BlogPreviewModal from "@/components/features/blogger/editor/BlogPreviewModal";
import LinkModal from "@/components/features/blogger/editor/LinkModal";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useEditorStore } from "@/hooks/useEditorStore";
import { useAuth } from "@/hooks/useAuth";
import { uploadArticleImage } from "@/lib/api-v2";
import { htmlToBlocks } from "@/lib/converter/htmlToBlocks";
import { blocksToHtml } from "@/lib/converter/blocksToHtml";
import { Loader2 } from "lucide-react";

interface ArticleEditorFormProps {
    data: any;
    availableSites: string[];
    onDataChange: (field: string, value: any) => void;
    template: any;
    onTemplateChange: (template: any) => void;
    onSave?: (currentData?: any) => void;
    onPublish?: (currentData?: any) => void;
    onClose?: () => void;
}

export default function ArticleEditorForm({
    data,
    availableSites,
    onDataChange,
    template,
    onTemplateChange,
    onSave,
    onPublish,
    onClose
}: ArticleEditorFormProps) {
    const editor = useBlockEditor();
    const { user } = useAuth();
    const [isLoaded, setIsLoaded] = useState(false);

    // Initialize Editor with Admin Data
    useEffect(() => {
        if (!isLoaded && data) {
            console.log("Initializing Editor with Data:", data);

            // 1. Convert Content to Blocks
            let initialBlocks: Block[] = [];

            // Heuristic: Check for potential data loss in existing blocks
            // If HTML content has <img> tags but saved blocks have ZERO images, we likely have a bad save.
            // In that case, re-run htmlToBlocks to recover the images.
            const htmlHasImages = /<img/i.test(data.content || '');
            const savedBlocks = data.contentBlocks || [];
            const blocksHaveImages = savedBlocks.some((b: any) =>
                ['image', 'centered-image', 'left-image', 'right-image', 'grid'].includes(b.type)
            );

            // Use saved blocks ONLY if checks pass
            if (savedBlocks.length > 0 && (!htmlHasImages || blocksHaveImages)) {
                console.log("Using saved contentBlocks");
                initialBlocks = savedBlocks;

                // Update any image blocks with empty captions to use auto-generated caption
                const autoCaption = data.title && data.country ? `${data.title} — ${data.country}` : "";
                if (autoCaption) {
                    initialBlocks = initialBlocks.map((block: any) => {
                        if (['image', 'centered-image'].includes(block.type) &&
                            block.content &&
                            (!block.content.caption || block.content.caption === '')) {
                            console.log(`Auto-populating caption for block ${block.id}:`, autoCaption);
                            return {
                                ...block,
                                content: {
                                    ...block.content,
                                    caption: autoCaption
                                }
                            };
                        }
                        return block;
                    });
                }
            } else if (data.content) {
                console.log("Generating blocks from HTML content (Fallback/Recovery mode)");
                console.log("HTML Content Preview:", data.content.substring(0, 500));
                initialBlocks = htmlToBlocks(data.content);
                console.log("Blocks generated from HTML:", initialBlocks);
            }

            // 1.5 - Ensure "Featured Image" (data.image) is present as the first block
            // Many users expect the main article image to be editable on the canvas.
            // If the converted blocks don't start with an image, or if the first image is different,
            // we prepend the featured image.
            if (data.image) {
                console.log("Featured Image Data:", {
                    image: data.image,
                    image_caption: data.image_caption,
                    caption: data.caption,
                    allDataKeys: Object.keys(data)
                });

                const firstBlock = initialBlocks[0];
                const firstBlockIsImage = firstBlock && ['image', 'centered-image'].includes(firstBlock.type);

                // Check if the First Block IS the featured image (fuzzy match src)
                const firstBlockSrc = firstBlockIsImage ? firstBlock.content.src : "";

                // If the first block is NOT an image, OR if it's an image but different from data.image
                // We prepend data.image. 
                // However, we must be careful not to duplicate if data.image is just inside the content later?
                // But usually Featured Image is TOP.
                if (!firstBlockIsImage || (firstBlockSrc && !firstBlockSrc.includes(data.image) && !data.image.includes(firstBlockSrc))) {
                    // Auto-generate caption from title + country if no explicit caption exists
                    const captionValue = data.image_caption || data.caption ||
                        (data.title && data.country ? `${data.title} — ${data.country}` : "");

                    console.log("Prepending Featured Image to blocks:", {
                        src: data.image,
                        caption: captionValue,
                        captionSource: data.image_caption ? 'image_caption' :
                            data.caption ? 'caption' :
                                captionValue ? 'auto-generated (title + country)' : 'empty'
                    });

                    const featuredImageBlock: Block = {
                        id: Math.random().toString(36).substr(2, 9),
                        type: 'image',
                        content: {
                            src: data.image,
                            caption: captionValue
                        },
                        settings: { textAlign: 'center' }
                    };
                    initialBlocks.unshift(featuredImageBlock);

                    console.log("Featured Image Block Created:", featuredImageBlock);
                }
            }

            // 2. Map Details
            const initialDetails = {
                title: data.title || "",
                slug: data.slug || "",
                summary: data.summary || "",
                category: data.category || "",
                country: data.country || "PHILIPPINES",
                tags: data.tags || [],
                author: data.author || user?.name || "",
                authorTitle: "",
                publishDate: data.publishDate || new Date().toISOString().split('T')[0],
                publishTime: data.publishTime || "12:00",
                platforms: data.publishTo || [],
                views: data.views_count || 0
            };

            console.log("Loading Editor Data:", { initialBlocks, initialDetails });

            editor.loadData({
                blocks: initialBlocks,
                details: initialDetails
            });

            console.log("Editor State After Load:", { blocks: editor.blocks, details: editor.details });
            setIsLoaded(true);
        }
    }, [data, isLoaded, user]); // Removed 'editor' to prevent re-initialization loop

    // Sync back to Parent Form
    useEffect(() => {
        if (!isLoaded) return;

        // Sync Details
        if (data.title !== editor.details.title) onDataChange('title', editor.details.title);
        if (data.slug !== editor.details.slug) onDataChange('slug', editor.details.slug);
        if (data.summary !== editor.details.summary) onDataChange('summary', editor.details.summary);
        if (data.category !== editor.details.category) onDataChange('category', editor.details.category);
        if (data.country !== editor.details.country) onDataChange('country', editor.details.country);
        if (JSON.stringify(data.publishTo) !== JSON.stringify(editor.details.platforms)) onDataChange('publishTo', editor.details.platforms);
        if (data.author !== editor.details.author) onDataChange('author', editor.details.author);
        if (data.publishDate !== editor.details.publishDate) onDataChange('publishDate', editor.details.publishDate);
        if (data.publishTime !== editor.details.publishTime) onDataChange('publishTime', editor.details.publishTime);

        // Sync Blocks & Content 
        if (JSON.stringify(data.contentBlocks) !== JSON.stringify(editor.blocks)) {
            onDataChange('contentBlocks', editor.blocks);
        }

    }, [editor.details, editor.blocks, isLoaded]);


    // --- Layout Logic ---

    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
    const [zoom, setZoom] = useState(100);
    const [isDrawerOpen, setIsDrawerOpen] = useState(true);

    const activeBlock = useMemo(() =>
        editor.blocks.find(b => b.id === activeBlockId) || null,
        [editor.blocks, activeBlockId]
    );

    const handleUpdateSettings = (updates: Partial<Block['settings']>) => {
        if (activeBlockId) {
            editor.updateBlockSettings(activeBlockId, updates);
        }
    };

    const getLatestData = () => {
        const htmlContent = blocksToHtml(editor.blocks);

        // Sync local changes to parent via onDataChange
        onDataChange('content', htmlContent);
        onDataChange('contentBlocks', editor.blocks);

        return {
            ...editor.details,
            content: htmlContent,
            contentBlocks: editor.blocks
        };
    };

    const handleInternalSave = () => {
        const currentData = getLatestData();
        console.log("Synced data for save.");
        if (onSave) onSave(currentData);
        return currentData;
    };

    const handleInternalPublish = () => {
        const latestData = getLatestData();
        if (onPublish) onPublish(latestData);
    }

    if (!isLoaded) return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin" /></div>;

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="flex flex-col h-full bg-white font-inter w-full absolute inset-0 z-50">
                <EditorHeader
                    onSave={handleInternalSave}
                    onPublish={handleInternalPublish}
                    onPreview={() => setIsPreviewOpen(true)}
                    onClose={onClose} // Pass onClose if integrated
                />

                <EditorToolbar
                    activeBlock={activeBlock}
                    onUpdateSettings={handleUpdateSettings}
                    onUndo={editor.undo}
                    onRedo={editor.redo}
                    canUndo={editor.canUndo}
                    canRedo={editor.canRedo}
                    zoom={zoom}
                    onZoomChange={setZoom}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    setIsLinkModalOpen={setIsLinkModalOpen}
                />

                <div className="flex-1 flex overflow-hidden relative">
                    {/* Left Sidebar - Drawer */}
                    <div
                        className={`border-r border-gray-200 bg-white flex flex-col shrink-0 z-20 transition-all duration-300 absolute md:static h-full shadow-xl md:shadow-none ${isDrawerOpen ? 'w-[360px] translate-x-0' : 'w-0 -translate-x-full md:w-0 md:translate-x-0 overflow-hidden'}`}
                    >
                        <div className="h-full overflow-hidden flex flex-col w-[360px]">
                            <BlockDrawer
                                onAddBlock={editor.addBlock}
                                details={editor.details}
                                onUpdateDetails={editor.updateDetails}
                            />
                        </div>
                    </div>

                    {/* Drawer Toggle Button */}
                    <button
                        onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                        className={`absolute top-4 z-30 p-2 bg-white border border-gray-200 shadow-md rounded-r-xl transition-all duration-300 flex items-center justify-center hover:text-[#C10007] ${isDrawerOpen ? 'left-[360px]' : 'left-0'}`}
                        title={isDrawerOpen ? "Close Library" : "Open Library"}
                    >
                        {isDrawerOpen ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                        )}
                    </button>

                    {/* Main Canvas Area */}
                    <div
                        className="flex-1 overflow-y-auto p-12 flex justify-center bg-[#f3f4f6] relative transition-all duration-300"
                        onClick={() => setActiveBlockId(null)}
                    >
                        <Canvas
                            blocks={editor.blocks}
                            details={editor.details}
                            activeBlockId={activeBlockId}
                            onSelectBlock={setActiveBlockId}
                            onUpdateBlock={editor.updateBlockContent}
                            onRemoveBlock={editor.removeBlock}
                            onMoveBlock={editor.moveBlock}
                            onReorder={editor.reorderBlocks}
                            onUpdateDetails={editor.updateDetails}
                            onAddBlockAt={editor.addBlockAt}
                            onUpdateBlockSettings={editor.updateBlockSettings}
                            zoom={zoom}
                            viewMode={viewMode}
                        />
                    </div>
                </div>

                {/* Modals */}
                {isPreviewOpen && (
                    <BlogPreviewModal
                        blocks={editor.blocks}
                        details={editor.details}
                        onClose={() => setIsPreviewOpen(false)}
                    />
                )}

                <LinkModal
                    isOpen={isLinkModalOpen}
                    onClose={() => setIsLinkModalOpen(false)}
                    onSave={(url) => {
                        let finalUrl = url.trim();
                        if (finalUrl && !/^https?:\/\//i.test(finalUrl) && !/^mailto:/i.test(finalUrl)) {
                            finalUrl = `https://${finalUrl}`;
                        }
                        const activeEditor = useEditorStore.getState().activeEditor;
                        if (activeEditor) {
                            if (finalUrl === "") {
                                activeEditor.chain().focus().unsetLink().run();
                            } else {
                                activeEditor.chain().focus().setLink({ href: finalUrl }).run();
                            }
                        } else if (activeBlockId) {
                            editor.updateBlockSettings(activeBlockId, { link: finalUrl });
                        }
                    }}
                    initialUrl={activeBlock?.settings?.link || ""}
                />
            </div>
        </DndProvider>
    );
}
