"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Block, BlogDetails, BlockType } from "@/hooks/useBlockEditor";
import BlockRenderer from "./BlockRenderer";
import { useDrop } from 'react-dnd';
import {
    Calendar, Eye, Share2, Facebook, Linkedin
} from "lucide-react";

// WhatsApp Icon to match Production
const WhatsAppIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-4.821 8.366A10.066 10.066 0 0 1 8.19 21.99l-.213-.113-4.142 1.086 1.106-4.038-.125-.199a9.957 9.957 0 0 1-1.522-5.304c0-5.513 4.486-10 10-10 2.668 0 5.176 1.037 7.058 2.92a9.92 9.92 0 0 1 2.922 7.06c0 5.513-4.486 10-10 10m8.472-18.472A11.916 11.916 0 0 0 12.651 1.25c-6.605 0-11.977 5.372-11.977 11.977a11.905 11.905 0 0 0 1.617 6.007l-1.717 6.273 6.42-1.684a11.902 11.902 0 0 0 5.657 1.427h.005c6.605 0 11.977-5.372 11.977-11.977a11.915 11.915 0 0 0-3.511-8.47" />
    </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
);

const ShareIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92z" />
    </svg>
);

interface AutoResizeTextareaProps {
    value: string;
    onChange: (val: string) => void;
    className?: string;
    placeholder?: string;
    style?: React.CSSProperties;
    rows?: number;
}

const AutoResizeTextarea = ({ value, onChange, className, placeholder, style, rows = 1 }: AutoResizeTextareaProps) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const adjustHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = '0px'; // Force reset to calculate true scrollHeight
            const scrollHeight = textarea.scrollHeight;
            // Use Math.ceil and add a safety margin to prevent vertical scrollbars or clipping
            textarea.style.height = `${Math.ceil(scrollHeight) + 4}px`;
        }
    };

    useEffect(() => {
        // Initial adjustment and adjustment on value change
        adjustHeight();

        // Use ResizeObserver to catch layout changes or scaling events
        if (typeof window !== 'undefined' && 'ResizeObserver' in window) {
            const observer = new ResizeObserver(adjustHeight);
            if (textareaRef.current) observer.observe(textareaRef.current);
            return () => observer.disconnect();
        }
    }, [value]);

    return (
        <textarea
            ref={textareaRef}
            className={cn(
                "w-full bg-transparent border-none focus:ring-0 p-0 resize-none overflow-hidden block",
                className
            )}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onInput={adjustHeight}
            placeholder={placeholder}
            style={{
                ...style,
                minHeight: '1.2em',
                lineHeight: style?.lineHeight || 'inherit',
                boxSizing: 'border-box'
            }}
            rows={rows}
            spellCheck={false}
        />
    );
};

interface CanvasProps {
    // state
    blocks: Block[];
    details: BlogDetails;
    activeBlockId: string | null;
    zoom: number;
    viewMode: 'desktop' | 'tablet' | 'mobile';
    loadingByBlockId?: Record<string, boolean>;

    // callbacks
    onSelectBlock: (id: string | null) => void;
    onUpdateBlock: (id: string, content: any) => void;
    onRemoveBlock: (id: string) => void;
    onMoveBlock: (id: string, direction: 'up' | 'down') => void;
    onReorder: (dragIndex: number, hoverIndex: number) => void;
    onUpdateDetails: (updates: Partial<BlogDetails>) => void;
    onAddBlockAt: (index: number, type: BlockType) => void;
    onUpdateBlockSettings: (id: string, settings: any) => void;
    onGenerate?: (args: { id: string; block: Block; }) => void;
}

