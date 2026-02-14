"use client";

import { useBlockEditor, Block } from "@/hooks/useBlockEditor";
import EditorHeader from "./EditorHeader";
import BlockDrawer from "./BlockDrawer";
import Canvas from "./Canvas";
import EditorToolbar from "./EditorToolbar";
import { useState, useMemo } from "react";
import BlogPreviewModal from "./BlogPreviewModal";
import LinkModal from "./LinkModal";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useEditorStore } from "@/hooks/useEditorStore";

import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

export default function BlockEditor() {
    const editor = useBlockEditor();
    const { user } = useAuth();

    // Set author to logged-in user if it's the default or empty
    // Set author to logged-in user if it's the default or empty, avoiding "Admin"
    useEffect(() => {
        if (user && (editor.details.author === "HomesPh News" || editor.details.author === "")) {
            const newAuthor = user.name === "Admin" || user.name === "Super Admin" ? "Author" : user.name;
            editor.updateDetails({ author: newAuthor });
        }
    }, [user, editor.details.author, editor.updateDetails]);

    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [activeBlockId, setActiveBlockId] = useState<string | null>(null);

    const activeBlock = useMemo(() =>
        editor.blocks.find(b => b.id === activeBlockId) || null,
        [editor.blocks, activeBlockId]
    );

    const handleSaveDraft = () => {
        console.log("Saving draft:", { blocks: editor.blocks, details: editor.details });
        alert("Draft saved successfully!");
    };

    const handlePublish = () => {
        if (!editor.details.title || !editor.details.summary) {
            alert("Title and Summary are required before publishing.");
            return;
        }
        console.log("Publishing blog:", { blocks: editor.blocks, details: editor.details });
        alert("Blog published successfully!");
    };

    const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
    const [zoom, setZoom] = useState(100);

    const handleUpdateSettings = (updates: Partial<Block['settings']>) => {
        if (activeBlockId) {
            editor.updateBlockSettings(activeBlockId, updates);
        }
    };

    const handleUndo = editor.undo;
    const handleRedo = editor.redo;

    const [isDrawerOpen, setIsDrawerOpen] = useState(true);

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="flex flex-col h-screen bg-white font-inter">
                <EditorHeader
                    onSave={() => console.log("Save draft", editor.details)}
                    onPublish={() => console.log("Publish", editor.details)}
                    onPreview={() => setIsPreviewOpen(true)}
                />

                <EditorToolbar
                    activeBlock={activeBlock}
                    onUpdateSettings={handleUpdateSettings}
                    onUndo={handleUndo}
                    onRedo={handleRedo}
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
