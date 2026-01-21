"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";

interface RelatedArticle {
  id: string;
  title: string;
  category: string;
  location?: string;
  imageSrc: string;
  timeAgo: string;
  views: string;
}

interface RelatedArticlesProps {
  articles: RelatedArticle[];
}

export default function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (!articles || articles.length === 0) return null;

  return (
    <div className="flex flex-col gap-[24px] mt-[40px]">
      <h2 className="font-bold text-[24px] text-[#111827] tracking-[-0.5px] leading-[32px]">
        Related Articles
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[20px]">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/article?id=${article.id}`}
            className="bg-white border border-[#f3f4f6] rounded-[12px] overflow-hidden cursor-pointer hover:shadow-md transition-shadow shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
          >
            {/* Image on top */}
            <div className="w-full h-[160px] overflow-hidden">
              <Image
                src={article.imageSrc}
                alt={article.title}
                width={400}
                height={160}
                className="w-full h-full object-cover hover:scale-105 transition-transform"
              />
            </div>

            {/* Content below */}
            <div className="p-[16px] flex flex-col gap-[10px]">
              <div className="flex gap-[8px] items-center">
                <span className="bg-white border border-[#e5e7eb] px-[8px] py-[3px] rounded-[4px] font-semibold text-[11px] text-black tracking-[-0.5px]">
                  {article.category}
                </span>
                {article.location && (
                  <>
                    <p className="font-normal text-[12px] text-black tracking-[-0.5px]">|</p>
                    <p className="font-semibold text-[11px] text-black tracking-[-0.5px]">
                      {article.location.toUpperCase()}
                    </p>
                  </>
                )}
              </div>

              <h3 className="font-bold text-[16px] text-[#111827] tracking-[-0.5px] leading-[1.3] line-clamp-2">
                {article.title}
              </h3>

              <div className="flex items-center gap-[6px] text-[#6b7280]">
                <Clock className="size-[12px]" />
                <p className="font-normal text-[12px] tracking-[-0.5px]">
                  {article.timeAgo}
                </p>
                <p className="font-normal text-[14px] tracking-[-0.5px]">•</p>
                <p className="font-normal text-[12px] tracking-[-0.5px]">
                  {article.views}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
