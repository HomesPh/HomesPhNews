"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminPageHeader from "@/components/features/admin/shared/AdminPageHeader";
import { Plus } from 'lucide-react';
import EditorArticlesTabs, { EditorArticleTab } from "@/components/features/editor/articles/EditorArticlesTabs";
import ArticlesFilters from "@/components/features/admin/articles/ArticlesFilters";
import ArticleListItem from "@/components/features/admin/articles/ArticleListItem";
import Pagination from "@/components/features/admin/shared/Pagination";
import { ArticleResource } from "@/lib/api-v2/types/ArticleResource";
import ArticleEditorModal from "@/components/features/admin/articles/ArticleEditorModal";
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
        default: '' as const,
        resetValues: ['']
    },
    country: {
        default: '' as const,
        resetValues: ['']
    },
};

export default function EditorArticlesPage() {
    const router = useRouter();
    const { filters, setFilter } = useUrlFilters(URL_FILTERS_CONFIG);
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const pagination = usePagination();

    const [articles, setArticles] = useState<ArticleResource[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [availableFilters, setAvailableFilters] = useState<{
        categories: string[];
        countries: string[];
    }>({
        categories: [],
        countries: [],
    });

    const [counts, setCounts] = useState({
        all: 0,
        published: 0,
        pending_review: 0,
        edited: 0,
        rejected: 0,
    });

    useEffect(() => {
        const fetchArticles = async () => {
            setIsLoading(true);
            try {
                // Map tab IDs to backend statuses
                const statusMapping: Record<string, string | undefined> = {
                    all: undefined,
                    published: 'published',
                    pending_review: 'pending review',
                    edited: 'edited',
                    rejected: 'rejected'
                };

                const apiFilters = {
                    status: statusMapping[filters.status] || filters.status,
                    category: filters.category === '' ? undefined : filters.category,
                    country: filters.country === '' ? undefined : filters.country,
                    search: searchQuery || undefined,
                    page: pagination.currentPage,
                    per_page: 10
                } as any;

                const response = await getAdminArticles(apiFilters);
                const { data, current_page, last_page, status_counts, available_filters } = response.data;

                // Exclude Redis articles from Editor's view
                const visibleArticles = (data ?? []).filter((a: ArticleResource) =>
                    a.status !== 'being_processed' && !a.is_redis
                );
                setArticles(visibleArticles);

                pagination.handlePageChange(current_page ?? 1);
                pagination.setTotalPages(last_page ?? 1);

                if (status_counts) {
                    const published = Number(status_counts.published || 0);
                    const pending_review = Number(status_counts.pending || status_counts.pending_review || 0);
                    const edited = Number(status_counts.edited || 0);
                    const rejected = Number(status_counts.rejected || 0);

                    setCounts({
                        all: published + pending_review + edited + rejected,
                        published,
                        pending_review,
                        edited,
                        rejected,
                    });
                }

                if (available_filters) {
                    setAvailableFilters(available_filters);
                }
            } catch (error) {
                console.error("Failed to fetch articles:", error);
            } finally {
                setIsLoading(false);
            }
        };

        const timer = setTimeout(fetchArticles, 300);
        return () => clearTimeout(timer);
    }, [filters, searchQuery, pagination.currentPage]);

    return (
        <div className="p-8 bg-[#f9fafb] min-h-screen">
            <AdminPageHeader
                title="Editor Articles"
                description="Review and manage articles assigned for editing"
                actionLabel="New Article"
                onAction={() => setIsCreateModalOpen(true)}
                actionIcon={Plus}
            />

            <div className="bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden shadow-[0px_1px_3px_rgba(0,0,0,0.05)]">
                <EditorArticlesTabs
                    activeTab={filters.status as EditorArticleTab}
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
                    availableCategories={availableFilters.categories}
                    availableCountries={availableFilters.countries}
                />

                <div className="flex flex-col">
                    {isLoading ? (
                        <ArticlesSkeleton />
                    ) : articles.length > 0 ? (
                        articles.map((article) => (
                            <ArticleListItem
                                key={article.id}
                                article={article}
                                onClick={() => {
                                    router.push(`/editor/articles/${article.id}`);
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

            <ArticleEditorModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                mode="create"
                availableCategories={availableFilters.categories}
                availableCountries={availableFilters.countries}
            />
        </div>
    );
}
