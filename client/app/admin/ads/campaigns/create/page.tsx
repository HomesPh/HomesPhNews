"use client";

import { useRouter } from "next/navigation";
import AdminPageHeader from "@/components/features/admin/shared/AdminPageHeader";
import CampaignForm from "@/components/features/admin/ads/CampaignForm";
import useCampaign from "@/lib/ads/useCampaign";

export default function CreateCampaignPage() {
  const router = useRouter();
  const { createCampaign, isLoading } = useCampaign();

  const handleSave = async (data: any) => {
    try {
      await createCampaign(data);
      router.push("/admin/ads");
    } catch (error) {
      console.error("Failed to create campaign:", error);
    }
  };

  return (
    <div className="p-8 bg-[#f9fafb] min-h-screen flex flex-col">
      <AdminPageHeader
        title="Create New Campaign"
        description="Add a new marketing campaign to the system."
        showBackButton
        onBack={() => router.push("/admin/ads")}
      />

      <div className="flex-1 flex items-center justify-center">
        <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-2xl w-full">
          <CampaignForm
            onSave={handleSave}
            onCancel={() => router.push("/admin/ads")}
            isSubmitting={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
