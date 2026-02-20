"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Clock } from "lucide-react";
import { getArticlesList, ArticleResource } from "@/lib/api-v2";
import { cn, sanitizeImageUrl } from "@/lib/utils";

interface SearchSuggestionsProps {
    query: string;
    onClose: () => void;
    className?: string;
}

export default function SearchSuggestions({ query, onClose, className }: SearchSuggestionsProps) {
    const [suggestions, setSuggestions] = useState<ArticleResource[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Debounce and fetch
    useEffect(() => {
        // Only search if query is at least 2 chars
        if (!query || query.length < 2) {
            setSuggestions([]);
            return;
        }

        let isActive = true;

        const timer = setTimeout(async () => {
            setIsLoading(true);
            try {
                const response = await getArticlesList({
                    limit: 5,
                    page: 1,
                    search: query,
                    status: "published"
                });

                if (isActive) {
                    if (response.data && response.data.data) {
                        setSuggestions(response.data.data);
                    } else {
                        setSuggestions([]);
                    }
                }
            } catch (error) {
                if (isActive) {
                    console.error("Failed to fetch search suggestions:", error);
                    setSuggestions([]);
                }
            } finally {
                if (isActive) {
                    setIsLoading(false);
                }
            }
        }, 300); // 300ms debounce

        return () => {
            isActive = false;
            clearTimeout(timer);
        };

    }, [query]);

    // Always render the wrapper to ensure refs and click handlers work
    // If query is too short, we can hide it or show nothing inside
    const showSuggestions = query && query.length >= 2;

    if (!showSuggestions) {
        return null;
    }

    return (
        <div
            className={cn(
                "absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1f2937] rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-[60]",
                className
            )}
        >
            {isLoading ? (
                <div className="p-4 text-center text-gray-500 text-sm">
                    <div className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                    Searching...
                </div>
            ) : suggestions.length > 0 ? (
                <div className="py-2">
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Suggestions
                    </div>
                    {suggestions.map((article) => (
                        <Link
                            key={article.id}
                            href={article.slug ? `/article/${article.slug}` : `/article/${article.id}`}
                            onClick={onClose}
                            className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-800 last:border-0"
                        >
                            <div className="relative w-12 h-12 shrink-0 rounded overflow-hidden bg-gray-100">
                                <Image
                                    src={sanitizeImageUrl(article.image || article.image_url, 'https://placehold.co/100x100?text=News')}
                                    alt={article.title}
                                    fill
                                    className="object-cover"
                                    unoptimized // Small thumbnails
                                />
                            </div>
                            <div className="flex-1 min-w-0 flex items-center">
                                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2 leading-snug group-hover:text-[#c10007]">
                                    {article.title}
                                </h4>
                            </div>
                        </Link>
                    ))}
                    <Link
                        href={`/search?q=${encodeURIComponent(query)}`}
                        onClick={onClose}
                        className="block px-4 py-3 text-center text-sm font-medium text-[#c10007] hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-t border-gray-100 dark:border-gray-700"
                    >
                        View all results
                    </Link>
                </div>
            ) : (
                <div className="p-4 text-center text-gray-500 text-sm">
                    No results found for "{query}"
                </div>
            )}
        </div>
    );
}
