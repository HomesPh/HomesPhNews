"use client";

import { useState } from "react";
import {
    X, Monitor, Tablet, Smartphone, Download,
    Calendar, Eye, Share2, Facebook, Linkedin,
    Maximize2 as Maximize
} from "lucide-react";
import { cn, formatParagraphs } from "@/lib/utils";
import { Block, BlogDetails } from "@/hooks/useBlockEditor";

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

interface BlogPreviewModalProps {
    blocks: Block[];
    details: BlogDetails;
    onClose: () => void;
}

export default function BlogPreviewModal({ blocks, details, onClose }: BlogPreviewModalProps) {
    const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

    const renderBlogContent = () => {
        const isActualMobile = viewMode === 'mobile';
        const isActualTablet = viewMode === 'tablet';

        return (
            <div className="flex flex-col">
                {/* 1. Category | Location Bar - Matching Production */}
                <div className="flex gap-[16px] items-center mb-4">
                    <div className="bg-white border border-[#e5e7eb] px-[10px] py-[6px] rounded-[6px] font-semibold text-[14px] text-black tracking-[-0.5px]">
                        {details.category || "Community"}
                    </div>
                    <p className="font-normal text-[14px] text-black tracking-[-0.5px] leading-[20px]">|</p>
                    <div className="font-semibold text-[14px] text-black tracking-[-0.5px]">
                        {(details.country || "PHILIPPINES").toUpperCase()}
                    </div>
                </div>

                {/* 2. Title Section - Matching Production Typography */}
                <h1 className={cn(
                    "font-bold text-[#111827] tracking-tight leading-[1.1] mb-8 whitespace-pre-wrap",
                    isActualMobile ? "text-[32px]" : "text-[36px] md:text-[42px] lg:text-[48px]"
                )}>
                    {details.title}
                </h1>

                {/* 3. Summary Section - Matching Production Typography */}
                <p className={cn(
                    "font-normal text-[#4b5563] tracking-[-0.5px] leading-[1.2] mb-8 whitespace-pre-wrap",
                    isActualMobile ? "text-[18px]" : "text-[20px]"
                )}>
                    {details.summary}
                </p>

                {/* 4. High-Fidelity Meta Bar - Matching Production Style */}
                <div className={cn(
                    "flex border-y border-[#e5e7eb] py-[20px] gap-4 mb-6",
                    isActualMobile ? "flex-col items-start" : "flex-row items-center justify-between"
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

                    {/* Social Share Group - Hidden on Mobile Preview if space restricted, but matching desktop */}
                    <div className="flex items-center gap-4">
                        <WhatsAppIcon className="size-[18px] text-[#25D366]" />
                        <FacebookIcon className="size-[18px] text-[#1877F2]" />
                        <LinkedinIcon className="size-[18px] text-[#0077B5]" />
                        <ShareIcon className="size-[18px] text-[#4A5565]" />
                    </div>
                </div>

                {/* Content Blocks */}
                <div className="space-y-8">
                    {blocks.map((block) => {
                        const style = block.settings ? {
                            textAlign: block.settings.textAlign || 'left',
                            fontSize: block.settings.fontSize || '18px',
                            fontWeight: block.settings.fontWeight || '400',
                            fontStyle: block.settings.isItalic ? 'italic' : 'normal',
                            textDecoration: block.settings.isUnderline ? 'underline' : 'none',
                            color: block.settings.color || 'inherit',
                            fontFamily: block.settings.fontFamily || 'inherit',
                        } : {};

                        const getObjectPosition = () => {
                            if (block.settings?.imagePosition) {
                                return `${block.settings.imagePosition.x}% ${block.settings.imagePosition.y}%`;
                            }
                            return 'center top';
                        };

                        const imageStyle = {
                            objectPosition: getObjectPosition()
                        };

                        switch (block.type) {
                            case 'text':
                                return (
                                    <div
                                        key={block.id}
                                        style={{
                                            ...style,
                                            fontSize: isActualMobile ? (parseFloat((style.fontSize as string) || '18px') * 0.9 + 'px') : style.fontSize
                                        }}
                                        className="leading-relaxed break-words whitespace-pre-wrap [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:min-h-[1.5em]"
                                        dangerouslySetInnerHTML={{ __html: formatParagraphs(block.content.text) }}
                                    />
                                );
                            case 'image':
                            case 'centered-image':
                                return (
                                    <div key={block.id} className={cn("space-y-3", block.type === 'centered-image' && (isActualMobile ? "max-w-full mx-auto" : "max-w-[800px] mx-auto text-center"))}>
                                        <div className="rounded-2xl overflow-hidden shadow-lg bg-gray-50 flex justify-center">
                                            <img
                                                src={block.content.src || "https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?w=1200"}
                                                className="w-full max-h-[600px] object-cover"
                                                style={imageStyle}
                                            />
                                        </div>
                                        {block.content.caption && <p className="text-xs text-gray-400 italic">{block.content.caption}</p>}
                                    </div>
                                );
                            case 'left-image':
                            case 'right-image':
                                const isLeft = block.type === 'left-image';
                                return (
                                    <div key={block.id} className={cn(
                                        "flex gap-8 items-start",
                                        isActualMobile ? "flex-col" : "flex-row",
                                        (!isLeft && !isActualMobile) && "flex-row-reverse"
                                    )}>
                                        <div className={cn("w-full shrink-0 rounded-xl shadow-md overflow-hidden", !isActualMobile && "md:w-[300px]")}>
                                            <img
                                                src={block.content.image || "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600"}
                                                className="w-full h-full aspect-square object-cover"
                                                style={imageStyle}
                                            />
                                        </div>
                                        <div
                                            style={{
                                                ...style,
                                                fontSize: isActualMobile ? (parseFloat((style.fontSize as string) || '18px') * 0.9 + 'px') : style.fontSize
                                            }}
                                            className="flex-1 min-w-0 leading-relaxed break-words whitespace-pre-wrap [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:min-h-[1.5em]"
                                            dangerouslySetInnerHTML={{ __html: formatParagraphs(block.content.text) }}
                                        />
                                    </div>
                                );
                            case 'grid':
                                const images = block.content.images || ["", ""];
                                const imagePositions = block.content.imagePositions || {};

                                const gridClass = isActualMobile ? 'grid-cols-1' : (
                                    images.length === 1 ? 'grid-cols-1' :
                                        images.length === 2 ? 'grid-cols-2' :
                                            images.length === 3 ? 'grid-cols-3' : 'grid-cols-2'
                                );

                                return (
                                    <div key={block.id} className={cn("grid gap-4", gridClass)}>
                                        {images.map((img: string, i: number) => {
                                            const pos = imagePositions[i];
                                            const gridImageStyle = pos ? { objectPosition: `${pos.x}% ${pos.y}%` } : { objectPosition: 'center' };

                                            return (
                                                <div key={i} className="aspect-square rounded-xl shadow-sm overflow-hidden bg-gray-50">
                                                    <img
                                                        src={img || `https://images.unsplash.com/photo-${1500000000000 + i * 100000}?w=600`}
                                                        className="w-full h-full object-cover"
                                                        style={gridImageStyle}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            default:
                                return null;
                        }
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-in fade-in duration-300">
            {/* Preview Header */}
            <div className="h-[72px] bg-white border-b border-gray-100 px-8 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1428AE]/5 flex items-center justify-center">
                        <Maximize className="w-5 h-5 text-[#1428AE]" />
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">Live Preview</h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Article Verification</p>
                    </div>
                </div>

                {/* Device Switcher */}
                <div className="flex items-center gap-2 p-1.5 bg-gray-50 rounded-2xl border border-gray-100">
                    <button
                        onClick={() => setViewMode('desktop')}
                        className={cn("p-2 rounded-xl transition-all", viewMode === 'desktop' ? "bg-white text-[#1428AE] shadow-sm" : "text-gray-400 hover:text-gray-600")}
                    >
                        <Monitor className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setViewMode('tablet')}
                        className={cn("p-2 rounded-xl transition-all", viewMode === 'tablet' ? "bg-white text-[#1428AE] shadow-sm" : "text-gray-400 hover:text-gray-600")}
                    >
                        <Tablet className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setViewMode('mobile')}
                        className={cn("p-2 rounded-xl transition-all", viewMode === 'mobile' ? "bg-white text-[#1428AE] shadow-sm" : "text-gray-400 hover:text-gray-600")}
                    >
                        <Smartphone className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-all"
                    >
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>
            </div>

            {/* Preview Canvas */}
            <div className="flex-1 overflow-y-auto bg-gray-50/50 p-4 md:p-12 flex justify-center custom-scrollbar">
                <div
                    className={cn(
                        "bg-white h-fit shadow-[0_40px_100px_rgba(0,0,0,0.08)] transition-all duration-500 overflow-hidden ring-1 ring-gray-100 mx-auto",
                        viewMode === 'desktop' ? "w-full max-w-[1000px] p-[60px] md:p-[100px] rounded-sm" :
                            viewMode === 'tablet' ? "w-[768px] max-w-full p-[40px] md:p-[60px] rounded-[32px] border-[12px] border-gray-900 scale-[0.85] origin-top" :
                                "w-[375px] max-w-full p-[24px] md:p-[32px] rounded-[48px] border-[12px] border-gray-900"
                    )}
                >
                    {renderBlogContent()}
                </div>
            </div>
        </div>
    );
}
