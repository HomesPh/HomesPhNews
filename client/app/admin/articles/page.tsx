"use client";

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ArticlesHeader from "@/components/features/admin/articles/ArticlesHeader";
import ArticlesTabs, { ArticleTab } from "@/components/features/admin/articles/ArticlesTabs";
import ArticlesFilters from "@/components/features/admin/articles/ArticlesFilters";
import ArticleListItem from "@/components/features/admin/articles/ArticleListItem";
import Pagination from "@/components/features/admin/shared/Pagination";
import { articlesData } from "@/app/admin/articles/data";
import ArticleEditorModal from "@/components/features/admin/articles/ArticleEditorModal";
import usePagination from '@/hooks/usePagination';
import useUrlFilters from '@/hooks/useUrlFilters';

// Filter configuration with defaults and reset values
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
 * ArticlesPage component for the admin dashboard
 */
export default function ArticlesPage() {
    const router = useRouter();

    // URL-synced filters (status, category, country)
    const { filters, setFilter } = useUrlFilters(URL_FILTERS_CONFIG);

    // Local state (not synced to URL)
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Pagination state handler
    const pagination = usePagination({ totalPages: 10 });

    // Calculate counts for tabs
    const counts = useMemo(() => ({
        all: articlesData.length,
        published: articlesData.filter(a => a.status === 'published').length,
        pending: articlesData.filter(a => a.status === 'pending').length,
        rejected: articlesData.filter(a => a.status === 'rejected').length,
    }), []);

    // Filter articles based on state
    // State for articles (fetched from backend)
    const [filteredArticles, setFilteredArticles] = useState(articlesData);

    // Effect: Fetch articles when filters change
    // In the future, replace this logic with: fetchArticles({ ...filters, query: searchQuery })
    useEffect(() => {
        const result = articlesData.filter(article => {
            const matchesTab = filters.status === 'all' || article.status === filters.status;
            const matchesCategory = filters.category === 'All Category' || article.category === filters.category;
            const matchesCountry = filters.country === 'All Countries' || article.location === filters.country;
            const matchesSearch = !searchQuery || article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                article.description.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesTab && matchesSearch && matchesCategory && matchesCountry;
        });
        setFilteredArticles(result);
    }, [filters, searchQuery]);

    return (
        <div className="p-8 bg-[#f9fafb] min-h-screen">
            <ArticlesHeader onNewArticle={() => setIsCreateModalOpen(true)} />


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
                    {filteredArticles.length > 0 ? (
                        filteredArticles.map((article) => (
                            <ArticleListItem
                                key={article.id}
                                article={article}
                                onClick={() => router.push(`/admin/articles/${article.id}`)}
                            />
                        ))
                    ) : (
                        <div className="p-20 text-center">
                            <p className="text-[#6b7280] text-[16px]">No articles found matching your criteria.</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={pagination.handlePageChange}
                />
            </div>

            {/* Create Article Modal */}
            <ArticleEditorModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                mode="create"
            />
        </div>
    );
}
