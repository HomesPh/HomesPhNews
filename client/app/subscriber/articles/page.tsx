"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AdminPageHeader from "@/components/features/admin/shared/AdminPageHeader";
import ArticlesFilters from "@/components/features/admin/articles/ArticlesFilters";
import Pagination from "@/components/features/admin/shared/Pagination";
import { ArticleResource } from "@/lib/api-v2/types/ArticleResource";
import usePagination from '@/hooks/usePagination';
import useUrlFilters from '@/hooks/useUrlFilters';
import AXIOS_INSTANCE_ADMIN from "@/lib/api-v2/admin/axios-instance";
import ArticlesSkeleton from "@/components/features/admin/articles/ArticlesSkeleton";
import BaseArticleCard from "@/components/features/admin/shared/BaseArticleCard";
import { Globe, BookOpen, ExternalLink } from "lucide-react";

const URL_FILTERS_CONFIG = {
    sitestatus: {
        default: 'all' as const,
        resetValues: ['all']
    },
    category: {
        default: '' as const,
        resetValues: ['']
    },
    country: {
        default: '' as const,
        resetValues: ['']
    },
};

type SiteStatus = 'all' | 'on-site' | 'not-on-site';

/**
 * Subscriber ArticlesPage — browse all published articles,
 * and toggle whether they appear on the subscriber's own site.
 */
