"use client";

import { useRouter } from "next/navigation";
import AdminPageHeader from "@/components/features/admin/shared/AdminPageHeader";
import AdUnitForm from "@/components/features/admin/ads/AdUnitForm";
import useAdUnit from "@/lib/ads/useAdUnit";

export default function CreateAdUnitPage() {
  const router = useRouter();
  const { createAdUnit, isLoading } = useAdUnit();

  const handleSave = async (data: any) => {
    try {
      await createAdUnit(data);
      router.push("/admin/ads?tab=ad-units");
    } catch (error) {
      console.error("Failed to create ad unit:", error);
    }
  };

  return (
    <div className="p-8 bg-[#f9fafb] min-h-screen flex flex-col">
      <AdminPageHeader
        title="Create Ad Unit"
        description="Define a new space where ads can be displayed."
        showBackButton
        onBack={() => router.push("/admin/ads")}
      />

      <div className="flex-1 flex items-center justify-center">
        <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-2xl w-full">
          <AdUnitForm
            onSave={handleSave}
            onCancel={() => router.push("/admin/ads")}
            isSubmitting={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
