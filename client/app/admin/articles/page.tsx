"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AdminPageHeader from "@/components/features/admin/shared/AdminPageHeader";
import { Plus, Trash, Check, CheckCircle2, Loader2, X, XCircle, AlertTriangle } from 'lucide-react';
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
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getSiteNames } from "@/lib/api-v2/admin/service/sites/getSiteNames";
import { bulkPublishArticles } from "@/lib/api-v2/admin/service/article/bulkPublishArticles";
import { bulkUnpublishArticles } from "@/lib/api-v2/admin/service/article/bulkUnpublishArticles";
import { bulkDeleteArticles } from "@/lib/api-v2/admin/service/article/bulkDeleteArticles";
import { bulkRejectArticles } from "@/lib/api-v2/admin/service/article/bulkRejectArticles";
import { useAlert } from "@/hooks/useAlert";

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
    const { showAlert, showConfirm } = useAlert();

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
        cities: { name: string; count: number }[];
    }>({
        categories: [],
        countries: [],
        cities: [],
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

    // Multi-select for global bulk actions
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [isMovingToDb, setIsMovingToDb] = useState(false);
    const [moveResult, setMoveResult] = useState<{ inserted: number; failed: number } | null>(null);
    const selectAllRef = useRef<HTMLInputElement>(null);

    // Bulk actions state
    const [isBulkActionLoading, setIsBulkActionLoading] = useState(false);
    const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedSites, setSelectedSites] = useState<string[]>([]);
    const [siteNames, setSiteNames] = useState<string[]>([]);
    const [isHardDelete, setIsHardDelete] = useState(false);

    // Fetch site names for publish modal
    useEffect(() => {
        const fetchSites = async () => {
            try {
                const response = await getSiteNames();
                setSiteNames(response.data);
            } catch (err) {
                console.error("Failed to fetch site names:", err);
            }
        };
        if (isPublishModalOpen) {
            fetchSites();
        }
    }, [isPublishModalOpen]);
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

    // Clear selection when switching tabs
    useEffect(() => {
        setSelectedIds(new Set());
        setMoveResult(null);
    }, [filters.status]);

    // Indeterminate state for "Select all" when only some selected
    useEffect(() => {
        const pageIds = filteredArticles.map((a) => a.id).filter(Boolean);
        const some = selectedIds.size > 0;
        const all = pageIds.length > 0 && pageIds.every(id => selectedIds.has(id));
        if (selectAllRef.current) {
            selectAllRef.current.indeterminate = some && !all;
        }
    }, [selectedIds, filteredArticles]);

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

    const handleBulkPublish = async () => {
        if (selectedIds.size === 0 || selectedSites.length === 0) return;
        setIsBulkActionLoading(true);
        try {
            await bulkPublishArticles(Array.from(selectedIds), selectedSites);
            setIsPublishModalOpen(false);
            setSelectedIds(new Set());
            setSelectedSites([]);
            router.refresh(); // Or better yet, trigger the fetchArticles logic
            window.location.reload(); // Refresh to update everything
        } catch (err) {
            console.error("Bulk publish failed:", err);
            showAlert("Error", "Failed to publish articles.");
        } finally {
            setIsBulkActionLoading(false);
        }
    };

    const handleBulkDelete = async () => {
        if (selectedIds.size === 0) return;
        setIsBulkActionLoading(true);
        try {
            await bulkDeleteArticles(Array.from(selectedIds), isHardDelete);
            setIsDeleteModalOpen(false);
            setSelectedIds(new Set());
            window.location.reload();
        } catch (err) {
            console.error("Bulk delete failed:", err);
            showAlert("Error", "Failed to delete articles.");
        } finally {
            setIsBulkActionLoading(false);
        }
    };

    const handleBulkUnpublish = async () => {
        if (selectedIds.size === 0) return;
        if (!await showConfirm("Unpublish Articles", `Are you sure you want to unpublish ${selectedIds.size} articles? They will be moved back to Pending Review.`)) return;
        setIsBulkActionLoading(true);
        try {
            await bulkUnpublishArticles(Array.from(selectedIds));
            setSelectedIds(new Set());
            window.location.reload();
        } catch (err) {
            console.error("Bulk unpublish failed:", err);
            showAlert("Error", "Failed to unpublish articles.");
        } finally {
            setIsBulkActionLoading(false);
        }
    };

    const handleBulkReject = async () => {
        if (selectedIds.size === 0) return;
        if (!await showConfirm("Reject Articles", `Are you sure you want to reject ${selectedIds.size} articles?`)) return;
        setIsBulkActionLoading(true);
        try {
            await bulkRejectArticles(Array.from(selectedIds));
            setSelectedIds(new Set());
            window.location.reload();
        } catch (err) {
            console.error("Bulk reject failed:", err);
            showAlert("Error", "Failed to reject articles.");
        } finally {
            setIsBulkActionLoading(false);
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
                    availableCities={availableFilters.cities}
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

                {/* Global Bulk Actions Bar */}
                {filters.status !== 'being_processed' && filters.status !== 'all' && filteredArticles.length > 0 && (
                    <div className="flex items-center justify-between gap-4 px-5 py-3 border-b border-[#e5e7eb] bg-[#f9fafb]">
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    ref={selectAllRef}
                                    checked={selectedIds.size > 0 && selectedIds.size === filteredArticles.filter((a) => a.id).length}
                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-300 text-[#1428AE] focus:ring-[#1428AE]"
                                />
                                <span className="text-[14px] font-semibold text-[#4b5563]">Select All</span>
                            </label>
                            {selectedIds.size > 0 && (
                                <div className="bg-[#1428AE]/10 text-[#1428AE] px-2 py-0.5 rounded text-[11px] font-black uppercase tracking-wider">
                                    {selectedIds.size} Selected
                                </div>
                            )}
                        </div>

                        {selectedIds.size > 0 && (
                            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2">
                                {filters.status === 'edited' ? (
                                    <button
                                        onClick={handleBulkReject}
                                        disabled={isBulkActionLoading}
                                        className="flex items-center gap-2 h-9 px-4 rounded-lg text-[13px] font-bold text-amber-600 border border-amber-100 hover:bg-amber-50 transition-all shadow-sm active:scale-95"
                                    >
                                        {isBulkActionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                                        GROUP REJECT
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => {
                                            setIsHardDelete(filters.status === 'deleted');
                                            setIsDeleteModalOpen(true);
                                        }}
                                        className="flex items-center gap-2 h-9 px-4 rounded-lg text-[13px] font-bold text-red-600 border border-red-100 hover:bg-red-50 transition-all shadow-sm active:scale-95"
                                    >
                                        <Trash className="w-4 h-4" />
                                        {filters.status === 'deleted' ? 'PERMANENT DELETE' : 'GROUP DELETE'}
                                    </button>
                                )}

                                {filters.status !== 'rejected' && filters.status !== 'deleted' && (
                                    filters.status === 'published' ? (
                                        <button
                                            onClick={handleBulkUnpublish}
                                            disabled={isBulkActionLoading}
                                            className="flex items-center gap-2 h-9 px-4 rounded-lg text-[13px] font-bold bg-amber-500 text-white hover:bg-amber-600 transition-all shadow-sm active:scale-95"
                                        >
                                            {isBulkActionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                                            GROUP UNPUBLISH
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => setIsPublishModalOpen(true)}
                                            className="flex items-center gap-2 h-9 px-4 rounded-lg text-[13px] font-bold bg-[#1428AE] text-white hover:bg-[#000785] transition-all shadow-sm active:scale-95"
                                        >
                                            <CheckCircle2 className="w-4 h-4" />
                                            GROUP PUBLISH
                                        </button>
                                    )
                                )}
                            </div>
                        )}
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
                                selection={filters.status !== 'all' ? {
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

            {/* Group Publish Modal */}
            <Dialog open={isPublishModalOpen} onOpenChange={setIsPublishModalOpen}>
                <DialogContent className="max-w-[650px] p-0 overflow-hidden rounded-[16px] border-none shadow-2xl">
                    <div className="flex flex-col h-full bg-white">
                        {/* Header */}
                        <div className="px-8 pt-8 pb-6 bg-[#f8fafc] border-b border-[#e2e8f0]">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="bg-[#3b82f6]/10 p-2 rounded-full">
                                    <CheckCircle2 className="w-6 h-6 text-[#3b82f6]" />
                                </div>
                                <DialogTitle className="text-[24px] font-bold text-[#1e293b] tracking-tight">Group Publish Articles</DialogTitle>
                            </div>
                            <DialogDescription className="text-[#64748b] text-[15px]">You have selected <span className="font-bold text-[#3b82f6]">{selectedIds.size}</span> articles. Please select the partner sites where you want to publish them.</DialogDescription>
                        </div>

                        {/* Content */}
                        <div className="p-8 max-h-[400px] overflow-y-auto custom-scrollbar">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-[14px] font-black text-[#64748b] uppercase tracking-[1px]">Partner Sites</h3>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setSelectedSites(siteNames)}
                                            className="text-[12px] font-bold text-[#3b82f6] hover:underline"
                                        >
                                            Select All
                                        </button>
                                        <span className="text-gray-300">|</span>
                                        <button
                                            onClick={() => setSelectedSites([])}
                                            className="text-[12px] font-bold text-[#64748b] hover:underline"
                                        >
                                            Clear
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    {siteNames.length > 0 ? (
                                        siteNames.map((siteName) => {
                                            const isSelected = selectedSites.includes(siteName);
                                            return (
                                                <div
                                                    key={siteName}
                                                    onClick={() => {
                                                        setSelectedSites(prev =>
                                                            isSelected ? prev.filter(s => s !== siteName) : [...prev, siteName]
                                                        );
                                                    }}
                                                    className={`flex items-center justify-between p-4 rounded-[12px] border-2 transition-all cursor-pointer ${isSelected
                                                        ? 'border-[#3b82f6] bg-[#eff6ff] shadow-sm'
                                                        : 'border-[#f1f5f9] bg-white hover:border-gray-200'
                                                        }`}
                                                >
                                                    <span className={`text-[15px] font-semibold ${isSelected ? 'text-[#1d4ed8]' : 'text-[#334155]'}`}>
                                                        {siteName}
                                                    </span>
                                                    {isSelected && (
                                                        <div className="bg-[#3b82f6] rounded-full p-1 shadow-sm">
                                                            <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="col-span-2 text-center py-12 bg-[#f8fafc] rounded-[16px] border-2 border-dashed border-[#e2e8f0]">
                                            <Loader2 className="w-6 h-6 animate-spin text-[#94a3b8] mx-auto mb-2" />
                                            <p className="text-[14px] text-[#64748b] font-medium uppercase tracking-wider">Loading available sites...</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-8 py-6 border-t border-[#e2e8f0] flex items-center justify-end gap-3 bg-[#f8fafc]">
                            <button
                                onClick={() => setIsPublishModalOpen(false)}
                                className="h-[44px] px-6 font-semibold text-[15px] text-[#64748b] hover:text-[#1e293b] transition-colors"
                            >
                                Cancel
                            </button>
                            <Button
                                onClick={handleBulkPublish}
                                disabled={selectedSites.length === 0 || isBulkActionLoading}
                                className="h-[44px] px-8 bg-[#3b82f6] text-white rounded-[10px] font-bold text-[15px] hover:bg-[#2563eb] transition-all active:scale-95 shadow-lg shadow-blue-500/20 disabled:opacity-50"
                            >
                                {isBulkActionLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                ) : null}
                                Publish to {selectedSites.length} Sites
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Group Delete Confirmation Modal */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent className="max-w-[450px] p-0 overflow-hidden rounded-[20px] border-none shadow-2xl">
                    <div className="flex flex-col bg-white">
                        <div className="p-8 pb-6">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
                                <AlertTriangle className="w-8 h-8 text-red-500" />
                            </div>
                            <DialogTitle className="text-[22px] font-bold text-[#1e293b] mb-2">Delete Articles?</DialogTitle>
                            <DialogDescription className="text-[#64748b] text-[16px] leading-relaxed">
                                You are about to delete <span className="font-bold text-red-600">{selectedIds.size}</span> selected articles. This action {isHardDelete ? 'CANNOT be undone.' : 'will move them to the Deleted tab.'}
                            </DialogDescription>
                        </div>
                        <div className="px-8 py-6 bg-[#fffcfc] border-t border-red-50 flex flex-col gap-3">
                            <Button
                                onClick={handleBulkDelete}
                                disabled={isBulkActionLoading}
                                className="w-full h-[50px] bg-red-600 hover:bg-red-700 text-white font-bold rounded-[12px] shadow-lg shadow-red-500/20 active:scale-[0.98] transition-all"
                            >
                                {isBulkActionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                {isHardDelete ? 'PERMANENTLY DELETE' : 'CONFIRM DELETE'}
                            </Button>
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="w-full h-[50px] text-[#64748b] font-semibold hover:text-[#1e293b] transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f5f9;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
            `}</style>
        </div>
    );
}
