"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArticleResource } from "@/lib/api-v2";
import { calculateReadTime } from "@/lib/utils";
import LandingBlockHeader from "./LandingBlockHeader";
import ShareButtons from "@/components/shared/ShareButtons";

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
                            href={article.slug ? `/article/${article.slug}` : `/article/${article.id}`}
                            className="group cursor-pointer flex flex-col relative transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] min-w-[85vw] sm:min-w-0 snap-center"
                        >
                            <div className="aspect-video overflow-hidden mb-3 relative rounded-sm">
                                <Image
                                    src={article.image_url || article.image || 'https://placehold.co/800x450?text=No+Image'}
                                    alt={article.title}
                                    fill
                                    unoptimized={true}
                                    className="object-cover transition-all duration-500 group-hover:scale-110"
                                    style={{ objectPosition: `${article?.image_position_x ?? 50}% ${article?.image_position ?? 0}%` }}
                                />
                                {/* Tags at bottom left of image */}
                                <div className="absolute bottom-2 left-2 flex gap-1 z-10 transition-opacity group-hover:opacity-100">
                                    <div className="bg-[#cc0000] text-white text-[9px] font-black uppercase px-2 py-0.5 tracking-tighter shadow-lg">
                                        {article.category}
                                    </div>
                                    <div className="bg-white dark:bg-[#111827] text-[#1a1a1a] dark:text-white text-[8px] font-black uppercase px-2 py-0.5 tracking-tighter border border-gray-100 dark:border-gray-800 shadow-lg transition-colors">
                                        {article.country || "Global"}
                                    </div>
                                </div>
                                {/* Share Icons - On Image Bottom Right */}
                                <div className="absolute bottom-2 right-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity z-20">
                                    <ShareButtons
                                        url={article.slug ? `/article/${article.slug}` : `/article/${article.id}`}
                                        title={article.title}
                                        description={article.summary || article.content}
                                        size="xs"
                                    />
                                </div>
                            </div>
                            <h3 className="text-sm font-black uppercase leading-tight text-gray-900 dark:text-white group-hover:text-[#cc0000] dark:group-hover:text-[#cc0000] transition-colors line-clamp-2 mb-2">
                                {article.title}
                            </h3>
                            <div className="flex items-center space-x-2 text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-auto">
                                <span>By {article.source || "HomesPh News"}</span>
                                <span>•</span>
                                <span suppressHydrationWarning>{article.created_at ? new Date(article.created_at).toLocaleDateString() : 'Recently'}</span>
                                <span>•</span>
                                <span suppressHydrationWarning>{calculateReadTime(article.content || article.summary)}</span>
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
                        href={main.slug ? `/article/${main.slug}` : `/article/${main.id}`}
                        className="group cursor-pointer flex flex-col relative"
                    >
                        <div className="aspect-[4/3] overflow-hidden mb-4 relative rounded-sm">
                            <Image
                                src={main.image_url || main.image || 'https://placehold.co/800x600?text=No+Image'}
                                alt={main.title}
                                fill
                                unoptimized={true}
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                style={{ objectPosition: `${main?.image_position_x ?? 50}% ${main?.image_position ?? 0}%` }}
                            />
                            {/* Tags at bottom left of image */}
                            <div className="absolute bottom-3 left-3 flex gap-1 z-10">
                                <div className="bg-[#cc0000] text-white text-[10px] font-black uppercase px-2 py-1 tracking-tighter shadow-lg">
                                    {main.category}
                                </div>
                                <div className="bg-white dark:bg-[#111827] text-[#1a1a1a] dark:text-white text-[9px] font-black uppercase px-2 py-0.5 tracking-tighter border border-gray-100 dark:border-gray-800 shadow-lg transition-colors">
                                    {main.country || "Global"}
                                </div>
                            </div>
                            {/* Share Icons Bottom Right */}
                            <div className="absolute bottom-3 right-3 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity z-20">
                                <ShareButtons
                                    url={main.slug ? `/article/${main.slug}` : `/article/${main.id}`}
                                    title={main.title}
                                    description={main.summary || main.content}
                                    size="sm"
                                />
                            </div>
                        </div>
                        <h3 className="text-xl font-black uppercase leading-tight text-gray-900 dark:text-white group-hover:text-[#cc0000] dark:group-hover:text-[#cc0000] transition-colors mb-3">
                            {main.title}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-xs font-medium leading-relaxed line-clamp-2 mb-4">
                            {main.content}
                        </p>
                        <div className="flex items-center space-x-2 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                            <span>By {main.source || "HomesPh News"}</span>
                            <span>•</span>
                            <span suppressHydrationWarning>{main.created_at ? new Date(main.created_at).toLocaleDateString() : 'Recently'}</span>
                            <span>•</span>
                            <span suppressHydrationWarning>{calculateReadTime(main.summary || main.content)}</span>
                        </div>
                    </Link>

                    {/* Right: List of 4 Posts */}
                    <div className="flex flex-col space-y-4">
                        {sidePosts.map((article) => (
                            <Link
                                key={article.id}
                                href={article.slug ? `/article/${article.slug}` : `/article/${article.id}`}
                                className="group cursor-pointer flex gap-4 border-b border-gray-300 dark:border-gray-700 pb-4 last:border-0 last:pb-0"
                            >
                                <div className="w-24 h-24 shrink-0 overflow-hidden relative rounded-sm">
                                    <Image
                                        src={article.image_url || article.image || 'https://placehold.co/200x200?text=No+Image'}
                                        alt={article.title}
                                        fill
                                        unoptimized={true}
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        style={{ objectPosition: `${article?.image_position_x ?? 50}% ${article?.image_position ?? 0}%` }}
                                    />
                                    {/* Small tags for side posts at bottom left */}
                                    <div className="absolute bottom-1 left-1 flex gap-0.5 z-10 scale-90 origin-bottom-left">
                                        <div className="bg-[#cc0000] text-white text-[8px] font-black uppercase px-1 py-0.5 tracking-tighter shadow-lg">
                                            {article.category}
                                        </div>
                                        <div className="bg-white dark:bg-[#111827] text-[#1a1a1a] dark:text-white text-[8px] font-black uppercase px-1 py-0.5 tracking-tighter border border-gray-100 dark:border-gray-800 shadow-lg transition-colors">
                                            {article.country || "Global"}
                                        </div>
                                    </div>
                                    {/* Share Icons Bottom Right */}
                                    <div className="absolute bottom-1 right-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity z-20 scale-75 origin-bottom-right">
                                        <ShareButtons
                                            url={article.slug ? `/article/${article.slug}` : `/article/${article.id}`}
                                            title={article.title}
                                            size="xs"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col justify-center">
                                    <h4 className="text-xs font-black uppercase leading-tight text-gray-900 dark:text-white group-hover:text-[#cc0000] dark:group-hover:text-[#cc0000] transition-colors line-clamp-2 mb-2">
                                        {article.title}
                                    </h4>
                                    <div className="flex items-center space-x-2 text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
                                        <span suppressHydrationWarning>{article.created_at ? new Date(article.created_at).toLocaleDateString() : 'Recently'}</span>
                                        <span>•</span>
                                        <span suppressHydrationWarning>{article.views_count} views</span>
                                        <span>•</span>
                                        <span suppressHydrationWarning>{calculateReadTime(article.summary || article.content)}</span>
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
                        href={article.slug ? `/article/${article.slug}` : `/article/${article.id}`}
                        className="group cursor-pointer flex flex-col border-b border-gray-300 dark:border-gray-700 pb-6 md:border-0 md:pb-0 relative"
                    >
                        <div className="aspect-[16/10] overflow-hidden mb-4 relative rounded-sm">
                            <Image
                                src={article.image_url || article.image || 'https://placehold.co/800x500?text=No+Image'}
                                alt={article.title}
                                fill
                                unoptimized={true}
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                style={{ objectPosition: `${article?.image_position_x ?? 50}% ${article?.image_position ?? 0}%` }}
                            />
                            {/* Tags at bottom left of image */}
                            <div className="absolute bottom-2 left-2 flex gap-1 z-10">
                                <div className="bg-[#cc0000] text-white text-[10px] font-black uppercase px-2 py-1 tracking-tighter shadow-lg">
                                    {article.category}
                                </div>
                                <div className="bg-white dark:bg-[#111827] text-[#1a1a1a] dark:text-white text-[9px] font-black uppercase px-2 py-0.5 tracking-tighter border border-gray-100 dark:border-gray-800 shadow-lg transition-colors">
                                    {article.country || "Global"}
                                </div>
                            </div>
                            {/* Share Icons Bottom Right */}
                            <div className="absolute bottom-2 right-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity z-20">
                                <ShareButtons
                                    url={article.slug ? `/article/${article.slug}` : `/article/${article.id}`}
                                    title={article.title}
                                    description={article.summary || article.content}
                                    size="xs"
                                />
                            </div>
                        </div>
                        <h3 className="text-base font-black uppercase leading-tight text-gray-900 dark:text-white group-hover:text-[#cc0000] dark:group-hover:text-[#cc0000] transition-colors mb-2">
                            {article.title}
                        </h3>
                        <div className="flex items-center space-x-3 text-[9px] font-bold text-gray-400 uppercase tracking-tighter mt-auto">
                            <span suppressHydrationWarning>{article.created_at ? new Date(article.created_at).toLocaleDateString() : 'Recently'}</span>
                            <span>•</span>
                            <span>By {article.source || "HomesPh News"}</span>
                            <span>•</span>
                            <span suppressHydrationWarning>{calculateReadTime(article.summary || article.content)}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
