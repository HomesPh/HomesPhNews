"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface MostReadTodayProps {
    title?: string;
    items?: {
        id: number | string;
        title: string;
        views: number;
        imageUrl: string;
        timeAgo?: string;
    }[];
    className?: string;
}

export default function MostReadTodayCard({ title = "Most Read Today", items = [], className }: MostReadTodayProps) {
    return (
        <div className={cn("bg-white rounded-[12px] border border-[#e5e7eb] p-6 shadow-sm flex flex-col gap-4", className)}>
            <h3 className="text-[18px] font-bold text-[#111827] tracking-[-0.5px]">
                {title}
            </h3>

            <div className="flex flex-col gap-4">
                {items.map((article) => (
                    <Link
                        key={article.id}
                        href={`/article?id=${article.id}`}
                        className="flex gap-3 cursor-pointer group"
                    >
                        {/* Image */}
                        <div className="relative w-[80px] h-[80px] rounded-[8px] overflow-hidden shrink-0">
                            <Image
                                src={article.imageUrl}
                                alt={article.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>

                        {/* Content */}
                        <div className="flex-1 flex flex-col gap-1">
                            <h4 className="line-clamp-2 text-[14px] font-bold leading-tight text-black tracking-[-0.5px] transition-colors group-hover:text-[#c10007]">
                                {article.title}
                            </h4>
                            <p className="text-[12px] font-normal text-[#6b7280] tracking-[-0.5px]">
                                {article.views.toLocaleString()} views
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
