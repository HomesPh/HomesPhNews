"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AdminPageHeader from "@/components/features/admin/shared/AdminPageHeader";
import { Plus, Trash, Play, Square, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
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
import { triggerScraper, stopScraper, setSchedulerOff, setSchedulerOn, getScraperStatus } from "@/lib/api-v2/admin/service/scraperRun";
import type { TriggerScraperResponse, ScraperResultItem } from "@/lib/api-v2/admin/service/scraperRun";

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
};

/**
 * ArticlesPage component for the admin dashboard
 */
export default function ArticlesPage() {
    const router = useRouter();

    // URL-synced filters (status, category, country)
    const { filters, setFilter } = useUrlFilters(URL_FILTERS_CONFIG);

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

    // Scraper control (manual run + status)
    const [isScraperLoading, setIsScraperLoading] = useState(false);
    const [lastCrawlResult, setLastCrawlResult] = useState<TriggerScraperResponse | null>(null);
    const [scraperError, setScraperError] = useState<string | null>(null);
    const [articlesRefreshKey, setArticlesRefreshKey] = useState(0);
    const [schedulerEnabled, setSchedulerEnabled] = useState<boolean | null>(null);
    const [schedulerToggling, setSchedulerToggling] = useState(false);

    const runScraperNow = useCallback(async () => {
        setScraperError(null);
        setLastCrawlResult(null);
        setIsScraperLoading(true);
        try {
            const result = await triggerScraper();
            setLastCrawlResult(result);
            setArticlesRefreshKey((k) => k + 1); // Refetch articles so new crawl shows up
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Failed to run scraper.";
            setScraperError(message);
        } finally {
            setIsScraperLoading(false);
        }
    }, []);

    const requestStopScraper = useCallback(async () => {
        try {
            await stopScraper();
            // Loading will clear when the server returns (job stops after current batch)
        } catch (err) {
            console.error("Failed to request stop:", err);
        }
    }, []);

    // Fetch scheduler on/off status on mount
    useEffect(() => {
        getScraperStatus()
            .then((s) => setSchedulerEnabled(s.scheduler_enabled ?? true))
            .catch(() => setSchedulerEnabled(null));
    }, []);

    const turnOffSchedule = useCallback(async () => {
        setSchedulerToggling(true);
        try {
            await setSchedulerOff();
            setSchedulerEnabled(false);
        } catch (err) {
            console.error("Failed to turn off schedule:", err);
        } finally {
            setSchedulerToggling(false);
        }
    }, []);

    const turnOnSchedule = useCallback(async () => {
        setSchedulerToggling(true);
        try {
            await setSchedulerOn();
            setSchedulerEnabled(true);
        } catch (err) {
            console.error("Failed to turn on schedule:", err);
        } finally {
            setSchedulerToggling(false);
        }
    }, []);

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
    }, [filters, searchQuery, pagination.currentPage, articlesRefreshKey]);

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

    const crawlSummary = lastCrawlResult?.results?.length
        ? lastCrawlResult.results
            .filter((r: ScraperResultItem) => r.status === "success" && (r.count != null || r.country))
            .slice(0, 8)
            .map((r: ScraperResultItem) => (r.country && r.category ? `${r.country}/${r.category}: ${r.count ?? 0}` : r.message ?? ""))
            .filter(Boolean)
        : [];

    return (
        <div className="p-8 bg-[#f9fafb] min-h-screen">
            <AdminPageHeader
                title="Article Management"
                description="Manage and review all articles across the platform"
                actionLabel="New Article"
                onAction={() => setIsCreateModalOpen(true)}
                actionIcon={Plus}
            />

            {/* Scraper control: Schedule on/off + Run now + loading + last crawl result */}
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-xl border border-[#e5e7eb] bg-white shadow-[0px_1px_3px_rgba(0,0,0,0.05)]">
                <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[14px] font-semibold text-[#111827]">News Scraper</span>
                        {schedulerEnabled !== null && (
                            <span className="text-[13px] text-[#6b7280]">
                                (Automatic: {schedulerEnabled ? "On" : "Off"})
                            </span>
                        )}
                        {isScraperLoading && (
                            <span className="inline-flex items-center gap-1.5 text-amber-600 text-[13px]">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Running… crawl may take several minutes
                            </span>
                        )}
                    </div>
                    {scraperError && (
                        <p className="text-red-600 text-[13px] flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            {scraperError}
                        </p>
                    )}
                    {!isScraperLoading && lastCrawlResult && (
                        <div className="text-[13px] text-[#374151]">
                            <p className="flex items-center gap-1.5 text-green-700">
                                <CheckCircle2 className="w-4 h-4 shrink-0" />
                                {lastCrawlResult.message}
                            </p>
                            {crawlSummary.length > 0 && (
                                <p className="mt-1 text-[#6b7280] truncate" title={crawlSummary.join(", ")}>
                                    {crawlSummary.join(" · ")}
                                </p>
                            )}
                        </div>
                    )}
                </div>
                <div className="shrink-0 flex items-center gap-2 flex-wrap">
                    {schedulerEnabled !== null && (
                        schedulerEnabled ? (
                            <button
                                type="button"
                                onClick={turnOffSchedule}
                                disabled={schedulerToggling}
                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#e5e7eb] bg-gray-50 text-[13px] font-medium text-[#374151] hover:bg-gray-100 disabled:opacity-60 transition-colors"
                            >
                                {schedulerToggling ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                                Turn off schedule
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={turnOnSchedule}
                                disabled={schedulerToggling}
                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-green-200 bg-green-50 text-[13px] font-medium text-green-700 hover:bg-green-100 disabled:opacity-60 transition-colors"
                            >
                                {schedulerToggling ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                                Turn on schedule
                            </button>
                        )
                    )}
                    {isScraperLoading ? (
                        <button
                            type="button"
                            onClick={requestStopScraper}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-amber-500 text-amber-700 bg-amber-50 text-[14px] font-semibold hover:bg-amber-100 transition-colors"
                        >
                            <Square className="w-4 h-4" />
                            Stop scraper
                        </button>
                    ) : null}
                    <button
                        type="button"
                        onClick={runScraperNow}
                        disabled={isScraperLoading}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#C10007] text-white text-[14px] font-semibold hover:bg-[#A00006] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                    >
                        {isScraperLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Running…
                            </>
                        ) : (
                            <>
                                <Play className="w-4 h-4" />
                                Run scraper now
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="mt-6 bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden shadow-[0px_1px_3px_rgba(0,0,0,0.05)]">
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

                {/* Being Processed: bulk Move to DB bar */}
                {filters.status === 'being_processed' && filteredArticles.length > 0 && (
                    <div className="flex items-center justify-between gap-4 px-5 py-3 border-b border-[#e5e7eb] bg-amber-50/50">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                ref={selectAllRef}
                                checked={selectedIds.size > 0 && selectedIds.size === filteredArticles.filter((a) => a.id).length}
                                onChange={(e) => handleSelectAll(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 text-[#C10007] focus:ring-[#C10007]"
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
                                className="px-4 py-2 rounded-lg bg-[#C10007] text-white text-[14px] font-semibold hover:bg-[#a00006] disabled:opacity-50 disabled:cursor-not-allowed"
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
