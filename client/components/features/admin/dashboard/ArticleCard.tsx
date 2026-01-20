import { Calendar } from 'lucide-react';
import Image from 'next/image';

interface ArticleCardProps {
    image: string;
    category: string;
    location: string;
    title: string;
    date: string;
    views: string;
}

/**
 * ArticleCard component for displaying individual articles in the dashboard
 */
export default function ArticleCard({
    image,
    category,
    location,
    title,
    date,
    views
}: ArticleCardProps) {
    return (
        <div className="bg-white rounded-[8px] border border-[#f3f4f6] p-4 hover:shadow-md transition-shadow">
            <div className="flex gap-4">
                {/* Article Image Container */}
                <div className="relative w-[80px] h-[80px] flex-shrink-0">
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className="rounded-[8px] object-cover"
                    />
                </div>

                {/* Article Content */}
                <div className="flex-1 flex flex-col justify-between">
                    {/* Category and Location */}
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 bg-white border border-[#e5e7eb] rounded-[4px] text-[12px] font-semibold text-[#111827] tracking-[-0.5px]">
                            {category}
                        </span>
                        <span className="text-[14px] text-[#111827]">|</span>
                        <span className="text-[12px] font-semibold text-[#111827] tracking-[-0.5px]">
                            {location}
                        </span>
                    </div>

                    {/* Article Title */}
                    <h3 className="text-[15px] font-bold text-[#111827] leading-[28px] tracking-[-0.5px] mb-2">
                        {title}
                    </h3>

                    {/* Article Metadata */}
                    <div className="flex items-center gap-2 text-[14px] text-[#6b7280] tracking-[-0.5px]">
                        <Calendar className="w-[12px] h-[13.333px]" />
                        <span>{date}</span>
                        <span>•</span>
                        <span>{views}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
