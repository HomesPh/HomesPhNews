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

    useEffect(() => {
        if (filters.status === 'draft') setFilter('status', 'being_processed');
    }, []);

    useEffect(() => {
        if (filters.status !== 'being_processed') {
            setSelectedIds(new Set());
            setMoveResult(null);
        }
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
            const response = await getAdminRestaurants({
                status: 'being_processed',
                page: pagination.currentPage,
                per_page: 5,
            } as any);
            const resData = response.data as any;
            setFilteredRestaurants(resData?.data ?? []);
            if (resData?.status_counts) {
                setCounts({
                    all: Number(resData.status_counts.all),
                    published: Number(resData.status_counts.published),
                    being_processed: Number(resData.status_counts.being_processed ?? 0),
                    pending: Number(resData.status_counts.pending ?? 0),
                    deleted: Number(resData.status_counts.deleted ?? 0),
                });
            }
        } catch (err) {
            console.error("Move to DB failed:", err);
            setMoveResult({ inserted: 0, failed: selectedIds.size });
        } finally {
            setIsMovingToDb(false);
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
                per_page: 5
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
        if (!el || filters.status !== 'being_processed') return;
        const pageIds = filteredRestaurants.map(r => r.id).filter(Boolean);
        const some = selectedIds.size > 0;
        const all = pageIds.length > 0 && selectedIds.size === pageIds.length;
        el.indeterminate = some && !all;
    }, [filters.status, selectedIds, filteredRestaurants]);

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
                    <div className="flex items-center justify-between gap-4 px-5 py-3 border-b border-[#e5e7eb] bg-amber-50/50">
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
                        filteredRestaurants.slice(0, 5).map((restaurant) => (
                            <RestaurantListItem
                                key={restaurant.id}
                                restaurant={restaurant}
                                onClick={() => router.push(`/admin/restaurant/${restaurant.id}`)}
                                selection={filters.status === 'being_processed' ? {
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
        </div>
    );
}
