"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminPageHeader from "@/components/features/admin/shared/AdminPageHeader";
import { Plus, Search, Filter, RefreshCcw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { getAdminRestaurants } from "@/lib/api-v2/admin/service/restaurant/getAdminRestaurants";
import { deleteRestaurant } from "@/lib/api-v2/admin/service/restaurant/deleteRestaurant";
import type { RestaurantSummary } from "@/lib/api-v2/types/RestaurantResource";
import RestaurantListItem from "@/components/features/admin/restaurant/RestaurantListItem";
import RestaurantsTabs, { RestaurantTab } from "@/components/features/admin/restaurant/RestaurantsTabs";
import RestaurantEditorModal from "@/components/features/admin/restaurant/RestaurantEditorModal";
import RestaurantFilters from "@/components/features/admin/restaurant/RestaurantFilters";
import usePagination from "@/hooks/usePagination";

// Reuse generic components if available, otherwise we use standard ones
// Note: Pagination should ideally be reused. For now, we'll keep it simple or import if available.

export default function RestaurantPage() {
    const router = useRouter();

    // State
    const [pageKey, setPageKey] = useState(0); // For forcing refresh
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Data state
    const [restaurants, setRestaurants] = useState<RestaurantSummary[]>([]);
    const [filteredRestaurants, setFilteredRestaurants] = useState<RestaurantSummary[]>([]);

    // Filter state
    const [filters, setFilters] = useState({
        status: 'all' as RestaurantTab,
        category: 'All Category',
        country: 'All Countries'
    });

    // Pagination
    const pagination = usePagination({ totalPages: 1 });

    // Counts for tabs
    const [counts, setCounts] = useState({
        all: 0,
        published: 0,
        draft: 0,
        deleted: 0
    });

    // Helper to update filters
    const setFilter = (key: keyof typeof filters, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        // Reset to page 1 on filter change
        if (pagination.currentPage !== 1) {
            pagination.handlePageChange(1);
        }
    };

    const handleRefresh = () => {
        setPageKey(prev => prev + 1);
    };

    const fetchData = async () => {
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

            const response = await getAdminRestaurants(apiFilters);

            // Handle response structure
            let data = [];
            let meta = { current_page: 1, last_page: 1, total: 0 };
            let status_counts = { all: 0, published: 0, draft: 0, deleted: 0 };

            if (Array.isArray(response.data)) {
                // Legacy/Current simple array response
                data = response.data;
                // Client-side filtering if API doesn't handle it yet
                if (apiFilters.status && apiFilters.status !== 'all') {
                    data = data.filter((r: any) => r.status === apiFilters.status || (apiFilters.status === 'trash' && r.status === 'deleted'));
                }
                // Mock counts with safe fallback for missing status
                status_counts = {
                    all: response.data.length,
                    published: response.data.filter((r: any) => r.status === 'published').length,
                    // If status is missing, we consider it a draft
                    draft: response.data.filter((r: any) => !r.status || r.status === 'draft' || r.status === 'pending').length,
                    deleted: response.data.filter((r: any) => r.status === 'deleted').length,
                };
            } else {
                // Modern paginated response
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
                        draft: Number(resData.status_counts.draft || resData.status_counts.pending || 0),
                        deleted: Number(resData.status_counts.deleted || 0),
                    };
                }
            }

            setFilteredRestaurants(data);

            // Debugging: Log the first restaurant to check fields
            if (data.length > 0) {
                console.log("Restaurant Data Debug:", {
                    firstItem: data[0],
                    hasAvgCost: 'avg_meal_cost' in data[0],
                    avgCostValue: data[0].avg_meal_cost,
                    hasStatus: 'status' in data[0],
                    statusValue: data[0].status
                });
            }

            if (!Array.isArray(response.data)) {
                pagination.handlePageChange(meta.current_page);
                pagination.setTotalPages(meta.last_page);
            }

            // Update counts
            setCounts(status_counts);

        } catch (error) {
            console.error("Failed to fetch restaurants:", error);
            setFilteredRestaurants([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch data with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchData();
        }, 300);

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters, searchQuery, pagination.currentPage, pageKey]);

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
                    setActiveTab={(tab) => setFilter('status', tab)}
                    counts={counts}
                />

                <RestaurantFilters
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    categoryFilter={filters.category}
                    setCategoryFilter={(cat) => setFilter('category', cat)}
                    countryFilter={filters.country}
                    setCountryFilter={(country) => setFilter('country', country)}
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
                            />
                        ))
                    ) : (
                        <div className="p-20 text-center">
                            <p className="text-[#6b7280] text-[16px]">No restaurants found matching your criteria.</p>
                        </div>
                    )}
                </div>
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
