"use client";

import ArticleHeader from "@/components/features/article/ArticleHeader";
import ArticleFeaturedImage from "@/components/features/article/ArticleFeaturedImage";
import ArticleContent from "@/components/features/article/ArticleContent";
import { ImageIcon, GripVertical } from "lucide-react";
import { TemplateType } from "./TemplateSelector";
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ContentBlock } from "../ArticleEditorModal";
import { cn } from "@/lib/utils";

interface ArticleEditorPreviewProps {
    data: {
        title: string;
        summary: string;
        content: string;
        category: string;
        country: string;
        image: string | null;
        tags: string[];
        author: string;
        timestamp: string;
        galleryImages: string[];
        splitImages: string[];
        contentBlocks: ContentBlock[];
    };
    template: TemplateType;
    onDataChange?: (field: string, value: any) => void;
}

function DraggableBlock({ block, index, moveBlock, children }: { block: ContentBlock; index: number; moveBlock: (from: number, to: number) => void; children: React.ReactNode }) {
    const [{ isDragging }, drag, preview] = useDrag({
        type: 'BLOCK',
        item: { index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, drop] = useDrop({
        accept: 'BLOCK',
        hover: (item: { index: number }) => {
            if (item.index !== index) {
                moveBlock(item.index, index);
                item.index = index;
            }
        },
    });

    return (
        <div
            ref={(node) => { preview(drop(node)); }}
            className={`group relative ${isDragging ? 'opacity-50' : 'opacity-100'} transition-opacity`}
        >
            <div
                ref={(node) => { drag(node); }}
                className="absolute -left-10 top-2 opacity-0 group-hover:opacity-100 cursor-move transition-opacity p-2 hover:bg-gray-100 rounded"
            >
                <GripVertical className="w-5 h-5 text-gray-400" />
            </div>
            {children}
        </div>
    );
}

export default function ArticleEditorPreview({ data, template, onDataChange }: ArticleEditorPreviewProps) {
    const moveBlock = (fromIndex: number, toIndex: number) => {
        if (!onDataChange || !data.contentBlocks) return;
        const updated = [...data.contentBlocks];
        const [movedBlock] = updated.splice(fromIndex, 1);
        updated.splice(toIndex, 0, movedBlock);
        onDataChange('contentBlocks', updated);
    };

    const renderPlaceholder = () => (
        <div className="w-full h-[400px] bg-gray-100 rounded-[12px] flex flex-col items-center justify-center border-2 border-dashed border-gray-200 mb-8">
            <ImageIcon className="w-16 h-16 text-gray-300 mb-2" />
            <p className="text-gray-400 font-medium">No featured image uploaded</p>
        </div>
    );

    const commonHeader = (
        <ArticleHeader
            category={data.category || 'Category'}
            categoryId={data.category}
            location={data.country || 'Location'}
            countryId={data.country}
            title={data.title || 'Article Title'}
            subtitle={data.summary || 'Article summary will appear here...'}
            author={{ name: data.author || 'Author Name' }}
            date={new Date(data.timestamp || Date.now()).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })}
            views={0}
            forceLight={true}
        />
    );

    const renderContent = () => (
        <div className="mt-8">
            <ArticleContent
                content={data.content || '<p>Article content will appear here...</p>'}
                topics={data.tags}
                forceLight={true}
            />
        </div>
    );

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="flex-1 bg-gray-50 overflow-y-auto p-8 custom-scrollbar h-full">
                <style jsx global>{`
                    .drop-cap::first-letter {
                        float: left;
                        font-size: 72px;
                        line-height: 64px;
                        margin-right: 12px;
                        margin-top: 4px;
                        font-weight: bold;
                        color: #0c0c0c;
                    }
                `}</style>
                <div className="max-w-[800px] mx-auto bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden min-h-full">
                    <div className="p-8 md:p-12">
                        {/* Template Logic */}
                        {template === 'single' && (
                            <>
                                {commonHeader}
                                {data.image ? (
                                    <ArticleFeaturedImage src={data.image} alt={data.title} />
                                ) : renderPlaceholder()}
                                {renderContent()}
                            </>
                        )}

                        {template === 'gallery' && (
                            <>
                                {commonHeader}
                                <div className="grid grid-cols-2 gap-4 my-8">
                                    {[0, 1].map((idx) => (
                                        <div key={idx} className="w-full aspect-video rounded-lg overflow-hidden bg-gray-100 border-2 border-dashed border-gray-200">
                                            {data.galleryImages[idx] ? (
                                                <img src={data.galleryImages[idx]} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <ImageIcon className="w-8 h-8 text-gray-300" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    <div className="w-full aspect-[21/9] rounded-lg overflow-hidden bg-gray-100 border-2 border-dashed border-gray-200 col-span-2">
                                        {data.galleryImages[2] ? (
                                            <img src={data.galleryImages[2]} alt="Gallery 3" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <ImageIcon className="w-10 h-10 text-gray-300" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {renderContent()}
                            </>
                        )}

                        {template === 'split' && (
                            <>
                                {commonHeader}
                                <div className="grid grid-cols-2 gap-4 my-8">
                                    {[0, 1].map((idx) => (
                                        <div key={idx} className="w-full aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-dashed border-gray-200">
                                            {data.splitImages[idx] ? (
                                                <img src={data.splitImages[idx]} alt={`Split ${idx + 1}`} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <ImageIcon className="w-10 h-10 text-gray-300" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                {renderContent()}
                            </>
                        )}

                        {template === 'inline' && (
                            <>
                                {commonHeader}
                                <div className="space-y-6 mt-8">
                                    {data.contentBlocks?.map((block, idx) => (
                                        <DraggableBlock key={block.id} block={block} index={idx} moveBlock={moveBlock}>
                                            {block.type === 'text' ? (
                                                <div
                                                    className={cn(
                                                        "prose max-w-none text-gray-700 leading-relaxed break-words [&_ul]:list-disc [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6 [&_li]:mb-1 [&_p[style*='text-align: center']]:text-center [&_p[style*='text-align: right']]:text-right [&_p[style*='text-align: justify']]:text-justify [&_div[style*='text-align: center']]:text-center [&_div[style*='text-align: right']]:text-right [&_div[style*='text-align: justify']]:text-justify",
                                                        idx === 0 && "drop-cap"
                                                    )}
                                                    dangerouslySetInnerHTML={{ __html: block.content || 'Text section content...' }}
                                                />
                                            ) : (
                                                <div className="my-6">
                                                    {block.image ? (
                                                        <img src={block.image} alt="" className="w-full rounded-lg shadow-sm" />
                                                    ) : (
                                                        <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200">
                                                            <ImageIcon className="w-8 h-8 text-gray-300" />
                                                        </div>
                                                    )}
                                                    <p className="text-sm text-center text-gray-500 mt-2 italic break-words">{block.caption}</p>
                                                </div>
                                            )}
                                        </DraggableBlock>
                                    ))}
                                </div>
                            </>
                        )}

                        {template === 'textwrap' && (
                            <>
                                {commonHeader}
                                <div className="mt-8">
                                    {data.contentBlocks?.map((block, idx) => (
                                        <DraggableBlock key={block.id} block={block} index={idx} moveBlock={moveBlock}>
                                            <div className="mb-8 overflow-hidden">
                                                {block.image ? (
                                                    <img
                                                        src={block.image}
                                                        alt=""
                                                        className={cn(
                                                            "w-64 h-auto rounded-lg mb-4 shadow-sm",
                                                            block.position === 'left' ? 'float-left mr-6' : 'float-right ml-6'
                                                        )}
                                                    />
                                                ) : (
                                                    <div className={cn(
                                                        "w-48 h-48 bg-gray-100 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-gray-200 mb-4",
                                                        block.position === 'left' ? 'float-left mr-6' : 'float-right ml-6'
                                                    )}>
                                                        <ImageIcon className="w-8 h-8 text-gray-300" />
                                                    </div>
                                                )}
                                                <div
                                                    className={cn(
                                                        "prose max-w-none text-gray-700 leading-relaxed break-words [&_ul]:list-disc [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6 [&_li]:mb-1 [&_p[style*='text-align: center']]:text-center [&_p[style*='text-align: right']]:text-right [&_p[style*='text-align: justify']]:text-justify [&_div[style*='text-align: center']]:text-center [&_div[style*='text-align: right']]:text-right [&_div[style*='text-align: justify']]:text-justify",
                                                        idx === 0 && "drop-cap"
                                                    )}
                                                    dangerouslySetInnerHTML={{ __html: block.content || "Content flowing around image..." }}
                                                />
                                                <div className="clear-both" />
                                            </div>
                                        </DraggableBlock>
                                    ))}
                                </div>
                            </>
                        )}

                        {template === 'fullwidth' && (
                            <>
                                {commonHeader}
                                <div className="space-y-8 mt-8">
                                    {data.contentBlocks?.map((block, idx) => (
                                        <DraggableBlock key={block.id} block={block} index={idx} moveBlock={moveBlock}>
                                            <div className="space-y-4">
                                                {(block.type === 'image' || block.type === 'image-caption') && (
                                                    <div className="-mx-8 md:-mx-12">
                                                        {block.image ? (
                                                            <img src={block.image} alt="" className="w-full h-[500px] object-cover shadow-sm" />
                                                        ) : (
                                                            <div className="w-full h-[300px] bg-gray-100 flex items-center justify-center border-y-2 border-dashed border-gray-200">
                                                                <ImageIcon className="w-10 h-10 text-gray-300" />
                                                            </div>
                                                        )}
                                                        {block.caption && (
                                                            <p className="text-sm text-center text-gray-500 italic mt-4 break-words">{block.caption}</p>
                                                        )}
                                                    </div>
                                                )}

                                                {(block.type === 'text' || block.type === 'image-caption') && (
                                                    <div
                                                        className={cn(
                                                            "prose max-w-none text-gray-700 leading-relaxed break-words [&_ul]:list-disc [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6 [&_li]:mb-1 [&_p[style*='text-align: center']]:text-center [&_p[style*='text-align: right']]:text-right [&_p[style*='text-align: justify']]:text-justify [&_div[style*='text-align: center']]:text-center [&_div[style*='text-align: right']]:text-right [&_div[style*='text-align: justify']]:text-justify",
                                                            idx === 0 && "drop-cap"
                                                        )}
                                                        dangerouslySetInnerHTML={{ __html: block.content || (block.type === 'text' ? 'Content section...' : 'Content after image...') }}
                                                    />
                                                )}
                                            </div>
                                        </DraggableBlock>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <style jsx>{`
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 6px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: #e5e7eb;
                        border-radius: 10px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: #d1d5db;
                    }
                `}</style>
            </div>
        </DndProvider>
    );
}
