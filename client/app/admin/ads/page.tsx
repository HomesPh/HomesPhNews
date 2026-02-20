"use client";

import { useState } from 'react';
import AdminPageHeader from "@/components/features/admin/shared/AdminPageHeader";
import StatCard from "@/components/features/admin/shared/StatCard";
import Pagination from "@/components/features/admin/shared/Pagination";
import useCampaigns, { CreateCampaignPayload } from '../../../lib/ads/useCampaigns';
import useAdUnits, { CreateAdUnitPayload } from '../../../lib/ads/useAdUnits';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchSkeleton } from '@/components/features/dashboard/DashboardSkeletons';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Campaign, AdUnit } from '../../../lib/ads/types';

// Components
import CampaignListItem from '@/components/features/admin/ads/CampaignListItem';
import AdUnitListItem from '@/components/features/admin/ads/AdUnitListItem';
import AdUnitChecklistModal from '@/components/features/admin/ads/AdUnitChecklistModal';
import { Input } from '@/components/ui/input';
import AdMetricsOverview from '@/components/features/admin/ads/AdMetricsOverview';

export default function AdsPage() {
  // Logic for fetching campaigns (formerly ads) and ad units (formerly campaigns)
  const {
    data: campaignsList,
    pagination: campaignsPagination,
    isLoading: campaignsLoading,
    error: campaignsError,
    refetch: refetchCampaigns,
    setPage: setCampaignsPage,
    createCampaign,
    updateCampaign,
    deleteCampaign
  } = useCampaigns();

  const {
    data: adUnitsList,
    pagination: adUnitsPagination,
    isLoading: adUnitsLoading,
    error: adUnitsError,
    refetch: refetchAdUnits,
    setPage: setAdUnitsPage,
    createAdUnit,
    updateAdUnit,
    deleteAdUnit
  } = useAdUnits();

  // Logic for tabs
  const [activeTab, setActiveTab] = useState("campaigns");

  // Mock handlers
  const handleToggleStatus = (id: string) => {
    console.log("Toggle status functionality temporarily disabled", id);
    // In real app, call updateCampaign(id, { status: ... })
  };

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteType, setDeleteType] = useState<'campaign' | 'adUnit' | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // ==========================================
  // Campaigns Handlers (formerly Ads)
  // ==========================================

  // Read
  const handlePageChangeCampaigns = (page: number) => {
    setCampaignsPage(page);
  };

  // Delete
  const handleDeleteCampaign = (id: string) => {
    setDeleteId(id);
    setDeleteType('campaign');
    setIsDeleteDialogOpen(true);
  };

  // Ad Unit Association
  const [isAdUnitChecklistOpen, setIsAdUnitChecklistOpen] = useState(false);
  const [selectedCampaignForAdUnits, setSelectedCampaignForAdUnits] = useState<Campaign | null>(null);

  const handleOpenAdUnitChecklist = (campaign: Campaign) => {
    setSelectedCampaignForAdUnits(campaign);
    setIsAdUnitChecklistOpen(true);
  };

  const handleCloseAdUnitChecklist = () => {
    setIsAdUnitChecklistOpen(false);
    setSelectedCampaignForAdUnits(null);
  };
  // Read
  const handlePageChangeAdUnits = (page: number) => {
    setAdUnitsPage(page);
  };

  const handleSaveAdUnitRelation = async (campaignId: string, adUnitIds: string[]) => {
    const numericIds = adUnitIds.map(id => Number(id));
    await updateCampaign(campaignId, { ad_units: numericIds });
  };



  // Delete
  const handleDeleteAdUnit = (id: string) => {
    setDeleteId(id);
    setDeleteType('adUnit');
    setIsDeleteDialogOpen(true);
  };


  // ==========================================
  // Shared Delete Logic
  // ==========================================

  const confirmDelete = async () => {
    if (deleteId && deleteType) {
      if (deleteType === 'campaign') {
        await deleteCampaign(deleteId);
      } else {
        await deleteAdUnit(deleteId);
      }
      setIsDeleteDialogOpen(false);
      setDeleteId(null);
      setDeleteType(null);
    }
  };

  // Default stats (placeholders)
  const campaignCounts = {
    all: campaignsPagination?.total || 0,
    active: 0,
    inactive: 0,
  };

  const adUnitCounts = {
    all: adUnitsPagination?.total || 0,
    active: 0,
    inactive: 0,
  };

  // Loading state
  if (campaignsLoading || adUnitsLoading) {
    return (
      <div className="p-8 bg-[#f9fafb] min-h-screen space-y-8">
        <div className="h-10 w-64 bg-gray-200 animate-pulse rounded-md" />
        <div className="grid grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-xl" />)}
        </div>
        <SearchSkeleton />
      </div>
    );
  }

  // Error state
  if (campaignsError || adUnitsError) {
    return (
      <div className="p-8 bg-[#f9fafb] min-h-screen flex items-center justify-center">
        <div className="text-red-500">
          <p>Error loading data.</p>
          {campaignsError && <p>Campaigns Error: {campaignsError}</p>}
          {adUnitsError && <p>Ad Units Error: {adUnitsError}</p>}
        </div>
      </div>
    );
  }

  const campaignsPage = campaignsPagination?.current_page || 1;
  const adUnitsPage = adUnitsPagination?.current_page || 1;

  return (
    <div className="p-8 bg-[#f9fafb] min-h-screen">
      <AdminPageHeader
        title="Ads Management"
        description="Manage marketing campaigns and ad units (placements)"
        actionLabel={activeTab === 'campaigns' ? "Create New Campaign" : "Create New Ad Unit"}
        onAction={() => {
          if (activeTab === "campaigns") {
            window.location.href = "/admin/ads/campaigns/create";
          } else {
            window.location.href = "/admin/ads/units/create";
          }
        }}
      />

      <AdMetricsOverview
        campaignCount={campaignCounts.all}
        adUnitCount={adUnitCounts.all}
      />

      <Tabs defaultValue="campaigns" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="ad-units">Ad Units</TabsTrigger>
        </TabsList>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns">
          <div className="mb-6 flex items-center gap-4">
            {/* Minimal Search/Filter Placeholder - can expand later */}
            <Input placeholder="Search campaigns..." className="max-w-sm" />
          </div>

          <div className="space-y-4">
            {campaignsList.length > 0 ? (
              campaignsList.map((campaign) => (
                <CampaignListItem
                  key={campaign.id}
                  campaign={campaign}
                  onToggleStatus={handleToggleStatus}
                  onDelete={handleDeleteCampaign}
                  onEdit={(campaign) => {
                    window.location.href = `/admin/ads/campaigns/${campaign.id}`;
                  }}
                  onEditAdUnits={handleOpenAdUnitChecklist}
                />
              ))
            ) : (
              <div className="bg-white border border-[#e5e7eb] rounded-[12px] p-20 text-center">
                <p className="text-[#6b7280] text-[16px]">No campaigns found.</p>
              </div>
            )}
          </div>

          <div className="mt-8">
            <Pagination
              currentPage={campaignsPage}
              totalPages={campaignsPagination?.last_page || 1}
              onPageChange={handlePageChangeCampaigns}
            />
          </div>
        </TabsContent>

        {/* Ad Units Tab */}
        <TabsContent value="ad-units">
          <div className="mb-6 flex items-center gap-4">
            {/* Minimal Search/Filter Placeholder */}
            <Input placeholder="Search ad units..." className="max-w-sm" />
          </div>

          <div className="space-y-4">
            {adUnitsList.length > 0 ? (
              adUnitsList.map((adUnit) => (
                <AdUnitListItem
                  key={adUnit.id}
                  adUnit={adUnit}
                  onToggleStatus={() => { }} // No status on ad units currently
                  onDelete={handleDeleteAdUnit}
                  onEdit={(adUnit) => {
                    window.location.href = `/admin/ads/units/${adUnit.id}`;
                  }}
                />
              ))
            ) : (
              <div className="bg-white border border-[#e5e7eb] rounded-[12px] p-20 text-center">
                <p className="text-[#6b7280] text-[16px]">No ad units found.</p>
              </div>
            )}
          </div>

          {/* Pagination Component */}
          <div className="mt-8">
            <Pagination
              currentPage={adUnitsPage}
              totalPages={adUnitsPagination?.last_page || 1}
              onPageChange={handlePageChangeAdUnits}
            />
          </div>
        </TabsContent>
      </Tabs>



      {/* Ad Unit Checklist (Campaign Relation) */}
      <AdUnitChecklistModal
        isOpen={isAdUnitChecklistOpen}
        onClose={handleCloseAdUnitChecklist}
        campaign={selectedCampaignForAdUnits}
        adUnits={adUnitsList}
        onSave={handleSaveAdUnitRelation}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the selected item.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setDeleteId(null);
              setDeleteType(null);
            }}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
