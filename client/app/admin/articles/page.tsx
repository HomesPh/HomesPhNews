"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminPageHeader from "@/components/features/admin/shared/AdminPageHeader";
import { Plus, Send, Trash, CheckSquare, Square } from 'lucide-react';
import ArticlesTabs, { ArticleTab } from "@/components/features/admin/articles/ArticlesTabs";
import ArticlesFilters from "@/components/features/admin/articles/ArticlesFilters";
import ArticleListItem from "@/components/features/admin/articles/ArticleListItem";
import Pagination from "@/components/features/admin/shared/Pagination";
import { ArticleResource } from "@/lib/api-v2/types/ArticleResource";
import ArticleEditorModal from "@/components/features/admin/articles/ArticleEditorModal";
import usePagination from '@/hooks/usePagination';
import useUrlFilters from '@/hooks/useUrlFilters';
import { getAdminArticles } from "@/lib/api-v2/admin/service/article/getAdminArticles";
import ArticlesSkeleton from "@/components/features/admin/articles/ArticlesSkeleton";
import SendNewsletterModal from "@/components/features/admin/articles/SendNewsletterModal";

// Filter configuration with defaults and reset values
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
    const [selectedArticleIds, setSelectedArticleIds] = useState<string[]>([]);
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

    // Pagination state handler
    const pagination = usePagination();

    // State for articles (fetched from backend)
    const [filteredArticles, setFilteredArticles] = useState<ArticleResource[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // State for available filters (categories/countries from backend)
    const [availableFilters, setAvailableFilters] = useState<{
        categories: string[];
        countries: string[];
    }>({
        categories: [],
        countries: [],
    });

    // State for status counts (from backend)
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
                // Map frontend filter values to backend expected values
                // Status 'pending' will trigger the Redis fetch on the backend
                const apiFilters = {
                    status: filters.status === 'all' ? undefined : filters.status,
                    category: filters.category === '' ? undefined : filters.category,
                    country: filters.country === '' ? undefined : filters.country,
                    search: searchQuery || undefined,
                    page: pagination.currentPage,
                    per_page: 10
                } as any;

                const response = await getAdminArticles(apiFilters);
                // Backend returns pagination fields at top level, not in a meta object
                const { data, current_page, last_page, status_counts, available_filters } = response.data;

                // Ensure we always have an array, even if API returns unexpected data
                setFilteredArticles(data ?? []);

                // Update pagination with backend data (with fallbacks to prevent NaN)
                pagination.handlePageChange(current_page ?? 1);
                pagination.setTotalPages(last_page ?? 1);

                // Update status counts from backend
                if (status_counts) {
                    setCounts({
                        all: Number(status_counts.all),
                        published: Number(status_counts.published),
                        pending: Number(status_counts.pending),
                        deleted: Number(status_counts.deleted || 0),
                    });
                }

                // Update available filters from backend
                if (available_filters) {
                    setAvailableFilters(available_filters);
                }

            } catch (error) {
                console.error("Failed to fetch articles:", error);
                // Reset to safe defaults on error to prevent undefined/NaN issues
                setFilteredArticles([]);
                pagination.setTotalPages(1);
                pagination.handlePageChange(1);
            } finally {
                setIsLoading(false);
            }
        };

        const timer = setTimeout(() => {
            fetchArticles();
        }, 300); // Debounce search

        return () => clearTimeout(timer);
    }, [filters, searchQuery, pagination.currentPage]);

    return (
        <div className="p-8 bg-[#f9fafb] min-h-screen">
            <AdminPageHeader
                title="Article Management"
                description="Manage and review all articles across the platform"
                actionLabel="New Article"
                onAction={() => setIsCreateModalOpen(true)}
                actionIcon={Plus}
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
                    availableCategories={availableFilters.categories}
                    availableCountries={availableFilters.countries}
                />

                <div className="flex items-center px-5 py-3 border-b border-[#f3f4f6] bg-[#fafbfc]">
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={filteredArticles.length > 0 && filteredArticles.every(a => selectedArticleIds.includes(a.id))}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    const newSelected = [...new Set([...selectedArticleIds, ...filteredArticles.map(a => a.id)])];
                                    setSelectedArticleIds(newSelected);
                                } else {
                                    const visibleIds = filteredArticles.map(a => a.id);
                                    setSelectedArticleIds(prev => prev.filter(id => !visibleIds.includes(id)));
                                }
                            }}
                            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                        <span className="text-[12px] font-black text-[#64748b] tracking-widest uppercase">Select All Visible</span>
                    </div>
                </div>

                <div className="flex flex-col">
                    {isLoading ? (
                        <ArticlesSkeleton />
                    ) : filteredArticles.length > 0 ? (
                        filteredArticles.map((article) => (
                            <ArticleListItem
                                key={article.id}
                                article={article}
                                selection={{
                                    isSelected: selectedArticleIds.includes(article.id),
                                    onSelect: (checked) => {
                                        setSelectedArticleIds(prev =>
                                            checked ? [...prev, article.id] : prev.filter(id => id !== article.id)
                                        );
                                    }
                                }}
                                onClick={() => {
                                    const currentPath = window.location.pathname + window.location.search;
                                    router.push(`/admin/articles/${article.id}?from=${encodeURIComponent(currentPath)}`);
                                }}
                            />
                        ))
                    ) : (
                        <div className="p-20 text-center">
                            <p className="text-[#6b7280] text-[16px]">No articles found matching your criteria.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Pagination Component */}
            <div className="mt-8">
                <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={pagination.handlePageChange}
                />
            </div>

            {/* Bulk Action Bar */}
            {selectedArticleIds.length > 0 && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white border border-[#e5e7eb] shadow-2xl rounded-full px-6 py-3 flex items-center gap-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="flex items-center gap-2 pr-4 border-r border-gray-100">
                        <span className="bg-blue-600 text-white text-[12px] font-black w-6 h-6 rounded-full flex items-center justify-center">
                            {selectedArticleIds.length}
                        </span>
                        <span className="text-[13px] font-bold text-[#1e293b] uppercase tracking-tight">Selected</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsBulkModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-[13px] font-bold transition-all active:scale-95 shadow-lg shadow-blue-100"
                        >
                            <Send className="w-4 h-4" />
                            BROADCAST NEWSLETTER
                        </button>
                        <button
                            onClick={() => setSelectedArticleIds([])}
                            className="px-4 py-2 hover:bg-gray-50 text-[#64748b] rounded-full text-[13px] font-bold transition-colors"
                        >
                            CLEAR
                        </button>
                    </div>
                </div>
            )}

            {/* Create Article Modal */}
            <ArticleEditorModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                mode="create"
                availableCategories={availableFilters.categories}
                availableCountries={availableFilters.countries}
            />

            {/* Bulk Newsletter Modal */}
            <SendNewsletterModal
                isOpen={isBulkModalOpen}
                onClose={() => setIsBulkModalOpen(false)}
                articles={filteredArticles
                    .filter(a => selectedArticleIds.includes(a.id))
                    .map(a => ({
                        id: a.id,
                        title: a.title,
                        category: a.category,
                        country: a.country
                    }))
                }
            />
        </div>
    );
}
