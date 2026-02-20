"use client";

import { useEffect, use } from "react";
import { useRouter } from "next/navigation";
import AdminPageHeader from "@/components/features/admin/shared/AdminPageHeader";
import CampaignForm from "@/components/features/admin/ads/CampaignForm";
import useCampaign from "@/lib/ads/useCampaign";

export default function EditCampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { campaign, fetchCampaign, updateCampaign, isLoading, error } = useCampaign();

  useEffect(() => {
    fetchCampaign(id);
  }, [id, fetchCampaign]);

  const handleSave = async (data: any) => {
    try {
      await updateCampaign(id, data);
      router.push("/admin/ads");
    } catch (error) {
      console.error("Failed to update campaign:", error);
    }
  };

  if (isLoading && !campaign) {
    return <div className="p-8">Loading...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-8 bg-[#f9fafb] min-h-screen flex flex-col">
      <AdminPageHeader
        title="Edit Campaign"
        description={`Edit details for campaign: ${campaign?.name}`}
        showBackButton
        onBack={() => router.push("/admin/ads")}
      />

      <div className="flex-1 flex items-center justify-center">
        <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-2xl w-full">
          {campaign && (
            <CampaignForm
              initialData={campaign}
              onSave={handleSave}
              onCancel={() => router.push("/admin/ads")}
              isSubmitting={isLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
}

