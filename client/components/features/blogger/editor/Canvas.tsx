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
    blocks: Block[];
    details: BlogDetails;
    activeBlockId: string | null;
    onSelectBlock: (id: string | null) => void;
    onUpdateBlock: (id: string, content: any) => void;
    onRemoveBlock: (id: string) => void;
    onMoveBlock: (id: string, direction: 'up' | 'down') => void;
    onReorder: (dragIndex: number, hoverIndex: number) => void;
    onUpdateDetails: (updates: Partial<BlogDetails>) => void;
    onAddBlockAt: (index: number, type: BlockType) => void;
    onUpdateBlockSettings: (id: string, settings: any) => void;
    zoom: number;
    viewMode: 'desktop' | 'tablet' | 'mobile';
}

export default function Canvas({
    blocks,
    details,
    activeBlockId,
    onSelectBlock,
    onUpdateBlock,
    onRemoveBlock,
    onMoveBlock,
    onReorder,
    onUpdateDetails,
    onAddBlockAt,
    onUpdateBlockSettings,
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

    return (
        <div
            ref={(node) => { drop(node); }}
            style={{
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'top center',
            }}
            className={cn(
                "w-full bg-white min-h-[1200px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-sm p-[80px] pt-[60px] pb-[150px] flex flex-col relative transition-all duration-300 pointer-events-auto h-fit",
                getContainerWidth()
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
                className="font-bold text-[42px] md:text-[48px] text-[#111827] tracking-tight leading-[1.1] mb-4"
                value={details.title}
                onChange={(val) => onUpdateDetails({ title: val })}
                placeholder="From Manila to Mackay: How Nigerians Keep Their Culture Alive Down Under"
            />

            {/* 3. Fixed Summary Section - Matching Production Typography */}
            <AutoResizeTextarea
                className="font-normal text-[20px] text-[#4b5563] tracking-[-0.5px] leading-[1.2] mb-6"
                value={details.summary}
                onChange={(val) => onUpdateDetails({ summary: val })}
                placeholder="The community in Mackay, Australia, maintains strong cultural connections despite geographic distance..."
            />

            {/* 4. High-Fidelity Meta Bar - Matching Production Style (Border Top & Bottom) */}
            <div className="flex flex-col md:flex-row md:items-center justify-between border-y border-[#e5e7eb] py-[20px] gap-4">
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
                    <button className="size-[18px] text-[#155DFC] hover:opacity-80 transition-opacity"><Facebook className="w-full h-full" /></button>
                    <button className="size-[18px] text-[#1447E6] hover:opacity-80 transition-opacity"><Linkedin className="w-full h-full" /></button>
                    <button className="size-[18px] text-[#4A5565] hover:opacity-80 transition-opacity"><Share2 className="w-full h-full" /></button>
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
                                className="absolute w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#C10007] hover:border-[#C10007] cursor-pointer shadow-sm transition-all hover:scale-110"
                                title="Add text block here"
                            >
                                <span className="text-lg font-light leading-none">+</span>
                            </button>
                        </div>

                        <BlockRenderer
                            index={index}
                            block={block}
                            isActive={activeBlockId === block.id}
                            onSelect={() => onSelectBlock(block.id)}
                            onUpdate={onUpdateBlock}
                            onRemove={onRemoveBlock}
                            onMove={onMoveBlock}
                            onReorder={onReorder}
                            onUpdateSettings={onUpdateBlockSettings}
                        />

                        {/* Bottom Block Separator (Add Below) */}
                        <div className="h-4 w-full flex items-center justify-center opacity-0 group-hover/block-wrapper:opacity-100 transition-opacity z-10 hover:z-20 absolute -bottom-2 left-0 right-0">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onAddBlockAt(index + 1, 'text');
                                }}
                                className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#C10007] hover:border-[#C10007] cursor-pointer shadow-sm transition-all hover:scale-110 z-30"
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
