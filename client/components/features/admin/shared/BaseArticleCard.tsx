"use client";

import { useMemo } from 'react';
import { Calendar, Eye, MapPin } from 'lucide-react';
import { cn } from "@/lib/utils";

interface BaseArticleCardProps {
    article: {
        id?: number;
        image: string;
        category: string;
        location: string;
        title: string;
        description?: string;
        date: string;
        views: string;
        status: string;
        sites?: string[];
    };
    variant?: 'compact' | 'list';
    onClick?: () => void;
    className?: string;
}

/**
 * Universal Article Card component exactly matching Create Sign In Page design
 */
export default function BaseArticleCard({
    article,
    variant = 'list',
    onClick,
    className
}: BaseArticleCardProps) {
    const isCompact = variant === 'compact';

    if (isCompact) {
        return (
            <div
                onClick={onClick}
                className={cn(
                    "bg-white rounded-[8px] border border-[#f3f4f6] p-4 hover:shadow-md transition-shadow cursor-pointer",
                    className
                )}
            >
                <div className="flex gap-4">
                    {/* Article Image Container */}
                    <div className="relative w-[80px] h-[80px] flex-shrink-0">
                        <img
                            src={article.image}
                            alt={article.title}
                            className="w-full h-full rounded-[8px] object-cover"
                        />
                    </div>

                    {/* Article Content */}
                    <div className="flex-1 flex flex-col justify-between">
                        {/* Category and Location */}
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-3 py-1 bg-white border border-[#e5e7eb] rounded-[4px] text-[12px] font-semibold text-[#111827] tracking-[-0.5px]">
                                {article.category}
                            </span>
                            <span className="text-[14px] text-[#111827]">|</span>
                            <span className="text-[12px] font-semibold text-[#111827] tracking-[-0.5px]">
                                {article.location}
                            </span>
                        </div>

                        {/* Article Title */}
                        <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-[15px] font-bold text-[#111827] leading-[22px] tracking-[-0.5px] line-clamp-1 group-hover:text-[#C10007] transition-colors">
                                {article.title}
                            </h3>
                        </div>

                        {/* Article Metadata */}
                        <div className="flex items-center gap-2 text-[14px] text-[#6b7280] tracking-[-0.5px]">
                            <Calendar className="w-[12px] h-[13.333px]" />
                            <span>{article.date}</span>
                            <span>•</span>
                            <span>{article.views}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // List Variant - Matching ArticleManagement.tsx list items
    return (
        <div
            onClick={onClick}
            className={cn(
                "flex gap-[13px] p-5 cursor-pointer hover:bg-gray-50 transition-colors bg-white",
                className
            )}
        >
            {/* Thumbnail */}
            <div className="w-[118px] h-[106px] rounded-[8px] overflow-hidden flex-shrink-0">
                <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-between min-h-[106px]">
                {/* Category and Location */}
                <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-white border border-[#e5e7eb] rounded-[4px] text-[12px] font-semibold text-[#111827] tracking-[-0.5px] uppercase">
                        {article.category}
                    </span>
                    <span className="text-[14px] text-[#111827]">|</span>
                    <span className="text-[12px] font-semibold text-[#111827] tracking-[-0.5px] uppercase">
                        {article.location}
                    </span>
                </div>

                {/* Title */}
                <h3 className="text-[18px] font-bold text-[#1f2937] leading-[32px] tracking-[-0.5px] mb-2 line-clamp-1">
                    {article.title}
                </h3>

                {/* Description */}
                <p className="text-[14px] text-[#4b5563] leading-[normal] tracking-[-0.5px] mb-2 line-clamp-1">
                    {article.description}
                </p>

                {/* Date and Views */}
                <div className="flex items-center gap-2 text-[12px] text-[#6b7280] tracking-[-0.5px] mb-2">
                    <Calendar className="w-[11px] h-[12px]" />
                    <span className="leading-[20px]">{article.date}</span>
                    <span className="text-[16px]">•</span>
                    <span className="leading-[20px]">{article.views}</span>
                </div>

                {/* Published On */}
                <div className="flex items-center gap-2">
                    <span className="text-[12px] text-[#6b7280] leading-[20px] tracking-[-0.5px]">Published on:</span>
                    <div className="flex flex-wrap gap-2">
                        {article.sites?.map((site, idx) => (
                            <span
                                key={idx}
                                className="px-[14px] py-1 bg-[#f3f4f6] rounded-[4px] text-[12px] font-medium text-[#374151] tracking-[-0.5px]"
                            >
                                {site}
                            </span>
                        )) || (
                                <span className="text-[12px] italic text-[#9ca3af]">None</span>
                            )}
                    </div>
                </div>
            </div>
        </div>
    );
}
