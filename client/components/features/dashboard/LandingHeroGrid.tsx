"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArticleResource } from "@/lib/api-new/types";

interface LandingHeroGridProps {
    articles: ArticleResource[];
}

export default function LandingHeroGrid({ articles }: LandingHeroGridProps) {
    const main = articles[0];

    if (!main) return null;

    // 1 Article: Full Banner
    if (articles.length === 1) {
        return (
            <div className="mb-8 md:h-[405px]">
                <Link
                    href={`/article?id=${main.id}`}
                    className="relative group cursor-pointer block w-full h-full overflow-hidden"
                >
                    <Image
                        src={main.image || 'https://placehold.co/1280x600?text=No+Image'}
                        alt={main.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8">
                        <div className="flex gap-2 mb-3">
                            <span className="bg-[#1a1a1a] text-white text-xs font-black uppercase px-2 py-0.5 tracking-tighter">
                                Featured
                            </span>
                            <span className="bg-[#cc0000] text-white text-xs font-black uppercase px-2 py-0.5 tracking-tighter">
                                {main.category}
                            </span>
                            <span className="bg-white text-black text-xs font-black uppercase px-2 py-0.5 tracking-tighter shadow-sm">
                                {main.country || "Global"}
                            </span>
                        </div>
                        <h2 className="text-white text-3xl md:text-4xl font-black leading-tight uppercase group-hover:underline decoration-[#cc0000] decoration-2 underline-offset-4 max-w-4xl">
                            {main.title}
                        </h2>
                        <div className="flex items-center mt-4 space-x-3 text-xs font-bold text-gray-300 uppercase">
                            <span>By {main.source || "HomesPh News"}</span>
                            <span>•</span>
                            <span>{main.created_at ? new Date(main.created_at).toLocaleDateString() : 'Recently'}</span>
                        </div>
                    </div>
                </Link>
            </div>
        );
    }

    // 2 Articles: Split View (Equal Columns)
    if (articles.length === 2) {
        return (
            <div className="flex overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-2 gap-1 mb-8 h-[400px] md:h-[405px] scrollbar-hide">
                {articles.map((article) => (
                    <Link
                        key={article.id}
                        href={`/article?id=${article.id}`}
                        className="relative group cursor-pointer overflow-hidden h-full min-w-[90vw] md:min-w-auto snap-center shrink-0 block"
                    >
                        <Image
                            src={article.image || 'https://placehold.co/800x800?text=No+Image'}
                            alt={article.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-6">
                            <div className="flex gap-2 mb-2">
                                <span className="bg-[#cc0000] text-white text-[10px] font-black uppercase px-2 py-0.5 tracking-tighter">
                                    {article.category}
                                </span>
                                <span className="bg-white text-black text-[10px] font-black uppercase px-2 py-0.5 tracking-tighter shadow-sm">
                                    {article.country || "Global"}
                                </span>
                            </div>
                            <h2 className="text-white text-xl md:text-2xl font-black leading-tight uppercase group-hover:underline decoration-[#cc0000] decoration-2 underline-offset-4">
                                {article.title}
                            </h2>
                            <div className="flex items-center mt-3 space-x-3 text-[10px] font-bold text-gray-300 uppercase">
                                <span>By {article.source || "HomesPh News"}</span>
                                <span>•</span>
                                <span>{article.created_at ? new Date(article.created_at).toLocaleDateString() : 'Recently'}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        );
    }

    // 3 Articles: Hybrid (1 Main + 2 Stacked)
    if (articles.length === 3) {
        const side1 = articles[1];
        const side2 = articles[2];
        return (
            <div className="flex overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-4 gap-1 mb-8 h-[400px] md:h-[405px] scrollbar-hide">
                {/* Main Article (Left Half) */}
                <Link
                    href={`/article?id=${main.id}`}
                    className="md:col-span-2 relative group cursor-pointer overflow-hidden h-full min-w-[90vw] md:min-w-auto snap-center shrink-0 block"
                >
                    <Image
                        src={main.image || 'https://placehold.co/800x800?text=No+Image'}
                        alt={main.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-6">
                        <div className="flex gap-2 mb-2">
                            <span className="bg-[#cc0000] text-white text-[10px] font-black uppercase px-2 py-0.5 tracking-tighter">
                                {main.category}
                            </span>
                            <span className="bg-white text-black text-[10px] font-black uppercase px-2 py-0.5 tracking-tighter shadow-sm">
                                {main.country || "Global"}
                            </span>
                        </div>
                        <h2 className="text-white text-xl md:text-2xl font-black leading-tight uppercase group-hover:underline decoration-[#cc0000] decoration-2 underline-offset-4">
                            {main.title}
                        </h2>
                        <div className="flex items-center mt-3 space-x-3 text-[10px] font-bold text-gray-300 uppercase">
                            <span>By {main.source || "HomesPh News"}</span>
                            <span>•</span>
                            <span>{main.created_at ? new Date(main.created_at).toLocaleDateString() : 'Recently'}</span>
                        </div>
                    </div>
                </Link>

                {/* Right Column (2 Stacked) */}
                <div className="md:col-span-2 grid grid-rows-2 gap-1 h-full min-w-[90vw] md:min-w-auto snap-center shrink-0">
                    {[side1, side2].map((article) => (
                        <Link
                            key={article.id}
                            href={`/article?id=${article.id}`}
                            className="relative group cursor-pointer overflow-hidden h-full block"
                        >
                            <Image
                                src={article.image || 'https://placehold.co/800x450?text=No+Image'}
                                alt={article.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent flex flex-col justify-end p-4">
                                <div className="flex gap-1.5 mb-1.5">
                                    <span className="bg-[#cc0000] text-white text-[9px] font-black uppercase px-1.5 py-0.5 self-start tracking-tighter">
                                        {article.category}
                                    </span>
                                    <span className="bg-white text-black text-[8px] font-black uppercase px-1.5 py-0.5 self-start tracking-tighter shadow-sm">
                                        {article.country || "Global"}
                                    </span>
                                </div>
                                <h3 className="text-white text-sm font-black leading-tight uppercase group-hover:text-[#cc0000] transition-colors line-clamp-2">
                                    {article.title}
                                </h3>
                                <div className="flex items-center mt-2 space-x-2 text-[9px] font-bold text-gray-400 uppercase">
                                    <span>By {article.source || "HomesPh News"}</span>
                                    <span>•</span>
                                    <span>{article.created_at ? new Date(article.created_at).toLocaleDateString() : 'Recently'}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        );
    }

    // 4+ Articles: Standard Grid
    const topSmall = articles[1];
    const bottomSmall1 = articles[2];
    const bottomSmall2 = articles[3];

    return (
        <div className="flex overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-4 gap-1 mb-8 h-[400px] md:h-[405px] scrollbar-hide">
            {/* Large Main Article */}
            <Link
                href={`/article?id=${main.id}`}
                className="md:col-span-2 relative group cursor-pointer overflow-hidden h-full min-w-[90vw] md:min-w-auto snap-center shrink-0 block"
            >
                <Image
                    src={main.image || 'https://placehold.co/800x800?text=No+Image'}
                    alt={main.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-6">
                    <div className="flex gap-2 mb-2">
                        <span className="bg-[#1a1a1a] text-white text-[10px] font-black uppercase px-2 py-0.5 tracking-tighter">
                            Featured
                        </span>
                        <span className="bg-[#cc0000] text-white text-[10px] font-black uppercase px-2 py-0.5 tracking-tighter">
                            {main.category}
                        </span>
                        <span className="bg-white text-black text-[10px] font-black uppercase px-2 py-0.5 tracking-tighter shadow-sm">
                            {main.country || "Global"}
                        </span>
                    </div>
                    <h2 className="text-white text-xl md:text-2xl font-black leading-tight uppercase group-hover:underline decoration-[#cc0000] decoration-2 underline-offset-4">
                        {main.title}
                    </h2>
                    <div className="flex items-center mt-3 space-x-3 text-[10px] font-bold text-gray-300 uppercase">
                        <span>By {main.source || "HomesPh News"}</span>
                        <span>•</span>
                        <span>{main.created_at ? new Date(main.created_at).toLocaleDateString() : 'Recently'}</span>
                    </div>
                </div>
            </Link>

            {/* Right Column Grid */}
            <div className="md:col-span-2 grid grid-cols-1 gap-1 h-full min-w-[90vw] md:min-w-auto snap-center shrink-0">
                {/* Top Medium Article */}
                {topSmall && (
                    <Link
                        href={`/article?id=${topSmall.id}`}
                        className="relative group cursor-pointer overflow-hidden h-[200px] block"
                    >
                        <Image
                            src={topSmall.image || 'https://placehold.co/800x450?text=No+Image'}
                            alt={topSmall.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent flex flex-col justify-end p-4">
                            <div className="flex gap-1.5 mb-1.5">
                                <span className="bg-[#cc0000] text-white text-[9px] font-black uppercase px-1.5 py-0.5 self-start tracking-tighter">
                                    {topSmall.category}
                                </span>
                                <span className="bg-white text-black text-[8px] font-black uppercase px-1.5 py-0.5 self-start tracking-tighter shadow-sm">
                                    {topSmall.country || "Global"}
                                </span>
                            </div>
                            <h3 className="text-white text-sm font-black leading-tight uppercase group-hover:text-[#cc0000] transition-colors line-clamp-2">
                                {topSmall.title}
                            </h3>
                            <div className="flex items-center mt-2 space-x-2 text-[9px] font-bold text-gray-400 uppercase">
                                <span>By {topSmall.source || "HomesPh News"}</span>
                                <span>•</span>
                                <span>{topSmall.created_at ? new Date(topSmall.created_at).toLocaleDateString() : 'Recently'}</span>
                            </div>
                        </div>
                    </Link>
                )}

                {/* Bottom Small Articles Row */}
                <div className="grid grid-cols-2 gap-1 h-[200px]">
                    {[bottomSmall1, bottomSmall2].map((article, idx) => article ? (
                        <Link
                            key={article.id || idx}
                            href={`/article?id=${article.id}`}
                            className="relative group cursor-pointer overflow-hidden block"
                        >
                            <Image
                                src={article.image || 'https://placehold.co/400x400?text=No+Image'}
                                alt={article.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent flex flex-col justify-end p-4">
                                <div className="flex gap-1 mb-1">
                                    <span className="bg-[#cc0000] text-white text-[8px] font-black uppercase px-1 py-0.5 self-start tracking-tighter">
                                        {article.category}
                                    </span>
                                    <span className="bg-white text-black text-[8px] font-black uppercase px-1 py-0.5 self-start tracking-tighter shadow-sm">
                                        {article.country || "Global"}
                                    </span>
                                </div>
                                <h4 className="text-white text-[11px] font-black leading-tight uppercase line-clamp-2">
                                    {article.title}
                                </h4>
                                <div className="flex items-center mt-1 space-x-1.5 text-[8px] font-bold text-gray-400 uppercase">
                                    <span>{article.created_at ? new Date(article.created_at).toLocaleDateString() : 'Recently'}</span>
                                </div>
                            </div>
                        </Link>
                    ) : <div key={idx} className="bg-gray-100 h-full min-h-[100px]" />)}
                </div>
            </div>
        </div>
    );
}
