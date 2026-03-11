"use client";

import { useMemo } from 'react';
import { Calendar, Eye, MapPin } from 'lucide-react';
import { cn, sanitizeImageUrl, decodeHtml, calculateReadTime, stripHtml } from "@/lib/utils";
import StatusBadge from "@/components/features/admin/shared/StatusBadge";
import ShareButtons from "@/components/shared/ShareButtons";
import { useAuth } from "@/hooks/useAuth";

interface BaseArticleCardProps {
    article: {
        id?: string;
        slug?: string;
        image_url?: string;
        image?: string;           // Legacy fallback
        category?: string | null; // Allow null
        country?: string | null;  // Allow null
        location?: string;        // Legacy fallback
        title: string;
        summary?: string;
        content?: string;         // New field for read time
        description?: string;     // Legacy fallback
        created_at?: string | null;
        date?: string;            // Legacy fallback
        views_count?: number;
        views?: string;           // Legacy fallback
        status: string;
        is_redis?: boolean;
        topics?: string[] | null; // Allow null
        sites?: string[];         // Legacy fallback
        published_sites?: string | string[]; // New API field
        image_position?: number;
        image_position_x?: number;
        editor_first_name?: string | null;
        editor_last_name?: string | null;
        edited_by?: number;
    };
    variant?: 'compact' | 'list';
    onClick?: () => void;
    actions?: React.ReactNode;
    selection?: {
        isSelected: boolean;
        onSelect: (checked: boolean) => void;
    };
    className?: string;
    hideStatus?: boolean;
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
    className,
    hideStatus = false,
    selection,
    actions,
}: BaseArticleCardProps) {
    const { user } = useAuth();
    const showEditorAttribution = useMemo(() => {
        if (!user) return false;
        return user.roles.includes('admin');
    }, [user]);

    const isCompact = variant === 'compact';

    // Normalize field names (support both new and legacy)
    const imageUrl = sanitizeImageUrl(article.image_url || article.image || 'https://placehold.co/800x450?text=No+Image');
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
                <div className="flex gap-4 items-center">
                    {selection && (
                        <div onClick={(e) => e.stopPropagation()} className="flex-shrink-0">
                            <input
                                type="checkbox"
                                checked={selection.isSelected}
                                onChange={(e) => selection.onSelect(e.target.checked)}
                                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                        </div>
                    )}
                    {/* Article Image Container */}
                    <div className="relative w-[80px] h-[80px] flex-shrink-0">
                        <img
                            src={imageUrl}
                            alt={article.title}
                            className="w-full h-full rounded-[8px] object-cover"
                            style={{ objectPosition: `${article.image_position_x ?? 50}% ${article.image_position ?? 0}%` }}
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
                            <h3 className="text-[15px] font-bold text-[#111827] leading-[22px] tracking-[-0.5px] line-clamp-1 group-hover:text-[#1428AE] transition-colors">
                                {article.title}
                            </h3>
                        </div>

                        {/* Article Metadata */}
                        <div className="flex items-center gap-2 text-[14px] text-[#6b7280] tracking-[-0.5px]">
                            <Calendar className="w-[12px] h-[13.333px]" />
                            <span>{formatDate(dateStr)}</span>
                            <span>•</span>
                            <span>{viewsStr}</span>
                            <span>•</span>
                            <span>{calculateReadTime(article.content || description)}</span>
                        </div>
                    </div>
                    {actions && (
                        <div className="flex-shrink-0 self-center pl-2">
                            {actions}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // List Variant - Matching ArticleManagement.tsx list items
    return (
        <div
            onClick={onClick}
            className={cn(
                "flex flex-col sm:flex-row gap-[13px] sm:gap-[20px] p-4 sm:p-5 cursor-pointer hover:bg-gray-50 transition-colors bg-white",
                className
            )}
        >
            <div className="flex items-center gap-3 sm:hidden mb-2">
                {selection && (
                    <div onClick={(e) => e.stopPropagation()} className="flex-shrink-0">
                        <input
                            type="checkbox"
                            checked={selection.isSelected}
                            onChange={(e) => selection.onSelect(e.target.checked)}
                            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                    </div>
                )}
                <div className="flex items-center gap-1">
                    {!hideStatus && <StatusBadge status={(article.is_redis ? 'being_processed' : article.status) as any} />}
                </div>
            </div>

            <div className="flex gap-[13px] w-full items-start">
                {selection && (
                    <div onClick={(e) => e.stopPropagation()} className="hidden sm:block flex-shrink-0 self-center">
                        <input
                            type="checkbox"
                            checked={selection.isSelected}
                            onChange={(e) => selection.onSelect(e.target.checked)}
                            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                    </div>
                )}
                {/* Thumbnail */}
                <div className="w-[100px] h-[80px] sm:w-[118px] sm:h-[106px] rounded-[8px] overflow-hidden flex-shrink-0">
                    <img
                        src={imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover"
                        style={{ objectPosition: `${article.image_position_x ?? 50}% ${article.image_position ?? 0}%` }}
                    />
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-between min-h-[80px] sm:min-h-[106px]">
                    {/* Category, Location, and Status */}
                    <div className="flex items-center justify-between mb-1 sm:mb-2">
                        <div className="flex items-center gap-2">
                            <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-white border border-[#e5e7eb] rounded-[4px] text-[10px] sm:text-[12px] font-semibold text-[#111827] tracking-[-0.5px] uppercase">
                                {article.category}
                            </span>
                            <span className="text-[12px] sm:text-[14px] text-[#111827]">|</span>
                            <span className="text-[10px] sm:text-[12px] font-semibold text-[#111827] tracking-[-0.5px] uppercase">
                                {location}
                            </span>
                        </div>
                        <div className="hidden sm:flex items-center gap-2">
                            {!hideStatus && <StatusBadge status={(article.is_redis ? 'being_processed' : article.status) as any} />}
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-[15px] sm:text-[18px] font-bold text-[#1f2937] leading-tight sm:leading-[32px] tracking-[-0.5px] mb-1 sm:mb-2 line-clamp-2 sm:line-clamp-1">
                        {article.title}
                    </h3>

                    {/* Description - Hidden on very small screens or clamped further */}
                    <p className="text-[12px] sm:text-[14px] text-[#4b5563] leading-snug sm:leading-[normal] tracking-[-0.5px] mb-1 sm:mb-2 line-clamp-1">
                        {stripHtml(description)}
                    </p>

                    {/* Date and Views */}
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] sm:text-[12px] text-[#6b7280] tracking-[-0.5px]">
                        <div className="flex items-center gap-1">
                            <Calendar className="w-[10px] h-[10px] sm:w-[11px] sm:h-[12px]" />
                            <span className="leading-none sm:leading-[20px]">{formatDate(dateStr)}</span>
                        </div>
                        <span className="hidden sm:inline text-[16px]">•</span>
                        <span className="leading-none sm:leading-[20px]">{viewsStr}</span>
                        <span className="text-[16px]">•</span>
                        <span className="leading-none sm:leading-[20px]">{calculateReadTime(article.content || description)}</span>
                        {article.editor_first_name && showEditorAttribution && (
                            <>
                                <span className="text-[16px] mx-1 font-bold">•</span>
                                <span className="text-[#1428AE] font-semibold whitespace-nowrap">
                                    Edited by {article.editor_first_name} {article.editor_last_name}
                                </span>
                            </>
                        )}
                        {article.status === 'published' && (
                            <div className="flex items-center">
                                <span className="text-[16px] mx-1">•</span>
                                <ShareButtons
                                    url={`/article/${article.slug || article.id}`}
                                    title={article.title}
                                    description={stripHtml(description)}
                                    size="xs"
                                    className="ml-1"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
