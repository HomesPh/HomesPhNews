"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArticleResource } from "@/lib/api-new/types";
import LandingBlockHeader from "./LandingBlockHeader";

interface LandingNewsBlockProps {
    title: string;
    articles: ArticleResource[];
    variant?: 1 | 2 | 3;
}

export default function LandingNewsBlock({ title, articles, variant = 1 }: LandingNewsBlockProps) {
    if (!articles.length) return null;

    if (variant === 1) {
        return (
            <div className="mb-12">
                <LandingBlockHeader title={title} />
                <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 sm:overflow-visible sm:pb-0 scrollbar-hide">
                    {articles.slice(0, 6).map((article) => (
                        <Link
                            key={article.id}
                            href={`/article?id=${article.id}`}
                            className="group cursor-pointer flex flex-col relative transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] min-w-[85vw] sm:min-w-0 snap-center"
                        >
                            <div className="aspect-video overflow-hidden mb-3 relative rounded-sm">
                                <Image
                                    src={article.image || 'https://placehold.co/800x450?text=No+Image'}
                                    alt={article.title}
                                    fill
                                    className="object-cover transition-all duration-500 group-hover:scale-110"
                                />
                                {/* Tags at bottom right of image */}
                                <div className="absolute bottom-2 right-2 flex gap-1 z-10">
                                    <div className="bg-[#cc0000] text-white text-[9px] font-black uppercase px-2 py-0.5 tracking-tighter shadow-lg">
                                        {article.category}
                                    </div>
                                    <div className="bg-white text-[#1a1a1a] text-[8px] font-black uppercase px-2 py-0.5 tracking-tighter border border-gray-100 shadow-lg">
                                        {article.country || "Global"}
                                    </div>
                                </div>
                            </div>
                            <h3 className="text-sm font-black uppercase leading-tight group-hover:text-[#cc0000] transition-colors line-clamp-2 mb-2">
                                {article.title}
                            </h3>
                            <div className="flex items-center space-x-2 text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-auto">
                                <span>By {article.source || "HomesPh News"}</span>
                                <span>•</span>
                                <span>{article.created_at ? new Date(article.created_at).toLocaleDateString() : 'Recently'}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        );
    }

    if (variant === 2) {
        const main = articles[0];
        const sidePosts = articles.slice(1, 5);
        return (
            <div className="mb-12">
                <LandingBlockHeader title={title} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left: Large Post */}
                    <Link
                        href={`/article?id=${main.id}`}
                        className="group cursor-pointer flex flex-col relative"
                    >
                        <div className="aspect-[4/3] overflow-hidden mb-4 relative rounded-sm">
                            <Image
                                src={main.image || 'https://placehold.co/800x600?text=No+Image'}
                                alt={main.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            {/* Tags at bottom right of image */}
                            <div className="absolute bottom-3 right-3 flex gap-1 z-10">
                                <div className="bg-[#cc0000] text-white text-[10px] font-black uppercase px-2 py-1 tracking-tighter shadow-lg">
                                    {main.category}
                                </div>
                                <div className="bg-white text-[#1a1a1a] text-[9px] font-black uppercase px-2 py-0.5 tracking-tighter border border-gray-100 shadow-lg">
                                    {main.country || "Global"}
                                </div>
                            </div>
                        </div>
                        <h3 className="text-xl font-black uppercase leading-tight group-hover:text-[#cc0000] transition-colors mb-3">
                            {main.title}
                        </h3>
                        <p className="text-gray-500 text-xs font-medium leading-relaxed line-clamp-2 mb-4">
                            {main.content}
                        </p>
                        <div className="flex items-center space-x-2 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                            <span>By {main.source || "HomesPh News"}</span>
                            <span>•</span>
                            <span>{main.created_at ? new Date(main.created_at).toLocaleDateString() : 'Recently'}</span>
                        </div>
                    </Link>

                    {/* Right: List of 4 Posts */}
                    <div className="flex flex-col space-y-4">
                        {sidePosts.map((article) => (
                            <Link
                                key={article.id}
                                href={`/article?id=${article.id}`}
                                className="group cursor-pointer flex gap-4 border-b border-gray-300 dark:border-gray-700 pb-4 last:border-0 last:pb-0"
                            >
                                <div className="w-24 h-24 shrink-0 overflow-hidden relative rounded-sm">
                                    <Image
                                        src={article.image || 'https://placehold.co/200x200?text=No+Image'}
                                        alt={article.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    {/* Small tags for side posts */}
                                    <div className="absolute bottom-1 right-1 flex gap-0.5 z-10 scale-90 origin-bottom-right">
                                        <div className="bg-[#cc0000] text-white text-[8px] font-black uppercase px-1 py-0.5 tracking-tighter shadow-lg">
                                            {article.category}
                                        </div>
                                        <div className="bg-white text-[#1a1a1a] text-[8px] font-black uppercase px-1 py-0.5 tracking-tighter border border-gray-100 shadow-lg">
                                            {article.country || "Global"}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-center">
                                    <h4 className="text-xs font-black uppercase leading-tight group-hover:text-[#cc0000] transition-colors line-clamp-2 mb-2">
                                        {article.title}
                                    </h4>
                                    <div className="flex items-center space-x-2 text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
                                        <span>{article.created_at ? new Date(article.created_at).toLocaleDateString() : 'Recently'}</span>
                                        <span>•</span>
                                        <span>{article.views_count} views</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Variant 3
    return (
        <div className="mb-12">
            <LandingBlockHeader title={title} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {articles.slice(0, 4).map((article) => (
                    <Link
                        key={article.id}
                        href={`/article?id=${article.id}`}
                        className="group cursor-pointer flex flex-col border-b border-gray-300 dark:border-gray-700 pb-6 md:border-0 md:pb-0 relative"
                    >
                        <div className="aspect-[16/10] overflow-hidden mb-4 relative rounded-sm">
                            <Image
                                src={article.image || 'https://placehold.co/800x500?text=No+Image'}
                                alt={article.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            {/* Tags at bottom right of image */}
                            <div className="absolute bottom-2 right-2 flex gap-1 z-10">
                                <div className="bg-[#cc0000] text-white text-[10px] font-black uppercase px-2 py-1 tracking-tighter shadow-lg">
                                    {article.category}
                                </div>
                                <div className="bg-white text-[#1a1a1a] text-[9px] font-black uppercase px-2 py-0.5 tracking-tighter border border-gray-100 shadow-lg">
                                    {article.country || "Global"}
                                </div>
                            </div>
                        </div>
                        <h3 className="text-base font-black uppercase leading-tight text-gray-900 dark:text-white group-hover:text-[#cc0000] dark:group-hover:text-[#cc0000] transition-colors mb-2">
                            {article.title}
                        </h3>
                        <div className="flex items-center space-x-3 text-[9px] font-bold text-gray-400 uppercase tracking-tighter mt-auto">
                            <span>{article.created_at ? new Date(article.created_at).toLocaleDateString() : 'Recently'}</span>
                            <span>•</span>
                            <span>By {article.source || "HomesPh News"}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
