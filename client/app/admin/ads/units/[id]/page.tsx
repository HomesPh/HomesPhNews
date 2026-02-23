"use client";

import { useEffect, use } from "react";
import { useRouter } from "next/navigation";
import AdminPageHeader from "@/components/features/admin/shared/AdminPageHeader";
import AdUnitForm from "@/components/features/admin/ads/AdUnitForm";
import useAdUnit from "@/lib/ads/useAdUnit";

export default function EditAdUnitPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { adUnit, fetchAdUnit, updateAdUnit, isLoading, error } = useAdUnit();

  useEffect(() => {
    fetchAdUnit(id);
  }, [id, fetchAdUnit]);

  const handleSave = async (data: any) => {
    try {
      await updateAdUnit(id, data);
      router.push("/admin/ads?tab=ad-units");
    } catch (error) {
      console.error("Failed to update ad unit:", error);
    }
  };

  if (isLoading && !adUnit) {
    return <div className="p-8">Loading...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-8 bg-[#f9fafb] min-h-screen flex flex-col">
      <AdminPageHeader
        title="Edit Ad Unit"
        description={`Edit details for ad unit: ${adUnit?.name}`}
        showBackButton
        onBack={() => router.push("/admin/ads")}
      />

      <div className="flex-1 flex items-center justify-center">
        <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-2xl w-full">
          {adUnit && (
            <AdUnitForm
              initialData={adUnit}
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
