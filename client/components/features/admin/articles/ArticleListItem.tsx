import { Calendar, Eye, MapPin } from 'lucide-react';
import { Article } from "@/app/admin/articles/data";
import { Badge } from "@/components/ui/badge";
import StatusBadge from "@/components/features/admin/shared/StatusBadge";

interface ArticleListItemProps {
    article: Article;
    onClick?: () => void;
}

/**
 * ArticleListItem component for displaying a single article in the management list
 */
export default function ArticleListItem({ article, onClick }: ArticleListItemProps) {
    return (
        <div
            onClick={onClick}
            className="flex gap-6 p-5 hover:bg-[#f9fafb] transition-colors cursor-pointer border-b border-[#e5e7eb] last:border-0"
        >
            {/* Thumbnail */}
            <div className="w-[140px] h-[106px] rounded-[8px] overflow-hidden flex-shrink-0">
                <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-between min-h-[106px]">
                <div>
                    {/* Category and Location */}
                    <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="bg-white text-[#111827] border-[#e5e7eb] rounded-[4px] px-3 py-0.5 text-[12px] font-semibold tracking-[-0.5px] h-auto">
                            {article.category}
                        </Badge>
                        <span className="text-[#d1d5db]">|</span>
                        <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#374151] tracking-[-0.5px]">
                            <MapPin className="w-3 h-3 text-[#9ca3af]" />
                            {article.location}
                        </div>
                    </div>

                    {/* Title and Status */}
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-[18px] font-bold text-[#111827] leading-[1.3] tracking-[-0.5px] line-clamp-2">
                            {article.title}
                        </h3>
                        <StatusBadge status={article.status} />
                    </div>

                    {/* Description */}
                    <p className="text-[14px] text-[#4b5563] leading-[1.5] tracking-[-0.5px] line-clamp-1 mb-3">
                        {article.description}
                    </p>
                </div>

                <div className="flex items-center justify-between">
                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-[12px] text-[#6b7280] tracking-[-0.5px]">
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{article.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Eye className="w-3.5 h-3.5" />
                            <span>{article.views}</span>
                        </div>
                    </div>

                    {/* Published Sites */}
                    <div className="flex items-center gap-2">
                        <span className="text-[12px] text-[#9ca3af] tracking-[-0.5px]">Published on:</span>
                        {article.sites.map((site, index) => (
                            <span
                                key={index}
                                className="px-2.5 py-0.5 bg-[#f3f4f6] text-[#374151] text-[11px] font-medium rounded-[4px] border border-[#e5e7eb] tracking-[-0.5px]"
                            >
                                {site}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
