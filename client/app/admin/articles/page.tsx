"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AdminPageHeader from "@/components/features/admin/shared/AdminPageHeader";
import { Plus, Trash } from 'lucide-react';
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
import ScraperControlPanel from "@/components/features/admin/articles/ScraperControlPanel";

// Filter configuration with defaults and reset values
// Only 'all' should remove the status param from URL; other tab values must stay so the correct tab stays active
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
    city: {
        default: '' as const,
        resetValues: ['']
    },
};

/**
 * ArticlesPage component for the admin dashboard
 */
export default function ArticlesPage() {
    const router = useRouter();

    // URL-synced filters (status, category, country, city)
    const { filters, setFilter, setFilters } = useUrlFilters(URL_FILTERS_CONFIG);

    // Stable handlers to prevent infinite update loops in child components
    const handleSetStatus = useCallback((tab: string) => setFilter('status', tab), [setFilter]);
    const handleSetCategory = useCallback((cat: string) => setFilter('category', cat), [setFilter]);
    const handleSetCountry = useCallback((country: string) => setFilter('country', country), [setFilter]);
    const handleSetCity = useCallback((city: string) => setFilter('city', city), [setFilter]);

    // Normalize legacy ?status=pending to being_processed so the correct tab is active
    useEffect(() => {
        if (filters.status === 'pending') {
            setFilter('status', 'being_processed');
        }
    }, []);

    // Local state (not synced to URL)
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Pagination state handler
    const pagination = usePagination();

    // State for articles (fetched from backend)
    const [filteredArticles, setFilteredArticles] = useState<ArticleResource[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // State for available filters (categories/countries from backend)
    const [availableFilters, setAvailableFilters] = useState<{
        categories: { name: string; count: number }[];
        countries: { name: string; count: number }[];
    }>({
        categories: [],
        countries: [],
    });

    // State for status counts (from backend)
    const [counts, setCounts] = useState({
        all: 0,
        published: 0,
        being_processed: 0,
        pending: 0,
        edited: 0,
        rejected: 0,
        deleted: 0,
    });

    // Multi-select for Being Processed tab (Move to DB)
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [isMovingToDb, setIsMovingToDb] = useState(false);
    const [moveResult, setMoveResult] = useState<{ inserted: number; failed: number } | null>(null);
    const selectAllRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        const fetchArticles = async () => {
            setIsLoading(true);
            try {
                // Map frontend tab ids to backend status: pending_review -> 'pending review'
                const statusParam = filters.status === 'all' ? undefined
                    : filters.status === 'pending_review' ? 'pending review'
                        : filters.status;

                const apiFilters = {
                    status: statusParam,
                    category: filters.category === '' ? undefined : filters.category,
                    country: filters.country === '' ? undefined : filters.country,
                    city: filters.city === '' ? undefined : filters.city,
                    search: searchQuery || undefined,
                    page: pagination.currentPage,
                    per_page: 5
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
                        being_processed: Number(status_counts.being_processed ?? 0),
                        pending: Number(status_counts.pending ?? 0),
                        edited: Number(status_counts.edited ?? 0),
                        rejected: Number(status_counts.rejected ?? 0),
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

    // Clear selection when switching away from Being Processed
    useEffect(() => {
        if (filters.status !== 'being_processed') {
            setSelectedIds(new Set());
            setMoveResult(null);
        }
    }, [filters.status]);

    // Indeterminate state for "Select all" when only some selected
    useEffect(() => {
        const el = selectAllRef.current;
        if (!el || filters.status !== 'being_processed') return;
        const pageIds = filteredArticles.map((a) => a.id).filter(Boolean);
        const some = selectedIds.size > 0;
        const all = pageIds.length > 0 && selectedIds.size === pageIds.length;
        el.indeterminate = some && !all;
    }, [filters.status, selectedIds, filteredArticles]);

    const handleToggleSelect = (id: string, checked: boolean) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (checked) next.add(id);
            else next.delete(id);
            return next;
        });
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(new Set(filteredArticles.map((a) => a.id).filter(Boolean)));
        } else {
            setSelectedIds(new Set());
        }
    };

    const handleMoveToDb = async () => {
        if (selectedIds.size === 0) return;
        setIsMovingToDb(true);
        setMoveResult(null);
        try {
            const { moveArticlesToDb } = await import("@/lib/api-v2/admin/service/article/moveArticlesToDb");
            const res = await moveArticlesToDb(Array.from(selectedIds));
            const { inserted, failed } = res.data;
            setMoveResult({ inserted: inserted.length, failed: failed.length });
            setSelectedIds(new Set());
            // Refetch current list and counts
            const response = await getAdminArticles({
                status: 'being_processed',
                category: filters.category === '' ? undefined : filters.category,
                country: filters.country === '' ? undefined : filters.country,
                search: searchQuery || undefined,
                page: pagination.currentPage,
                per_page: 5,
            } as any);
            const { data, status_counts: sc } = response.data;
            setFilteredArticles(data ?? []);
            if (sc) {
                setCounts({
                    all: Number(sc.all),
                    published: Number(sc.published),
                    being_processed: Number(sc.being_processed ?? 0),
                    pending: Number(sc.pending ?? 0),
                    edited: Number(sc.edited ?? 0),
                    rejected: Number(sc.rejected ?? 0),
                    deleted: Number(sc.deleted || 0),
                });
            }
        } catch (err) {
            console.error("Move to DB failed:", err);
            setMoveResult({ inserted: 0, failed: selectedIds.size });
        } finally {
            setIsMovingToDb(false);
        }
    };

    return (
        <div className="p-8 bg-[#f9fafb] min-h-screen">
            <AdminPageHeader
                title="Article Management"
                description="Manage and review all articles across the platform"
                actionLabel="New Article"
                onAction={() => setIsCreateModalOpen(true)}
                actionIcon={Plus}
            />


            <ScraperControlPanel />

            <div className="bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden shadow-[0px_1px_3px_rgba(0,0,0,0.05)]">
                <ArticlesTabs
                    activeTab={filters.status as ArticleTab}
                    setActiveTab={handleSetStatus}
                    counts={counts}
                />

                <ArticlesFilters
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    categoryFilter={filters.category}
                    setCategoryFilter={handleSetCategory}
                    countryFilter={filters.country}
                    cityFilter={filters.city}
                    setFilters={setFilters}
                    availableCategories={availableFilters.categories}
                    availableCountries={availableFilters.countries}
                />

                {/* Being Processed: bulk Move to DB bar */}
                {filters.status === 'being_processed' && filteredArticles.length > 0 && (
                    <div className="flex items-center justify-between gap-4 px-5 py-3 border-b border-[#e5e7eb] bg-amber-50/50">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                ref={selectAllRef}
                                checked={selectedIds.size > 0 && selectedIds.size === filteredArticles.filter((a) => a.id).length}
                                onChange={(e) => handleSelectAll(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 text-[#1428AE] focus:ring-[#1428AE]"
                            />
                            <span className="text-[14px] font-medium text-[#374151]">Select all on this page</span>
                        </label>
                        <div className="flex items-center gap-3">
                            {moveResult !== null && (
                                <span className="text-[14px] text-[#059669]">
                                    {moveResult.inserted} moved to Pending Review
                                    {moveResult.failed > 0 && <span className="text-amber-600">, {moveResult.failed} failed</span>}
                                </span>
                            )}
                            <button
                                type="button"
                                onClick={handleMoveToDb}
                                disabled={selectedIds.size === 0 || isMovingToDb}
                                className="px-4 py-2 rounded-lg bg-[#1428AE] text-white text-[14px] font-semibold hover:bg-[#000785] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isMovingToDb ? 'Moving…' : `Move to DB (${selectedIds.size})`}
                            </button>
                        </div>
                    </div>
                )}

                <div className="flex flex-col">
                    {isLoading ? (
                        <ArticlesSkeleton />
                    ) : filteredArticles.length > 0 ? (
                        filteredArticles.slice(0, 5).map((article) => (
                            <ArticleListItem
                                key={article.id}
                                article={article}
                                onClick={() => {
                                    const currentPath = window.location.pathname + window.location.search;
                                    router.push(`/admin/articles/${article.id}?from=${encodeURIComponent(currentPath)}`);
                                }}
                                selection={filters.status === 'being_processed' ? {
                                    isSelected: selectedIds.has(article.id),
                                    onSelect: (checked) => handleToggleSelect(article.id, checked),
                                } : undefined}
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

            {/* Create Article Modal */}
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
