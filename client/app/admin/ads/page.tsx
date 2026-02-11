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
  CampaignFilters,
  CampaignEditor,
  CampaignChecklistModal
} from "@/components/features/admin/ads";
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
import { format } from 'date-fns';
import { Ad, RotationType } from '../../../lib/ads/types';

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
    pagination: campaignsPagination,
    isLoading: campaignsLoading,
    error: campaignsError,
    refetch: refetchCampaigns,
    setPage: setCampaignsPage,
    createCampaign,
    updateCampaign,
    deleteCampaign
  } = useCampaignAdmin();

  // Logic for tabs
  const [activeTab, setActiveTab] = useState("campaigns");

  // Mock handlers
  const handleToggleStatus = (id: string) => {
    console.log("Toggle status functionality temporarily disabled", id);
  };

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteType, setDeleteType] = useState<'ad' | 'campaign' | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // ==========================================
  // Ads Handlers
  // ==========================================

  // Read
  const handlePageChangeAds = (page: number) => {
    setAdsPage(page);
  };

  // Create / Update
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

  // Delete
  const handleDeleteAd = (id: string) => {
    setDeleteId(id);
    setDeleteType('ad');
    setIsDeleteDialogOpen(true);
  };


  // ==========================================
  // Campaign Handlers
  // ==========================================

  // Read
  const handlePageChangeCampaigns = (page: number) => {
    setCampaignsPage(page);
  };

  // Create / Update
  const [isCampaignEditorOpen, setIsCampaignEditorOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<any | null>(null);

  const handleOpenCampaignEditor = (campaign?: any) => {
    setSelectedCampaign(campaign || null);
    setIsCampaignEditorOpen(true);
  };

  const handleCloseCampaignEditor = () => {
    setIsCampaignEditorOpen(false);
    setSelectedCampaign(null);
  };

  // Campaign Checklist Modal (Ad-Campaign relation)
  const [isCampaignChecklistOpen, setIsCampaignChecklistOpen] = useState(false);
  const [selectedAdForCampaigns, setSelectedAdForCampaigns] = useState<Ad | null>(null);

  const handleOpenCampaignChecklist = (ad: Ad) => {
    setSelectedAdForCampaigns(ad);
    setIsCampaignChecklistOpen(true);
  };

  const handleCloseCampaignChecklist = () => {
    setIsCampaignChecklistOpen(false);
    setSelectedAdForCampaigns(null);
  };

  const handleSaveCampaignChecklist = async (adId: string, _campaignIds: string[]) => {
    const campaignIds = _campaignIds.map(id => Number(id));
    await updateAd(adId, { campaign_ids: campaignIds });

    handleCloseCampaignChecklist();
  };

  const handleSaveCampaign = async (data: {
    name: string;
    rotation_type: RotationType;
    start_date: Date;
    end_date?: Date | null;
  }) => {
    try {
      // Convert Date objects to YYYY-MM-DD strings for the API
      const payload = {
        ...data,
        start_date: data.start_date ? format(data.start_date, 'yyyy-MM-dd') : null,
        end_date: data.end_date ? format(data.end_date, 'yyyy-MM-dd') : null,
      };

      if (selectedCampaign) {
        await updateCampaign(selectedCampaign.id, payload);
      } else {
        await createCampaign(payload);
      }
      handleCloseCampaignEditor();
    } catch (error) {
      console.error("Failed to save campaign:", error);
    }
  };

  // Delete
  const handleDeleteCampaign = (id: string) => {
    setDeleteId(id);
    setDeleteType('campaign');
    setIsDeleteDialogOpen(true);
  };


  // ==========================================
  // Shared Delete Logic
  // ==========================================

  const confirmDelete = async () => {
    if (deleteId && deleteType) {
      if (deleteType === 'ad') {
        await deleteAd(deleteId);
      } else {
        await deleteCampaign(deleteId);
      }
      setIsDeleteDialogOpen(false);
      setDeleteId(null);
      setDeleteType(null);
    }
  };

  // Default stats (placeholders)
  const counts = {
    all: adsPagination?.total || 0,
    active: 0,
    inactive: 0,
  };

  const campaignCounts = {
    all: campaignsPagination?.total || 0,
    active: 0,
    inactive: 0,
  };

  // Both adsList and campaignsData are already arrays
  const campaignsList = campaignsData || [];


  // Loading state
  if (adsLoading || campaignsLoading) {
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
            handleOpenCampaignEditor();
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
                  onEdit={(c) => handleOpenCampaignEditor(c)}
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
              currentPage={campaignsPagination?.current_page || 1}
              totalPages={campaignsPagination?.last_page || 1}
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
                  onEditCampaigns={handleOpenCampaignChecklist}
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

      <AdEditorModal
        isOpen={isAdEditorOpen}
        onClose={handleCloseAdEditor}
        mode={selectedAd ? 'edit' : 'create'}
        initialData={selectedAd || undefined}
        onSave={handleSave}
      />

      {/* Campaign Editor Modal */}
      {
        selectedCampaign ?
          <CampaignEditor
            isOpen={isCampaignEditorOpen}
            onClose={handleCloseCampaignEditor}
            defaultValue={selectedCampaign}
            onSave={handleSaveCampaign}
          />
          :
          <CampaignEditor
            isOpen={isCampaignEditorOpen}
            onClose={handleCloseCampaignEditor}
            onSave={handleSaveCampaign}
          />
      }

      {/* Campaign Checklist Modal */}
      <CampaignChecklistModal
        isOpen={isCampaignChecklistOpen}
        onClose={handleCloseCampaignChecklist}
        ad={selectedAdForCampaigns}
        campaigns={campaignsData}
        onSave={handleSaveCampaignChecklist}
      />

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
