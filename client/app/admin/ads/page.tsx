"use client";

import { useState } from 'react';
import AdminPageHeader from "@/components/features/admin/shared/AdminPageHeader";
import StatCard from "@/components/features/admin/shared/StatCard";
import AdsFilters from "@/components/features/admin/ads/AdsFilters";
import AdListItem from "@/components/features/admin/ads/AdListItem";
import AdEditorModal from "@/components/features/admin/ads/AdEditorModal";
import Pagination from "@/components/features/admin/shared/Pagination";
import useAdsAdmin from '@/lib/ads/hooks/useAdsAdmin';
import useCampaignAdmin from '@/lib/ads/hooks/useCampaignAdmin';
import CampaignListItem from '@/components/features/admin/campaigns/CampaignListItem';
import CampaignFilters from '@/components/features/admin/campaigns/CampaignFilters';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdsPage() {
    const { data: adsData, isLoading: adsLoading, error: adsError, refetch: refetchAds, currentPage: adsPage, setPage: setAdsPage } = useAdsAdmin();
    const { data: campaignsData, isLoading: campaignsLoading, error: campaignsError, refetch: refetchCampaigns, currentPage: campaignsPage, setPage: setCampaignsPage } = useCampaignAdmin();
    const [activeTab, setActiveTab] = useState("campaigns");

    // Mock handlers
    const handleToggleStatus = (id: string) => {
        console.log("Toggle status functionality temporarily disabled", id);
    };

    const handleDelete = (id: string) => {
        console.log("Delete functionality temporarily disabled", id);
    };

    const handleSave = (data: any) => {
        console.log("Save functionality temporarily disabled", data);
    };

    const handlePageChangeAds = (page: number) => {
        setAdsPage(page);
    };

    const handlePageChangeCampaigns = (page: number) => {
        setCampaignsPage(page);
    };

    if (adsLoading || campaignsLoading) {
        return (
            <div className="p-8 bg-[#f9fafb] min-h-screen flex items-center justify-center">
                <div className="text-[#6b7280]">Loading...</div>
            </div>
        );
    }

    if (adsError || campaignsError) {
        return (
            <div className="p-8 bg-[#f9fafb] min-h-screen flex items-center justify-center">
                <div className="text-red-500">
                    <p>Error loading data.</p>
                    {adsError && <p>Ads Error: {adsError}</p>}
                    {campaignsError && <p>Campaigns Error: {campaignsError}</p>}
                </div>
            </div>
        );
    }

    // Default stats (placeholders)
    const counts = {
        all: adsData?.total || 0,
        active: 0,
        inactive: 0,
    };

    const campaignCounts = {
        all: campaignsData?.total || 0,
        active: 0,
        inactive: 0,
    };

    const adsList = adsData?.data || [];
    const campaignsList = campaignsData?.data || [];

    return (
        <div className="p-8 bg-[#f9fafb] min-h-screen">
            <AdminPageHeader
                title="Ads Management"
                description="Manage advertisements and campaigns across all platforms"
                actionLabel={activeTab === 'campaigns' ? "Create New Campaign" : "Create New Ad"}
                onAction={() => {
                    console.log("Create action temporarily disabled");
                }}
            />

            {/* Stats Overview */}
            <div className="grid grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Revenue"
                    value="$0"
                    trend="Data unavailable"
                    iconName="DollarSign"
                    iconColor="text-[#10b981]"
                />
                <StatCard
                    title="Active Ads"
                    value={counts.active}
                    trend={`Out of ${counts.all} total`}
                    iconName="ToggleRight"
                    iconColor="text-[#3b82f6]"
                />
                <StatCard
                    title="Total Impressions"
                    value="0"
                    trend="Data unavailable"
                    iconName="Eye"
                    iconColor="text-[#8b5cf6]"
                />
                <StatCard
                    title="Total Clicks"
                    value="0"
                    trend="Data unavailable"
                    iconName="SquareStack"
                    iconColor="text-[#f59e0b]"
                />
            </div>

            <Tabs defaultValue="campaigns" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-6">
                    <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
                    <TabsTrigger value="ads">Ads</TabsTrigger>
                </TabsList>

                <TabsContent value="campaigns">
                    {/* Campaigns Filter */}
                    <CampaignFilters
                        searchQuery=""
                        setSearchQuery={() => { }}
                        activeTab="all"
                        setActiveTab={() => { }}
                        counts={campaignCounts}
                    />

                    {/* Campaigns List */}
                    <div className="space-y-4">
                        {campaignsList.length > 0 ? (
                            campaignsList.map((campaign) => (
                                <CampaignListItem
                                    key={campaign.id}
                                    campaign={campaign}
                                    onToggleStatus={handleToggleStatus}
                                    onDelete={handleDelete}
                                    onEdit={(c) => {
                                        console.log("Edit action temporarily disabled", c);
                                    }}
                                />
                            ))
                        ) : (
                            <div className="bg-white border border-[#e5e7eb] rounded-[12px] p-20 text-center">
                                <p className="text-[#6b7280] text-[16px]">No campaigns found.</p>
                            </div>
                        )}
                    </div>
                    {/* Pagination Component */}
                    <div className="mt-8">
                        <Pagination
                            currentPage={campaignsPage}
                            totalPages={campaignsData ? Math.ceil(campaignsData.total / campaignsData.per_page) : 1}
                            onPageChange={handlePageChangeCampaigns}
                        />
                    </div>
                </TabsContent>

                <TabsContent value="ads">
                    {/* Ads Filters */}
                    <AdsFilters
                        searchQuery=""
                        setSearchQuery={() => { }}
                        activeTab="all"
                        setActiveTab={() => { }}
                        counts={counts}
                    />

                    {/* Ads List */}
                    <div className="space-y-4">
                        {adsList.length > 0 ? (
                            adsList.map((ad) => (
                                <AdListItem
                                    key={ad.id}
                                    ad={ad}
                                    onToggleStatus={handleToggleStatus}
                                    onDelete={handleDelete}
                                    onEdit={(ad) => {
                                        console.log("Edit action temporarily disabled", ad);
                                    }}
                                />
                            ))
                        ) : (
                            <div className="bg-white border border-[#e5e7eb] rounded-[12px] p-20 text-center">
                                <p className="text-[#6b7280] text-[16px]">No advertisements found.</p>
                            </div>
                        )}
                    </div>
                    {/* Pagination Component */}
                    <div className="mt-8">
                        <Pagination
                            currentPage={adsPage}
                            totalPages={adsData ? Math.ceil(adsData.total / adsData.per_page) : 1}
                            onPageChange={handlePageChangeAds}
                        />
                    </div>
                </TabsContent>
            </Tabs>

            {/* Ad Editor Modal - Disabled/Hidden for now as state is removed */}
            <AdEditorModal
                isOpen={false}
                onClose={() => { }}
                mode='create'
                initialData={undefined}
                onSave={handleSave}
            />
        </div>
    );
}