export default function Canvas({
    blocks,
    details,
    activeBlockId,
    loadingByBlockId,
    onSelectBlock,
    onUpdateBlock,
    onRemoveBlock,
    onMoveBlock,
    onReorder,
    onUpdateDetails,
    onAddBlockAt,
    onUpdateBlockSettings,
    onGenerate,
    zoom,
    viewMode
}: CanvasProps) {

    const [, drop] = useDrop({
        accept: 'BLOCK',
    });

    // Debug: Log details to verify data flow
    useEffect(() => {
        console.log("Canvas received details:", details);
    }, [details]);

    const getContainerWidth = () => {
        switch (viewMode) {
            case 'mobile': return 'max-w-[375px]';
            case 'tablet': return 'max-w-[768px]';
            default: return 'max-w-[850px]';
        }
    };

    const isActualMobile = viewMode === 'mobile';
    const isActualTablet = viewMode === 'tablet';
    const isDesktop = viewMode === 'desktop';

    return (
        <div
            ref={(node) => { drop(node); }}
            style={{
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'top center',
            }}
            className={cn(
                "w-full bg-white min-h-[1200px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-sm pt-[60px] pb-[150px] flex flex-col relative transition-all duration-300 pointer-events-auto h-fit",
                getContainerWidth(),
                isActualMobile ? "px-[24px]" : isActualTablet ? "px-[40px]" : "px-[24px] sm:px-[40px] md:px-[80px]"
            )}
            onClick={(e) => {
                // Ensure clicks on the canvas (empty area) clear selection
                if (e.target === e.currentTarget) {
                    onSelectBlock(null);
                }
            }}
        >
            {/* 1. Category | Country Bar - Matching Production Style */}
            <div className="flex gap-[16px] items-center mb-4">
                <div className="bg-white border border-[#e5e7eb] px-[10px] py-[6px] rounded-[6px] font-semibold text-[14px] text-black tracking-[-0.5px]">
                    {details.category || "Community"}
                </div>
                <p className="font-normal text-[14px] text-black tracking-[-0.5px] leading-[20px]">|</p>
                <div className="font-semibold text-[14px] text-black tracking-[-0.5px]">
                    {(details.country || "PHILIPPINES").toUpperCase()}
                </div>
            </div>

            {/* 2. Fixed Title Section - Matching Production Typography */}
            <AutoResizeTextarea
                className={cn(
                    "font-bold text-[#111827] tracking-tight leading-[1.1] mb-6",
                    isActualMobile ? "text-[32px]" : "text-[32px] sm:text-[42px] md:text-[48px]"
                )}
                value={details.title}
                onChange={(val) => onUpdateDetails({ title: val })}
                placeholder="From Manila to Mackay: How Nigerians Keep Their Culture Alive Down Under"
            />

            {/* 3. Fixed Summary Section - Matching Production Typography */}
            <AutoResizeTextarea
                className={cn(
                    "font-normal text-[#4b5563] tracking-[-0.5px] leading-[1.2] mb-10",
                    isActualMobile ? "text-[18px]" : "text-[18px] sm:text-[20px]"
                )}
                value={details.summary}
                onChange={(val) => onUpdateDetails({ summary: val })}
                placeholder="The community in Mackay, Australia, maintains strong cultural connections despite geographic distance..."
            />

            {/* 4. High-Fidelity Meta Bar - Matching Production Style (Border Top & Bottom) */}
            <div className={cn(
                "flex border-y border-[#e5e7eb] py-[20px] gap-4",
                isActualMobile ? "flex-col items-start" : "flex-col lg:flex-row items-start lg:items-center justify-between"
            )}>
                <div className="flex flex-wrap items-center gap-y-2 gap-x-[20px] md:gap-x-[34px]">
                    <div className="font-semibold text-[14px] text-[#6b7280] tracking-[-0.5px] leading-[20px]">
                        By {details.author}
                    </div>
                    <div className="flex items-center gap-[9px]">
                        <Calendar className="size-[14px] text-[#6b7280]" />
                        <p className="font-normal text-[14px] text-[#6b7280] tracking-[-0.5px] leading-[20px]">
                            {new Date(details.publishDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                    </div>
                    <div className="flex items-center gap-[9px]">
                        <Eye className="size-[14px] text-[#6b7280]" />
                        <p className="font-normal text-[14px] text-[#6b7280] tracking-[-0.5px] leading-[20px]">
                            {typeof details.views === 'number' ? details.views : 0} views
                        </p>
                    </div>
                </div>

                {/* Social Share Group - Matching Production Colors */}
                <div className="flex items-center gap-4">
                    <button className="size-[18px] text-[#25D366] hover:opacity-80 transition-opacity"><WhatsAppIcon className="w-full h-full" /></button>
                    <button className="size-[18px] text-[#1877F2] hover:opacity-80 transition-opacity"><FacebookIcon className="w-full h-full" /></button>
                    <button className="size-[18px] text-[#0077B5] hover:opacity-80 transition-opacity"><LinkedinIcon className="w-full h-full" /></button>
                    <button className="size-[18px] text-[#4A5565] hover:opacity-80 transition-opacity"><ShareIcon className="w-full h-full" /></button>
                </div>
            </div>

            {/* Content Blocks (Draggable) */}
            <div className="flex-1 flex flex-col">
                {blocks.map((block, index) => (
                    <div key={block.id} className="relative group/block-wrapper">
                        {/* Block Separator */}
                        <div className="h-4 w-full flex items-center justify-center opacity-0 group-hover/block-wrapper:opacity-100 transition-opacity z-10 hover:z-20">
                            <div className="h-[1px] w-full bg-gray-100" />
                            <button
                                onClick={() => onAddBlockAt(index, 'text')}
                                className="absolute w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#1428AE] hover:border-[#1428AE] cursor-pointer shadow-sm transition-all hover:scale-110"
                                title="Add text block here"
                            >
                                <span className="text-lg font-light leading-none">+</span>
                            </button>
                        </div>

                        <BlockRenderer
                            index={index}
                            block={block}
                            isActive={activeBlockId === block.id}
                            viewMode={viewMode}
                            onSelect={() => onSelectBlock(block.id)}
                            onUpdate={onUpdateBlock}
                            onRemove={onRemoveBlock}
                            onMove={onMoveBlock}
                            onReorder={onReorder}
                            onUpdateSettings={onUpdateBlockSettings}
                            onGenerate={onGenerate}
                            isLoading={!!loadingByBlockId?.[block.id]}
                        />

                        {/* Bottom Block Separator (Add Below) */}
                        <div className="h-4 w-full flex items-center justify-center opacity-0 group-hover/block-wrapper:opacity-100 transition-opacity z-10 hover:z-20 absolute -bottom-2 left-0 right-0">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onAddBlockAt(index + 1, 'text');
                                }}
                                className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#1428AE] hover:border-[#1428AE] cursor-pointer shadow-sm transition-all hover:scale-110 z-30"
                                title="Add text block below"
                            >
                                <span className="text-lg font-light leading-none">+</span>
                            </button>
                        </div>
                    </div>
                ))}

                {blocks.length === 0 && (
                    <div className="py-20 border-2 border-dashed border-gray-100 rounded-3xl flex flex-col items-center justify-center text-gray-300 bg-gray-50/50">
                        <p className="text-xs font-black uppercase tracking-[2px] text-gray-300">Start Writing Below</p>
                        <p className="text-[10px] mt-2 text-gray-200">Drag content blocks from the library</p>
                    </div>
                )}
            </div>
        </div>
    );
}
