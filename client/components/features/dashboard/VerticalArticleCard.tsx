"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";
import { stripHtml } from "@/lib/utils";

interface VerticalArticleCardProps {
    id: string;
    title: string;
    category: string;
    location?: string;
    imageSrc: string;
    timeAgo: string;
    views: string;
    description?: string;
}

export default function VerticalArticleCard({
    id,
    title,
    category,
    location,
    imageSrc,
    timeAgo,
    views,
    description
}: VerticalArticleCardProps) {
    return (
        <Link
            href={`/article?id=${id}`}
            className="group bg-white dark:bg-[#1a1d2e] border border-[#f3f4f6] dark:border-[#2a2d3e] rounded-[12px] overflow-hidden cursor-pointer hover:shadow-md transition-shadow shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex flex-col h-full"
        >
            {/* Image on top */}
            <div className="w-full h-[180px] overflow-hidden relative">
                <Image
                    src={imageSrc}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
            </div>

            {/* Content below */}
            <div className="p-[16px] flex flex-col gap-[10px] flex-1">
                <div className="flex gap-[8px] items-center">
                    <span className="bg-white dark:bg-[#252836] border border-[#e5e7eb] dark:border-gray-700 px-[8px] py-[3px] rounded-[4px] font-semibold text-[11px] text-black dark:text-white tracking-[-0.5px]">
                        {category}
                    </span>
                    {location && (
                        <>
                            <p className="font-normal text-[12px] text-black dark:text-gray-400 tracking-[-0.5px]">|</p>
                            <p className="font-semibold text-[11px] text-black dark:text-white tracking-[-0.5px]">
                                {location.toUpperCase()}
                            </p>
                        </>
                    )}
                </div>

                <h3 className="font-bold text-[18px] text-[#111827] dark:text-white tracking-[-0.5px] leading-[1.3] line-clamp-2 transition-colors group-hover:text-[#c10007]">
                    {title}
                </h3>

                {description && (
                    <p className="text-[14px] text-[#4b5563] dark:text-gray-400 line-clamp-2 leading-[1.4] tracking-[-0.5px]">
                        {stripHtml(description)}
                    </p>
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
                </div>
            </div>
        </Link>
    );
}
