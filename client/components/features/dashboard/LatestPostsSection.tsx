"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArticleResource } from "@/lib/api-v2";
import { decodeHtml, calculateReadTime } from '@/lib/utils';
import ShareButtons from "@/components/shared/ShareButtons";

interface LatestPostsSectionProps {
    articles: ArticleResource[];
    title?: string;
    viewAllHref?: string;
}

export default function LatestPostsSection({ articles, title, viewAllHref }: LatestPostsSectionProps) {
    const [visibleCount, setVisibleCount] = useState(3);
    const visibleArticles = articles.slice(0, visibleCount);
    const hasMore = visibleCount < articles.length;

    const handleLoadMore = () => {
        setVisibleCount(prev => Math.min(prev + 10, articles.length));
    };

    return (
        <div className="space-y-12">
            <div className="bg-[#cc0000] px-4 py-1 inline-block mb-8">
                <h2 className="text-white text-xs font-black uppercase tracking-widest">
                    {title || "Latest Posts"}
                </h2>
            </div>

            <div className="flex flex-col space-y-10">
                {visibleArticles.map((article) => (
                    <Link
                        key={article.id}
                        href={article.slug ? `/article/${article.slug}` : `/article/${article.id}`}
                        className="group cursor-pointer flex flex-col md:flex-row gap-8 pb-10 border-b border-gray-300 dark:border-gray-700 last:border-0"
                    >
                        <div className="md:w-1/3 aspect-[4/3] shrink-0 overflow-hidden relative rounded-sm">
                            <Image
                                src={article.image_url || article.image || 'https://placehold.co/800x600?text=No+Image'}
                                alt={article.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            {/* Tags at bottom left of image */}
                            <div className="absolute bottom-3 left-3 flex gap-1 z-10 transition-opacity group-hover:opacity-100">
                                <span className="bg-[#cc0000] text-white text-[10px] font-black uppercase px-2 py-1 tracking-tighter shadow-lg">
                                    {article.category}
                                </span>
                                <span className="bg-white dark:bg-[#111827] text-black dark:text-white text-[9px] font-black uppercase px-2 py-0.5 tracking-tighter border border-gray-100 dark:border-gray-800 shadow-lg transition-colors">
                                    {article.country || "Global"}
                                </span>
                            </div>
                            {/* Share Icons - Bottom Right */}
                            <div className="absolute bottom-3 right-3 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity z-20">
                                <ShareButtons
                                    url={article.slug ? `/article?slug=${article.slug}` : `/article?id=${article.id}`}
                                    title={article.title}
                                    description={article.summary || article.content}
                                    size="xs"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <h3 className="text-xl md:text-2xl font-black uppercase leading-tight text-gray-900 dark:text-white group-hover:text-[#cc0000] dark:group-hover:text-[#cc0000] transition-colors mb-4">
                                {article.title}
                            </h3>
                            <div
                                className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed line-clamp-3 mb-6 prose prose-sm max-w-none [&>p]:m-0 [&>p]:inline"
                                dangerouslySetInnerHTML={{ __html: decodeHtml(article.summary) }}
                            />
                            <div className="flex items-center space-x-4 text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-auto">
                                <span className="flex items-center">
                                    <span className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-800 mr-2 transition-colors"></span>
                                    By {article.source || "HomesPh News"}
                                </span>
                                <span>•</span>
                                <span>{article.created_at ? new Date(article.created_at).toLocaleDateString() : 'Recently'}</span>
                                <span>•</span>
                                <span className="flex items-center">
                                    <span className="mr-1">👁️</span>
                                    {article.views_count.toLocaleString()}
                                </span>
                                <span>•</span>
                                <span>{calculateReadTime(article.content || article.summary)}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {viewAllHref ? (
                <div className="pt-4 text-center">
                    <Link
                        href={viewAllHref}
                        className="bg-[#cc0000] text-white px-10 py-4 text-xs font-black uppercase tracking-[0.2em] hover:bg-black dark:hover:bg-red-700 transition-all transform hover:-translate-y-1 shadow-xl shadow-red-500/10 inline-block"
                    >
                        More Posts
                    </Link>
                </div>
            ) : hasMore && (
                <div className="pt-4 text-center">
                    <button
                        onClick={handleLoadMore}
                        className="bg-[#cc0000] text-white px-10 py-4 text-xs font-black uppercase tracking-[0.2em] hover:bg-black dark:hover:bg-red-700 transition-all transform hover:-translate-y-1 shadow-xl shadow-red-500/10"
                    >
                        Load More Posts
                    </button>
                </div>
            )}
        </div>
    );
}
