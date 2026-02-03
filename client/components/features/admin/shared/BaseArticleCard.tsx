"use client";

import { useMemo } from 'react';
import { Calendar, Eye, MapPin } from 'lucide-react';
import { cn } from "@/lib/utils";
import StatusBadge from "@/components/features/admin/shared/StatusBadge";

interface BaseArticleCardProps {
    article: {
        id?: string;
        image_url?: string;
        image?: string;           // Legacy fallback
        category?: string | null; // Allow null
        country?: string | null;  // Allow null
        location?: string;        // Legacy fallback
        title: string;
        summary?: string;
        description?: string;     // Legacy fallback
        created_at?: string | null;
        date?: string;            // Legacy fallback
        views_count?: number;
        views?: string;           // Legacy fallback
        status: string;
        topics?: string[] | null; // Allow null
        sites?: string[];         // Legacy fallback
        published_sites?: string | string[]; // New API field
    };
    variant?: 'compact' | 'list';
    onClick?: () => void;
    className?: string;
}

// Helper function to format date
const formatDate = (dateStr: string | null | undefined): string => {
    if (!dateStr) return 'Unknown date';
    try {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch {
        return dateStr;
    }
};

// Helper function to format views
const formatViews = (count: number | undefined): string => {
    if (count === undefined || count === null) return '0 views';
    return `${count.toLocaleString()} views`;
};

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

    // Normalize field names (support both new and legacy)
    const imageUrl = article.image_url || article.image || 'https://placehold.co/800x450?text=No+Image';
    const location = article.country || article.location || 'Unknown';
    const description = article.summary || article.description || '';
    const dateStr = article.created_at || article.date || null;
    const viewsStr = article.views ?? formatViews(article.views_count);

    // Handle published_sites which can be string or string[]
    const publishedSites = Array.isArray(article.published_sites)
        ? article.published_sites
        : (article.published_sites ? [article.published_sites] : []);

    const sites = publishedSites.length > 0
        ? publishedSites
        : (article.sites || (article.topics?.slice(0, 3)) || []);

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
                            src={imageUrl}
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
                                {location}
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
                            <span>{formatDate(dateStr)}</span>
                            <span>•</span>
                            <span>{viewsStr}</span>
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
                    src={imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-between min-h-[106px]">
                {/* Category, Location, and Status */}
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-white border border-[#e5e7eb] rounded-[4px] text-[12px] font-semibold text-[#111827] tracking-[-0.5px] uppercase">
                            {article.category}
                        </span>
                        <span className="text-[14px] text-[#111827]">|</span>
                        <span className="text-[12px] font-semibold text-[#111827] tracking-[-0.5px] uppercase">
                            {location}
                        </span>
                    </div>
                    <StatusBadge status={article.status as any} />
                </div>

                {/* Title */}
                <h3 className="text-[18px] font-bold text-[#1f2937] leading-[32px] tracking-[-0.5px] mb-2 line-clamp-1">
                    {article.title}
                </h3>

                {/* Description */}
                <p className="text-[14px] text-[#4b5563] leading-[normal] tracking-[-0.5px] mb-2 line-clamp-1">
                    {description}
                </p>

                {/* Date and Views */}
                <div className="flex items-center gap-2 text-[12px] text-[#6b7280] tracking-[-0.5px] mb-2">
                    <Calendar className="w-[11px] h-[12px]" />
                    <span className="leading-[20px]">{formatDate(dateStr)}</span>
                    <span className="text-[16px]">•</span>
                    <span className="leading-[20px]">{viewsStr}</span>
                </div>
            </div>
        </div>
    );
}
