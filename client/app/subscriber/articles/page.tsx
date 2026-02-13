"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminPageHeader from "@/components/features/admin/shared/AdminPageHeader";
import ArticlesTabs, { ArticleTab } from "@/components/features/admin/articles/ArticlesTabs";
import ArticlesFilters from "@/components/features/admin/articles/ArticlesFilters";
import ArticleListItem from "@/components/features/admin/articles/ArticleListItem";
import Pagination from "@/components/features/admin/shared/Pagination";
import { ArticleResource } from "@/lib/api-v2/types/ArticleResource";
import usePagination from '@/hooks/usePagination';
import useUrlFilters from '@/hooks/useUrlFilters';
import { getAdminArticles } from "@/lib/api-v2/admin/service/article/getAdminArticles";
import ArticlesSkeleton from "@/components/features/admin/articles/ArticlesSkeleton";

const URL_FILTERS_CONFIG = {
    status: {
        default: 'all' as const,
        resetValues: ['all']
    },
    category: {
        default: 'All Category' as const,
        resetValues: ['All Category']
    },
    country: {
        default: 'All Countries' as const,
        resetValues: ['All Countries']
    },
};

/**
 * Subscriber ArticlesPage - Limited view of articles
 */
export default function SubscriberArticlesPage() {
    const router = useRouter();
    const { filters, setFilter } = useUrlFilters(URL_FILTERS_CONFIG);
    const [searchQuery, setSearchQuery] = useState('');
    const pagination = usePagination();
    const [filteredArticles, setFilteredArticles] = useState<ArticleResource[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [counts, setCounts] = useState({
        all: 0,
        published: 0,
        pending: 0,
        deleted: 0,
    });

    useEffect(() => {
        const fetchArticles = async () => {
            setIsLoading(true);
            try {
                const apiFilters = {
                    status: filters.status === 'all' ? undefined : filters.status,
                    category: filters.category === 'All Category' ? undefined : filters.category,
                    country: filters.country === 'All Countries' ? undefined : filters.country,
                    search: searchQuery || undefined,
                    page: pagination.currentPage,
                    per_page: 10
                } as any;

                const response = await getAdminArticles(apiFilters);
                const { data, current_page, last_page, status_counts } = response.data;

                setFilteredArticles(data ?? []);
                pagination.handlePageChange(current_page ?? 1);
                pagination.setTotalPages(last_page ?? 1);

                if (status_counts) {
                    setCounts({
                        all: Number(status_counts.all),
                        published: Number(status_counts.published),
                        pending: Number(status_counts.pending),
                        deleted: Number(status_counts.deleted || 0),
                    });
                }
            } catch (error) {
                console.error("Failed to fetch articles:", error);
                setFilteredArticles([]);
            } finally {
                setIsLoading(false);
            }
        };

        const timer = setTimeout(() => {
            fetchArticles();
        }, 300);

        return () => clearTimeout(timer);
    }, [filters, searchQuery, pagination.currentPage]);

    return (
        <div className="p-8 bg-[#f9fafb] min-h-screen">
            <AdminPageHeader
                title="Subscriber Articles"
                description="Browse and read latest articles"
            />

            <div className="bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden shadow-[0px_1px_3px_rgba(0,0,0,0.05)]">
                <ArticlesTabs
                    activeTab={filters.status as ArticleTab}
                    setActiveTab={(tab) => setFilter('status', tab)}
                    counts={counts}
                />

                <ArticlesFilters
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    categoryFilter={filters.category}
                    setCategoryFilter={(cat) => setFilter('category', cat)}
                    countryFilter={filters.country}
                    setCountryFilter={(country) => setFilter('country', country)}
                />

                <div className="flex flex-col">
                    {isLoading ? (
                        <ArticlesSkeleton />
                    ) : filteredArticles.length > 0 ? (
                        filteredArticles.map((article) => (
                            <ArticleListItem
                                key={article.id}
                                article={article}
                                onClick={() => {
                                    router.push(`/subscriber/articles/${article.id}`);
                                }}
                            />
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