export default function SubscriberArticlesPage() {
    const router = useRouter();
    const { filters, setFilter } = useUrlFilters(URL_FILTERS_CONFIG);
    const [searchQuery, setSearchQuery] = useState('');
    const pagination = usePagination();
    const [articles, setArticles] = useState<ArticleResource[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const [availableFilters, setAvailableFilters] = useState<{
        categories: string[];
        countries: string[];
    }>({ categories: [], countries: [] });

    // Subscriber's chosen preferences from onboarding
    const [subscriberPrefs, setSubscriberPrefs] = useState<{ countries: string[]; categories: string[] } | null>(() => {
        if (typeof window === 'undefined') return null;
        try {
            const prefs = JSON.parse(localStorage.getItem('user_preferences') || '{}');
            return {
                countries: prefs.countries || [],
                categories: prefs.categories || [],
            };
        } catch { return null; }
    });

    // Filtered to only show subscriber-chosen options
    const filteredFilters = {
        categories: subscriberPrefs?.categories?.length
            ? availableFilters.categories.filter(c => subscriberPrefs.categories.includes(c))
            : availableFilters.categories,
        countries: subscriberPrefs?.countries?.length
            ? availableFilters.countries.filter(c => subscriberPrefs.countries.includes(c))
            : availableFilters.countries,
    };

    // Track which article IDs the subscriber has published to their site
    const [publishedOnSite, setPublishedOnSite] = useState<Set<string>>(() => {
        if (typeof window === 'undefined') return new Set<string>();
        try {
            const stored = localStorage.getItem('subscriber_site_articles');
            return new Set<string>(JSON.parse(stored || '[]'));
        } catch {
            return new Set<string>();
        }
    });

    // Persist to localStorage whenever publishedOnSite changes
    useEffect(() => {
        localStorage.setItem('subscriber_site_articles', JSON.stringify([...publishedOnSite]));
    }, [publishedOnSite]);

    const toggleSiteArticle = (e: React.MouseEvent, id: string) => {
        e.stopPropagation(); // Prevent row click navigating to detail
        setPublishedOnSite(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const fetchArticles = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await AXIOS_INSTANCE_ADMIN.get<{
                data: ArticleResource[];
                current_page: number;
                last_page: number;
                total: number;
                available_filters?: { categories: string[]; countries: string[] };
            }>('/v1/subscriber/articles', {
                params: {
                    status: 'published',
                    category: filters.category === '' ? undefined : filters.category,
                    country: filters.country === '' ? undefined : filters.country,
                    allowed_categories: subscriberPrefs?.categories,
                    allowed_countries: subscriberPrefs?.countries,
                    search: searchQuery || undefined,
                    page: pagination.currentPage,
                    per_page: 10,
                }
            });

            const { data, current_page, last_page, total, available_filters } = response.data;
            // Ensure articles is always a plain array
            const articlesArray: ArticleResource[] = Array.isArray(data)
                ? data
                : data && typeof data === 'object'
                    ? Object.values(data)
                    : [];
            setArticles(articlesArray);
            pagination.handlePageChange(current_page ?? 1);
            pagination.setTotalPages(last_page ?? 1);
            setTotalCount(total ?? articlesArray.length);

            if (available_filters) {
                setAvailableFilters(available_filters);
            }
        } catch (error) {
            console.error("Failed to fetch articles:", error);
            setArticles([]);
            pagination.setTotalPages(1);
            pagination.handlePageChange(1);
        } finally {
            setIsLoading(false);
        }
    }, [filters.category, filters.country, searchQuery, pagination.currentPage, subscriberPrefs]);

    useEffect(() => {
        const timer = setTimeout(fetchArticles, 300);
        return () => clearTimeout(timer);
    }, [fetchArticles]);

    // Client-side tab filtering (on-site vs not-on-site)
    const activeTab = (filters.sitestatus as SiteStatus) || 'all';
    const displayedArticles = articles.filter(a => {
        if (activeTab === 'on-site') return publishedOnSite.has(a.id);
        if (activeTab === 'not-on-site') return !publishedOnSite.has(a.id);
        return true;
    });

    // Counts are based on totals — not just the current page
    const onSiteCount = publishedOnSite.size;
    const notOnSiteCount = Math.max(0, totalCount - onSiteCount);

    // Site info from onboarding preferences
    const [siteName, setSiteName] = useState('');
    const [siteUrl, setSiteUrl] = useState('');
    useEffect(() => {
        try {
            const prefs = JSON.parse(localStorage.getItem('user_preferences') || '{}');
            setSiteName(prefs.customization?.siteName || '');
            setSiteUrl(prefs.customization?.siteUrl || '');
        } catch { }
    }, []);

    const TABS: { id: SiteStatus; label: string; count: number }[] = [
        { id: 'all', label: 'All Articles', count: totalCount },
        { id: 'on-site', label: 'Published to Site', count: onSiteCount },
        { id: 'not-on-site', label: 'Not on Site', count: notOnSiteCount },
    ];

    return (
        <div className="p-8 bg-[#f9fafb] min-h-screen">
            <div className="flex items-start justify-between mb-2">
                <AdminPageHeader
                    title="Article Library"
                    description="Browse all published articles and select which ones appear on your site."
                />
            </div>

            <div className="bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden shadow-[0px_1px_3px_rgba(0,0,0,0.05)]">
                {/* Custom Tabs */}
                <div className="flex border-b border-[#e5e7eb] px-6 pt-4 gap-1">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setFilter('sitestatus', tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg text-sm font-medium transition-all border-b-2
                                ${activeTab === tab.id
                                    ? 'border-[#C10007] text-[#C10007] bg-red-50/40'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            {tab.id === 'on-site' && <BookOpen className="w-4 h-4" />}
                            {tab.id === 'all' && <Globe className="w-4 h-4" />}
                            {tab.label}
                            <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-semibold tabular-nums
                                ${activeTab === tab.id ? 'bg-[#C10007] text-white' : 'bg-gray-100 text-gray-500'}`}>
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>

                <ArticlesFilters
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    categoryFilter={filters.category}
                    setCategoryFilter={(cat) => setFilter('category', cat)}
                    countryFilter={filters.country}
                    setCountryFilter={(country) => setFilter('country', country)}
                    availableCategories={filteredFilters.categories}
                    availableCountries={filteredFilters.countries}
                />

                <div className="flex flex-col divide-y divide-[#f3f4f6]">
                    {isLoading ? (
                        <ArticlesSkeleton />
                    ) : displayedArticles.length > 0 ? (
                        displayedArticles.map((article) => (
                            <div key={article.id}>
                                <BaseArticleCard
                                    article={article}
                                    variant="list"
                                    hideStatus={true}
                                    onClick={() => router.push(`/subscriber/articles/${article.id}`)}
                                />
                            </div>
                        ))
                    ) : (
                        <div className="p-20 text-center">
                            <p className="text-[#6b7280] text-[16px]">No articles found.</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-8">
                <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={pagination.handlePageChange}
                />
            </div>
        </div>
    );
}
