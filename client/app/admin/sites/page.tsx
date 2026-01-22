"use client";

import { useState, useMemo } from 'react';
import AdminPageHeader from "@/components/features/admin/shared/AdminPageHeader";
import StatCard from "@/components/features/admin/shared/StatCard";
import SitesFilters from "@/components/features/admin/sites/SitesFilters";
import SiteListItem from "@/components/features/admin/sites/SiteListItem";
import SiteEditorModal from "@/components/features/admin/sites/SiteEditorModal";
import Pagination from "@/components/features/admin/shared/Pagination";
import { sitesData, Site } from "@/app/admin/sites/data";
import useUrlFilters from '@/hooks/useUrlFilters';
import usePagination from '@/hooks/usePagination';
import { Plus, CheckCircle, XCircle, Link as LinkIcon, Users } from 'lucide-react';

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
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editingSite, setEditingSite] = useState<Site | undefined>(undefined);
    const [sitesList, setSitesList] = useState<Site[]>(sitesData);

    // Pagination
    const pagination = usePagination({ totalPages: 1 });

    // Counts for tabs
    const counts = useMemo(() => ({
        all: sitesList.length,
        active: sitesList.filter(site => site.status === 'active').length,
        suspended: sitesList.filter(site => site.status === 'suspended').length,
    }), [sitesList]);

    // Calculate total articles and monthly views
    const totalArticles = useMemo(() => {
        return sitesList.reduce((sum, site) => sum + site.articles, 0);
    }, [sitesList]);

    const totalMonthlyViews = useMemo(() => {
        return sitesList.reduce((sum, site) => {
            const views = parseInt(site.monthlyViews.replace(/,/g, '')) || 0;
            return sum + views;
        }, 0);
    }, [sitesList]);

    // Filter logic
    const filteredSites = useMemo(() => {
        return sitesList.filter(site => {
            const matchesTab = activeTab === 'all' || 
                               (activeTab === 'active' && site.status === 'active') ||
                               (activeTab === 'suspended' && site.status === 'suspended');
            const matchesSearch = !filters.search ||
                site.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                site.domain.toLowerCase().includes(filters.search.toLowerCase()) ||
                site.contact.toLowerCase().includes(filters.search.toLowerCase());
            return matchesTab && matchesSearch;
        });
    }, [sitesList, activeTab, filters.search]);

    const handleToggleStatus = (id: number) => {
        const site = sitesList.find(s => s.id === id);
        if (site) {
            const action = site.status === 'active' ? 'suspend' : 'activate';
            if (confirm(`Are you sure you want to ${action} ${site.name}?`)) {
                setSitesList(prev => prev.map(s =>
                    s.id === id ? { ...s, status: s.status === 'active' ? 'suspended' : 'active' } : s
                ));
            }
        }
    };

    const handleDeleteSite = (id: number) => {
        const site = sitesList.find(s => s.id === id);
        if (site && confirm(`Are you sure you want to delete ${site.name}? This action cannot be undone.`)) {
            setSitesList(prev => prev.filter(s => s.id !== id));
        }
    };

    const handleSaveSite = (data: any) => {
        if (editingSite) {
            setSitesList(prev => prev.map(site => 
                site.id === editingSite.id ? { ...site, ...data, id: editingSite.id } : site
            ));
        } else {
            const newSite: Site = {
                ...data,
                id: Date.now(),
            };
            setSitesList(prev => [newSite, ...prev]);
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
            <div className="grid grid-cols-4 gap-6 mb-8">
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
                {filteredSites.length > 0 ? (
                    filteredSites.map((site) => (
                        <SiteListItem
                            key={site.id}
                            site={site}
                            onToggleStatus={handleToggleStatus}
                            onDelete={handleDeleteSite}
                            onEdit={(site) => {
                                setEditingSite(site);
                                setIsEditorOpen(true);
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

