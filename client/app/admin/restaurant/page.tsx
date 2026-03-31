"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import AdminPageHeader from "@/components/features/admin/shared/AdminPageHeader";
import { Plus, Search, Filter, RefreshCcw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { getAdminRestaurants } from "@/lib/api-v2/admin/service/restaurant/getAdminRestaurants";
import type { RestaurantSummary } from "@/lib/api-v2/types/RestaurantResource";
import RestaurantListItem from "@/components/features/admin/restaurant/RestaurantListItem";
import RestaurantsTabs, { type RestaurantTab } from "@/components/features/admin/restaurant/RestaurantsTabs";
import RestaurantEditorModal from "@/components/features/admin/restaurant/RestaurantEditorModal";
import RestaurantFilters from "@/components/features/admin/restaurant/RestaurantFilters";
import usePagination from "@/hooks/usePagination";
import Pagination from "@/components/features/admin/shared/Pagination";
import useUrlFilters, { type FiltersConfig } from "@/hooks/useUrlFilters";
import { CheckCircle2, Trash, XCircle, Loader2, AlertTriangle, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { getSiteNames } from "@/lib/api-v2/admin/service/sites/getSiteNames";
import { bulkPublishRestaurants } from "@/lib/api-v2/admin/service/restaurant/bulkPublishRestaurants";
import { bulkUnpublishRestaurants } from "@/lib/api-v2/admin/service/restaurant/bulkUnpublishRestaurants";
import { bulkDeleteRestaurants } from "@/lib/api-v2/admin/service/restaurant/bulkDeleteRestaurants";
import { bulkRejectRestaurants } from "@/lib/api-v2/admin/service/restaurant/bulkRejectRestaurants";
import { useAlert } from "@/hooks/useAlert";

type RestaurantFilters = {
    status: RestaurantTab | 'draft';
    category: string;
    country: string;
    city: string;
};

const URL_FILTERS_CONFIG: FiltersConfig<RestaurantFilters> = {
    status: { default: 'all', resetValues: ['all'] },
    category: { default: '', resetValues: [''] },
    country: { default: '', resetValues: [''] },
    city: { default: '', resetValues: [''] },
};

export default function RestaurantPage() {
    const router = useRouter();
    const { filters, setFilter, setFilters } = useUrlFilters(URL_FILTERS_CONFIG);
    const { showAlert, showConfirm } = useAlert();

    const [pageKey, setPageKey] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const [filteredRestaurants, setFilteredRestaurants] = useState<RestaurantSummary[]>([]);

    // Pagination
    const pagination = usePagination({ totalPages: 1 });

    const [counts, setCounts] = useState({
        all: 0,
        published: 0,
        being_processed: 0,
        pending: 0,
        deleted: 0
    });

    const [availableFilters, setAvailableFilters] = useState<{
        categories: { name: string; count: number }[];
        countries: { name: string; count: number }[];
    }>({ categories: [], countries: [] });

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

    useEffect(() => {
        if (filters.status === 'draft') setFilter('status', 'being_processed');
    }, []);

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
        setSelectedIds(new Set());
        setMoveResult(null);
    }, [filters.status]);

    const handleToggleSelect = (id: string, checked: boolean) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (checked) next.add(id); else next.delete(id);
            return next;
        });
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) setSelectedIds(new Set(filteredRestaurants.map(r => r.id).filter(Boolean)));
        else setSelectedIds(new Set());
    };

    const handleMoveToDb = async () => {
        if (selectedIds.size === 0) return;
        setIsMovingToDb(true);
        setMoveResult(null);
        try {
            const { moveRestaurantsToDb } = await import("@/lib/api-v2/admin/service/restaurant/moveRestaurantsToDb");
            const res = await moveRestaurantsToDb(Array.from(selectedIds));
            const { inserted, failed } = res.data;
            setMoveResult({ inserted: inserted.length, failed: failed.length });
            setSelectedIds(new Set());
            fetchData(); // Refetch
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
            await bulkPublishRestaurants(Array.from(selectedIds), selectedSites);
            setIsPublishModalOpen(false);
            setSelectedIds(new Set());
            setSelectedSites([]);
            fetchData();
        } catch (err) {
            console.error("Bulk publish failed:", err);
            showAlert("Error", "Failed to publish restaurants.");
        } finally {
            setIsBulkActionLoading(false);
        }
    };

    const handleBulkDelete = async () => {
        if (selectedIds.size === 0) return;
        setIsBulkActionLoading(true);
        try {
            await bulkDeleteRestaurants(Array.from(selectedIds), isHardDelete);
            setIsDeleteModalOpen(false);
            setSelectedIds(new Set());
            fetchData();
        } catch (err) {
            console.error("Bulk delete failed:", err);
            showAlert("Error", "Failed to delete restaurants.");
        } finally {
            setIsBulkActionLoading(false);
        }
    };

    const handleBulkUnpublish = async () => {
        if (selectedIds.size === 0) return;
        if (!await showConfirm("Unpublish Restaurants", `Are you sure you want to unpublish ${selectedIds.size} restaurants? They will be moved back to Pending Review.`)) return;
        setIsBulkActionLoading(true);
        try {
            await bulkUnpublishRestaurants(Array.from(selectedIds));
            setSelectedIds(new Set());
            fetchData();
        } catch (err) {
            console.error("Bulk unpublish failed:", err);
            showAlert("Error", "Failed to unpublish restaurants.");
        } finally {
            setIsBulkActionLoading(false);
        }
    };

    const handleBulkReject = async () => {
        if (selectedIds.size === 0) return;
        if (!await showConfirm("Reject Restaurants", `Are you sure you want to reject ${selectedIds.size} restaurants?`)) return;
        setIsBulkActionLoading(true);
        try {
            await bulkRejectRestaurants(Array.from(selectedIds));
            setSelectedIds(new Set());
            fetchData();
        } catch (err) {
            console.error("Bulk reject failed:", err);
            showAlert("Error", "Failed to reject restaurants.");
        } finally {
            setIsBulkActionLoading(false);
        }
    };

    const handleRefresh = () => {
        setPageKey(prev => prev + 1);
    };

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const statusParam = filters.status === 'all' ? undefined : filters.status;
            const apiFilters = {
                status: statusParam,
                category: filters.category === '' ? undefined : filters.category,
                country: filters.country === '' || filters.country === 'All Countries' ? undefined : filters.country,
                city: filters.city === '' ? undefined : filters.city,
                search: searchQuery || undefined,
                page: pagination.currentPage,
                per_page: 10
            } as any;

            const response = await getAdminRestaurants(apiFilters);

            let data: RestaurantSummary[] = [];
            let meta = { current_page: 1, last_page: 1, total: 0 };
            let status_counts = { all: 0, published: 0, being_processed: 0, pending: 0, deleted: 0 };
            let available_filters = { categories: [], countries: [] };

            if (Array.isArray(response.data)) {
                data = response.data;
                status_counts = {
                    all: data.length,
                    published: data.filter((r: any) => r.status === 'published').length,
                    being_processed: data.filter((r: any) => (r as any).is_redis).length,
                    pending: data.filter((r: any) => r.status === 'draft' && !(r as any).is_redis).length,
                    deleted: data.filter((r: any) => r.status === 'deleted').length,
                };
            } else {
                const resData = response.data as any;
                data = resData.data ?? [];
                meta = {
                    current_page: resData.current_page ?? 1,
                    last_page: resData.last_page ?? 1,
                    total: resData.total ?? 0
                };
                if (resData.status_counts) {
                    status_counts = {
                        all: Number(resData.status_counts.all),
                        published: Number(resData.status_counts.published),
                        being_processed: Number(resData.status_counts.being_processed ?? 0),
                        pending: Number(resData.status_counts.pending ?? 0),
                        deleted: Number(resData.status_counts.deleted ?? 0),
                    };
                }
                if (resData.available_filters) {
                    available_filters = resData.available_filters;
                }
            }

            setFilteredRestaurants(data);
            if (!Array.isArray(response.data)) {
                pagination.handlePageChange(meta.current_page);
                pagination.setTotalPages(meta.last_page);
            }
            setCounts(status_counts);
            setAvailableFilters(available_filters);

        } catch (error) {
            console.error("Failed to fetch restaurants:", error);
            setFilteredRestaurants([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => fetchData(), 300);
        return () => clearTimeout(timer);
    }, [filters, searchQuery, pagination.currentPage, pageKey]);

    useEffect(() => {
        const el = selectAllRef.current;
        if (!el) return;
        const pageIds = filteredRestaurants.map(r => r.id).filter(Boolean);
        const some = selectedIds.size > 0;
        const all = pageIds.length > 0 && pageIds.every(id => selectedIds.has(id));
        el.indeterminate = some && !all;
    }, [selectedIds, filteredRestaurants]);

    return (
        <div className="p-8 bg-[#f9fafb] min-h-screen">
            <AdminPageHeader
                title="Restaurant Directory"
                description="Manage restaurant listings, reviews, and details."
                actionLabel="Add New Restaurant"
                onAction={() => setIsCreateModalOpen(true)}
                actionIcon={Plus}
            >
                <Button
                    onClick={handleRefresh}
                    variant="outline"
                    className="h-[50px] border-[#d1d5db] text-gray-500 hover:text-gray-900 bg-white gap-2 px-4"
                >
                    <RefreshCcw className="w-5 h-5" />
                    <span className="font-medium">Refresh</span>
                </Button>
            </AdminPageHeader>

            <div className="bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden shadow-[0px_1px_3px_rgba(0,0,0,0.05)]">
                <RestaurantsTabs
                    activeTab={filters.status as RestaurantTab}
                    setActiveTab={(tab) => {
                        setFilter('status', tab);
                        if (pagination.currentPage !== 1) pagination.handlePageChange(1);
                    }}
                    counts={counts}
                />

                {filters.status === 'being_processed' && filteredRestaurants.length > 0 && (
                    <div className="flex items-center justify-between gap-4 px-5 py-3 border-b border-[#e5e7eb] bg-red-50/50">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                ref={selectAllRef}
                                checked={selectedIds.size > 0 && selectedIds.size === filteredRestaurants.filter(r => r.id).length}
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
                {filters.status !== 'being_processed' && filters.status !== 'all' && filteredRestaurants.length > 0 && (
                    <div className="flex items-center justify-between gap-4 px-5 py-3 border-b border-[#e5e7eb] bg-[#f9fafb]">
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    ref={selectAllRef}
                                    checked={selectedIds.size > 0 && selectedIds.size === filteredRestaurants.filter((a) => a.id).length}
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

                                {filters.status !== 'deleted' && (
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

                <RestaurantFilters
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    categoryFilter={filters.category}
                    setCategoryFilter={(cat) => setFilter('category', cat)}
                    countryFilter={filters.country}
                    cityFilter={filters.city}
                    setFilters={setFilters}
                    availableCategories={availableFilters.categories}
                    availableCountries={availableFilters.countries}
                />

                <div className="flex flex-col">
                    {isLoading ? (
                        <div className="p-8 space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex gap-4 p-4 animate-pulse">
                                    <div className="w-[120px] h-[80px] bg-gray-200 rounded-lg" />
                                    <div className="flex-1 space-y-3">
                                        <div className="h-4 bg-gray-200 rounded w-1/3" />
                                        <div className="h-3 bg-gray-200 rounded w-1/4" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredRestaurants.length > 0 ? (
                        filteredRestaurants.map((restaurant) => (
                            <RestaurantListItem
                                key={restaurant.id}
                                restaurant={restaurant}
                                onClick={() => router.push(`/admin/restaurant/${restaurant.id}`)}
                                selection={filters.status !== 'all' ? {
                                    isSelected: selectedIds.has(restaurant.id),
                                    onSelect: (checked) => handleToggleSelect(restaurant.id, checked),
                                } : undefined}
                            />
                        ))
                    ) : (
                        <div className="p-20 text-center">
                            <p className="text-[#6b7280] text-[16px]">No restaurants found matching your criteria.</p>
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

            {/* Create Modal */}
            <RestaurantEditorModal
                mode="create"
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
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
                                <DialogTitle className="text-[24px] font-bold text-[#1e293b] tracking-tight">Group Publish Restaurants</DialogTitle>
                            </div>
                            <DialogDescription className="text-[#64748b] text-[15px]">You have selected <span className="font-bold text-[#3b82f6]">{selectedIds.size}</span> restaurants. Please select the partner sites where you want to publish them.</DialogDescription>
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
                            <DialogTitle className="text-[22px] font-bold text-[#1e293b] mb-2">Delete Restaurants?</DialogTitle>
                            <DialogDescription className="text-[#64748b] text-[16px] leading-relaxed">
                                You are about to delete <span className="font-bold text-red-600">{selectedIds.size}</span> selected restaurants. This action {isHardDelete ? 'CANNOT be undone.' : 'will move them to the Trash.'}
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
