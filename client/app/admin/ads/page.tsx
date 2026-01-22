"use client";

import { useState, useMemo, useEffect } from 'react';
import AdminPageHeader from "@/components/features/admin/shared/AdminPageHeader";
import StatCard from "@/components/features/admin/shared/StatCard";
import AdsFilters from "@/components/features/admin/ads/AdsFilters";
import AdListItem from "@/components/features/admin/ads/AdListItem";
import AdEditorModal from "@/components/features/admin/ads/AdEditorModal";
import Pagination from "@/components/features/admin/shared/Pagination";
import { adsData, Ad } from "@/app/admin/ads/data";
import useUrlFilters from '@/hooks/useUrlFilters';
import usePagination from '@/hooks/usePagination';
import { Plus } from 'lucide-react';

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

export default function AdsPage() {
    // URL-synced filters
    const { filters, setFilter } = useUrlFilters(URL_FILTERS_CONFIG);
    const activeTab = filters.status as 'all' | 'active' | 'inactive';

    // Local state
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editingAd, setEditingAd] = useState<Ad | undefined>(undefined);
    const [adsList, setAdsList] = useState<Ad[]>(adsData);

    // Pagination
    const pagination = usePagination({ totalPages: 1 });

    // Counts for tabs
    const counts = useMemo(() => ({
        all: adsList.length,
        active: adsList.filter(ad => ad.status === 'active').length,
        inactive: adsList.filter(ad => ad.status === 'inactive').length,
    }), [adsList]);

    // Filter logic
    const filteredAds = useMemo(() => {
        return adsList.filter(ad => {
            const matchesTab = activeTab === 'all' || ad.status === activeTab;
            const matchesSearch = !filters.search ||
                ad.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                ad.client.toLowerCase().includes(filters.search.toLowerCase());
            return matchesTab && matchesSearch;
        });
    }, [adsList, activeTab, filters.search]);

    const handleToggleStatus = (id: number) => {
        setAdsList(prev => prev.map(ad =>
            ad.id === id ? { ...ad, status: ad.status === 'active' ? 'inactive' : 'active' } : ad
        ));
    };

    const handleDeleteAd = (id: number) => {
        if (confirm('Are you sure you want to delete this advertisement?')) {
            setAdsList(prev => prev.filter(ad => ad.id !== id));
        }
    };

    const handleSaveAd = (data: any) => {
        if (editingAd) {
            setAdsList(prev => prev.map(ad => ad.id === editingAd.id ? { ...ad, ...data } : ad));
        } else {
            const newAd: Ad = {
                ...data,
                id: Date.now(),
                revenue: '$0',
                impressions: '0',
                clicks: '0'
            };
            setAdsList(prev => [newAd, ...prev]);
        }
    };

    return (
        <div className="p-8 bg-[#f9fafb] min-h-screen">
            <AdminPageHeader
                title="Ads Management"
                description="Manage advertisements across all platforms"
                actionLabel="Create New Ad"
                onAction={() => {
                    setEditingAd(undefined);
                    setIsEditorOpen(true);
                }}
            />

            {/* Stats Overview */}
            <div className="grid grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Revenue"
                    value="$60,500"
                    trend="+15.3% from last month"
                    iconName="DollarSign"
                    iconColor="text-[#10b981]"
                />
                <StatCard
                    title="Active Ads"
                    value={counts.active}
                    trend={`Out of ${adsList.length} total`}
                    iconName="ToggleRight"
                    iconColor="text-[#3b82f6]"
                />
                <StatCard
                    title="Total Impressions"
                    value="940,000"
                    trend="+8% this week"
                    iconName="Eye"
                    iconColor="text-[#8b5cf6]"
                />
                <StatCard
                    title="Total Clicks"
                    value="13,260"
                    trend="+12% this week"
                    iconName="SquareStack"
                    iconColor="text-[#f59e0b]"
                />
            </div>

            {/* Filters and Search */}
            <AdsFilters
                searchQuery={filters.search}
                setSearchQuery={(val) => setFilter('search', val)}
                activeTab={filters.status as any}
                setActiveTab={(val) => setFilter('status', val)}
                counts={counts}
            />

            {/* Ads List */}
            <div className="space-y-4">
                {filteredAds.length > 0 ? (
                    filteredAds.map((ad) => (
                        <AdListItem
                            key={ad.id}
                            ad={ad}
                            onToggleStatus={handleToggleStatus}
                            onDelete={handleDeleteAd}
                            onEdit={(ad) => {
                                setEditingAd(ad);
                                setIsEditorOpen(true);
                            }}
                        />
                    ))
                ) : (
                    <div className="bg-white border border-[#e5e7eb] rounded-[12px] p-20 text-center">
                        <p className="text-[#6b7280] text-[16px]">No advertisements found matching your criteria.</p>
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

            {/* Ad Editor Modal */}
            <AdEditorModal
                isOpen={isEditorOpen}
                onClose={() => setIsEditorOpen(false)}
                mode={editingAd ? 'edit' : 'create'}
                initialData={editingAd}
                onSave={handleSaveAd}
            />
        </div>
    );
}
