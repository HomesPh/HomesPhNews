"use client";

import { useState } from 'react';
import AdminPageHeader from "@/components/features/admin/shared/AdminPageHeader";
import StatCard from "@/components/features/admin/shared/StatCard";
import Pagination from "@/components/features/admin/shared/Pagination";
import useAdsAdmin from '../../../lib/ads/useAdsAdmin';
import useCampaignAdmin from '../../../lib/ads/useCampaignAdmin';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AdsFilters,
  AdListItem,
  AdEditorModal,
  CampaignListItem,
  CampaignFilters
} from "@/components/features/admin/ads";
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
import { Ad } from '../../../lib/ads/types';

export default function AdsPage() {
  // Logic for fetching ads and campaigns
  const {
    data: adsList,
    pagination: adsPagination,
    isLoading: adsLoading,
    error: adsError,
    refetch: refetchAds,
    setPage: setAdsPage,
    createAd,
    updateAd,
    deleteAd
  } = useAdsAdmin();

  const {
    data: campaignsData,
    isLoading: campaignsLoading,
    error: campaignsError,
    refetch: refetchCampaigns,
    currentPage: campaignsPage,
    setPage: setCampaignsPage
  } = useCampaignAdmin();

  // Logic for tabs
  const [activeTab, setActiveTab] = useState("campaigns");

  // Mock handlers
  const handleToggleStatus = (id: string) => {
    console.log("Toggle status functionality temporarily disabled", id);
  };

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteAd = (id: string) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteCampaign = (id: string) => {
    console.log("Campaign deletion temporarily disabled", id);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      await deleteAd(deleteId);
      setIsDeleteDialogOpen(false);
      setDeleteId(null);
    }
  };

  const handlePageChangeAds = (page: number) => {
    setAdsPage(page);
  };

  const handlePageChangeCampaigns = (page: number) => {
    setCampaignsPage(page);
  };

  // Ad Editor Handlers
  const [isAdEditorOpen, setIsAdEditorOpen] = useState(false);
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);

  const handleOpenAdEditor = (ad?: Ad) => {
    setSelectedAd(ad || null);
    setIsAdEditorOpen(true);
  };

  const handleCloseAdEditor = () => {
    setIsAdEditorOpen(false);
    setSelectedAd(null);
  }

  const handleSave = async (data: any) => {
    try {
      if (selectedAd) {
        await updateAd(selectedAd.id, data);
      } else {
        await createAd(data);
      }
      handleCloseAdEditor();
    } catch (error) {
      console.error("Failed to save ad:", error);
    }
  };

  // Default stats (placeholders)
  const counts = {
    all: adsPagination?.total || 0,
    active: 0,
    inactive: 0,
  };

  const campaignCounts = {
    all: campaignsData?.total || 0,
    active: 0,
    inactive: 0,
  };

  // adsList is already Ad[], campaignsData is Response object
  const campaignsList = campaignsData?.data || [];

  // Loading state
  if (adsLoading || campaignsLoading) {
    return (
      <div className="p-8 bg-[#f9fafb] min-h-screen flex items-center justify-center">
        <div className="text-[#6b7280]">Loading...</div>
      </div>
    );
  }

  // Error state
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

  const adsPage = adsPagination?.current_page || 1;

  return (
    <div className="p-8 bg-[#f9fafb] min-h-screen">
      <AdminPageHeader
        title="Ads Management"
        description="Manage advertisements and campaigns across all platforms"
        actionLabel={activeTab === 'campaigns' ? "Create New Campaign" : "Create New Ad"}
        onAction={() => {
          if (activeTab === "campaigns") {
            console.log("Create campaigns temporarily disabled");
          } else {
            handleOpenAdEditor();
          }
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

        {/* Campaigns Tab */}
        <TabsContent value="campaigns">
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
                  onDelete={handleDeleteCampaign}
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

          <div className="mt-8">
            <Pagination
              currentPage={campaignsPage}
              totalPages={campaignsData ? Math.ceil(campaignsData.total / campaignsData.per_page) : 1}
              onPageChange={handlePageChangeCampaigns}
            />
          </div>
        </TabsContent>

        {/* Ads Tab */}
        <TabsContent value="ads">
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
                  onDelete={handleDeleteAd}
                  onEdit={handleOpenAdEditor}
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
              totalPages={adsPagination?.last_page || 1}
              onPageChange={handlePageChangeAds}
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Ad Editor Modal */}
      {
        selectedAd ?
          <AdEditorModal
            isOpen={isAdEditorOpen}
            onClose={handleCloseAdEditor}
            mode='edit'
            initialData={selectedAd}
            onSave={handleSave}
          />
          :
          <AdEditorModal
            isOpen={isAdEditorOpen}
            onClose={handleCloseAdEditor}
            mode='create'
            onSave={handleSave}
          />
      }


      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the selected item.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
