"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";
import { decodeHtml, calculateReadTime } from "@/lib/utils";
import ShareButtons from "@/components/shared/ShareButtons";

interface VerticalArticleCardProps {
    id: string;
    slug?: string;
    title: string;
    category: string;
    location?: string;
    imageSrc: string;
    timeAgo: string;
    views: string;
    description?: string;
    content?: string;
    imagePosition?: number;
    imagePositionX?: number;
}

export default function VerticalArticleCard({
    id,
    slug,
    title,
    category,
    location,
    imageSrc,
    timeAgo,
    views,
    description,
    content,
    imagePosition,
    imagePositionX
}: VerticalArticleCardProps) {
    return (
        <Link
            href={slug ? `/article/${slug}` : `/article/${id}`}
            className="group bg-white dark:bg-[#1a1d2e] border border-[#f3f4f6] dark:border-[#2a2d3e] rounded-[12px] overflow-hidden cursor-pointer hover:shadow-md transition-shadow shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex flex-col h-full"
        >
            {/* Image on top */}
            <div className="w-full h-[180px] overflow-hidden relative">
                <Image
                    src={imageSrc}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-300 transform scale-110 group-hover:scale-[1.15]"
                    style={{ objectPosition: `${imagePositionX ?? 50}% ${imagePosition ?? 0}%` }}
                />
                {/* Tags - Bottom Left */}
                <div className="absolute bottom-2 left-2 flex gap-1 z-10">
                    <span className="bg-white dark:bg-[#252836] border border-[#e5e7eb] dark:border-gray-700 px-2 py-0.5 rounded-[4px] font-semibold text-[10px] text-black dark:text-white tracking-[-0.5px] shadow-lg">
                        {category}
                    </span>
                    {location && (
                        <span className="bg-white dark:bg-[#252836] border border-[#e5e7eb] dark:border-gray-700 px-2 py-0.5 rounded-[4px] font-semibold text-[10px] text-black dark:text-white tracking-[-0.5px] shadow-lg">
                            {location.toUpperCase()}
                        </span>
                    )}
                </div>
                {/* Share Icons - Bottom Right */}
                <div className="absolute bottom-2 right-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity z-20">
                    <ShareButtons
                        url={slug ? `/article/${slug}` : `/article/${id}`}
                        title={title}
                        description={description}
                        size="xs"
                    />
                </div>
            </div>

            {/* Content below */}
            <div className="p-[16px] flex flex-col gap-[10px] flex-1">

                <h3 className="font-bold text-[18px] text-[#111827] dark:text-white tracking-[-0.5px] leading-[1.3] line-clamp-2 transition-colors group-hover:text-[#c10007]">
                    {title}
                </h3>

                {description && (
                    <div
                        className="text-[14px] text-[#4b5563] dark:text-gray-400 line-clamp-2 leading-[1.4] tracking-[-0.5px] prose prose-sm max-w-none [&>p]:m-0 [&>p]:inline"
                        dangerouslySetInnerHTML={{ __html: decodeHtml(description) }}
                    />
                )}

                <div className="mt-auto pt-[10px] flex items-center gap-[6px] text-[#6b7280] dark:text-gray-500">
                    <Clock className="size-[12px]" />
                    <p className="font-normal text-[12px] tracking-[-0.5px]">
                        {timeAgo}
                    </p>
                    <p className="font-normal text-[14px] tracking-[-0.5px]">•</p>
                    <p className="font-normal text-[12px] tracking-[-0.5px]">
                        {views}
                    </p>
                    <p className="font-normal text-[14px] tracking-[-0.5px]">•</p>
                    <p className="font-normal text-[12px] tracking-[-0.5px]">
                        {calculateReadTime(content || description)}
                    </p>
                </div>
            </div>
        </Link>
    );
}
