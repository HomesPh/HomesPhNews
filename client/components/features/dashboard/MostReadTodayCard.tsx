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
    <div className={cn("space-y-6", className)}>
      <div className="bg-[#cc0000] px-4 py-1 mb-6">
        <h3 className="text-white text-xs font-black uppercase tracking-widest">{title}</h3>
      </div>

      <div className="space-y-6">
        {items.map((article, index) => (
          <Link
            key={article.id}
            href={`/article?id=${article.id}`}
            className="flex gap-4 group cursor-pointer"
          >
            <div className="relative shrink-0 w-16 h-16 bg-gray-100 flex items-center justify-center overflow-hidden rounded-sm">
              <span className="absolute inset-0 flex items-center justify-center text-4xl font-black text-black/10 z-0">
                {index + 1}
              </span>
              <Image
                src={article.imageUrl || 'https://placehold.co/800x450?text=No+Image'}
                alt={article.title}
                fill
                className="object-cover relative z-10 group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h4 className="text-[11px] font-black uppercase leading-tight group-hover:text-[#cc0000] transition-colors line-clamp-2 mb-1.5 tracking-tight">
                {article.title}
              </h4>
              <div className="flex items-center space-x-2 text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
                <span>{article.timeAgo || 'Recently'}</span>
                <span>•</span>
                <span>{article.views.toLocaleString()} views</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
