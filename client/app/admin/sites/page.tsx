"use client";

import { useState, useEffect, useCallback } from 'react';
import AdminPageHeader from "@/components/features/admin/shared/AdminPageHeader";
import StatCard from "@/components/features/admin/shared/StatCard";
import SitesFilters from "@/components/features/admin/sites/SitesFilters";
import SiteListItem from "@/components/features/admin/sites/SiteListItem";
import SiteEditorModal from "@/components/features/admin/sites/SiteEditorModal";
import Pagination from "@/components/features/admin/shared/Pagination";
import { getSites, createSite, updateSite, deleteSite, toggleSiteStatus, Site } from "@/lib/api/admin/sites";
import useUrlFilters from '@/hooks/useUrlFilters';
import usePagination from '@/hooks/usePagination';
import { Plus, CheckCircle, XCircle, Link as LinkIcon, Users, Loader2 } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

// URL Filter configuration
const URL_FILTERS_CONFIG = {
    status: {
        default: 'all' as string,
        resetValues: ['all']
    },
    search: {
        default: '',
    }
};

export default function SitesPage() {
    // URL-synced filters
    const { filters, setFilter } = useUrlFilters(URL_FILTERS_CONFIG);
    const activeTab = filters.status as 'all' | 'active' | 'suspended';

    // Local state
    const [isLoading, setIsLoading] = useState(true);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editingSite, setEditingSite] = useState<Site | undefined>(undefined);
    const [sitesList, setSitesList] = useState<Site[]>([]);
    const [counts, setCounts] = useState({ all: 0, active: 0, suspended: 0 });

    // Pagination
    const pagination = usePagination({ totalPages: 1 });

    // Fetch Data
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await getSites({
                status: activeTab,
                search: filters.search
            });
            setSitesList(response.data);
            setCounts(response.counts);
            // In a real paginated API, we'd update totalPages here from response meta
        } catch (error) {
            console.error("Failed to fetch sites:", error);
        } finally {
            setIsLoading(false);
        }
    }, [activeTab, filters.search]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Calculate total articles and monthly views (client-side aggregation for now)
    const totalArticles = sitesList.reduce((sum, site) => sum + site.articles, 0);
    const totalMonthlyViews = sitesList.reduce((sum, site) => {
        const viewsStr = String(site.monthlyViews || '0');
        const views = parseInt(viewsStr.replace(/,/g, '')) || 0;
        return sum + views;
    }, 0);

    const handleToggleStatus = async (id: number) => {
        const site = sitesList.find(s => s.id === id);
        if (site) {
            const action = site.status === 'active' ? 'suspend' : 'activate';
            if (confirm(`Are you sure you want to ${action} ${site.name}?`)) {
                try {
                    await toggleSiteStatus(id);
                    fetchData(); // Refresh list
                } catch (error) {
                    console.error("Failed to toggle status:", error);
                    alert("Failed to update status. Please try again.");
                }
            }
        }
    };

    const handleDeleteSite = async (id: number) => {
        const site = sitesList.find(s => s.id === id);
        if (site && confirm(`Are you sure you want to delete ${site.name}? This action cannot be undone.`)) {
            try {
                await deleteSite(id);
                fetchData(); // Refresh
            } catch (error) {
                console.error("Failed to delete site:", error);
                alert("Failed to delete site.");
            }
        }
    };

    const handleSaveSite = async (data: any) => {
        try {
            if (editingSite) {
                await updateSite(editingSite.id, data);
            } else {
                await createSite(data);
            }
            setIsEditorOpen(false);
            fetchData(); // Refresh
        } catch (error) {
            console.error("Failed to save site:", error);
            alert("Failed to save site details.");
        }
    };

    return (
        <div className="p-8 bg-[#f9fafb] min-h-screen">
            <AdminPageHeader
                title="Sites Management"
                description="Manage partner sites and syndication connections"
                actionLabel="Add Partner Site"
                onAction={() => {
                    setEditingSite(undefined);
                    setIsEditorOpen(true);
                }}
                actionIcon={Plus}
            />

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {isLoading ? (
                    Array(4).fill(0).map((_, i) => (
                        <Skeleton key={i} className="h-[120px] rounded-xl bg-white" />
                    ))
                ) : (
                    <>
                        <StatCard
                            title="Active Partners"
                            value={counts.active}
                            trend="Connected & Publishing"
                            iconName="CheckCircle"
                            iconColor="text-[#10b981]"
                        />
                        <StatCard
                            title="Suspended"
                            value={counts.suspended}
                            trend="Temporarily Inactive"
                            iconName="XCircle"
                            iconColor="text-[#ef4444]"
                        />
                        <StatCard
                            title="Total Articles Shared"
                            value={totalArticles.toLocaleString()}
                            trend="Across all partners"
                            iconName="Link"
                            iconColor="text-[#3b82f6]"
                        />
                        <StatCard
                            title="Total Monthly Reach"
                            value={`${(totalMonthlyViews / 1000000).toFixed(1)}M`}
                            trend="Combined views/month"
                            iconName="Users"
                            iconColor="text-[#8b5cf6]"
                        />
                    </>
                )}
            </div>

            {/* Filters and Search */}
            <SitesFilters
                searchQuery={filters.search}
                setSearchQuery={(val) => setFilter('search', val)}
                activeTab={activeTab}
                setActiveTab={(val) => setFilter('status', val)}
                counts={counts}
            />

            {/* Sites List */}
            <div className="space-y-4">
                {isLoading ? (
                    Array(3).fill(0).map((_, i) => (
                        <Skeleton key={i} className="h-[100px] rounded-lg bg-white" />
                    ))
                ) : sitesList.length > 0 ? (
                    sitesList.map((site) => (
                        <SiteListItem
                            key={site.id}
                            site={site}
                            onToggleStatus={handleToggleStatus}
                            onDelete={handleDeleteSite}
                            onEdit={(site: any) => {
                                setEditingSite(site as Site);
                                setIsEditorOpen(true);
                            }}
                            onRefreshKey={async (id) => {
                                if (confirm(`Are you sure you want to regenerate the API key for ${site.name}? The old key will stop working immediately.`)) {
                                    try {
                                        const updatedSite = await import('@/lib/api/admin/sites').then(m => m.refreshSiteKey(id));
                                        setSitesList(prev => prev.map(s => s.id === id ? updatedSite : s));
                                        alert("API Key regenerated successfully.");
                                    } catch (error) {
                                        console.error("Failed to refresh key:", error);
                                        alert("Failed to regenerate API Key.");
                                    }
                                }
                            }}
                        />
                    ))
                ) : (
                    <div className="bg-white border border-[#e5e7eb] rounded-[12px] p-20 text-center">
                        <p className="text-[#6b7280] text-[16px]">No partner sites found matching your criteria.</p>
                    </div>
                )}
            </div>

            {/* Pagination Component */}
            <div className="mt-8">
                <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={pagination.handlePageChange}
                />
            </div>

            {/* Site Editor Modal */}
            <SiteEditorModal
                isOpen={isEditorOpen}
                onClose={() => setIsEditorOpen(false)}
                mode={editingSite ? 'edit' : 'create'}
                initialData={editingSite}
                onSave={handleSaveSite}
            />
        </div>
    );
}

