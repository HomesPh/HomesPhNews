"use client";

import { useEffect, use } from "react";
import { useRouter } from "next/navigation";
import AdminPageHeader from "@/components/features/admin/shared/AdminPageHeader";
import useAdUnit from "@/lib/ads/useAdUnit";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, ArrowLeft, Calendar, ExternalLink, Globe, Layout, Monitor } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function AdUnitDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { adUnit, fetchAdUnit, isLoading, error } = useAdUnit();

  useEffect(() => {
    fetchAdUnit(id);
  }, [id, fetchAdUnit]);

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-screen text-red-500 gap-4">
        <p>Error loading ad unit: {error}</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  if (!adUnit) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-screen gap-4">
        <p>Ad Unit not found.</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#f9fafb] min-h-screen space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Ad Unit Details
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Info Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{adUnit.name}</span>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-sm">
                  {adUnit.type ? adUnit.type.toUpperCase() : "UNKNOWN TYPE"}
                </Badge>
                {adUnit.size && (
                  <Badge variant="secondary" className="text-sm">
                    {adUnit.size}
                  </Badge>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <span className="text-sm text-gray-500 font-medium flex items-center gap-2">
                  <Globe className="h-4 w-4" /> Page URL
                </span>
                <div className="font-medium truncate" title={adUnit.page_url || ""}>
                  {adUnit.page_url ? (
                    <a
                      href={adUnit.page_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      {adUnit.page_url}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="text-gray-400 italic">No page URL defined</span>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-sm text-gray-500 font-medium flex items-center gap-2">
                  <Layout className="h-4 w-4" /> Size/Format
                </span>
                <p className="font-medium">
                  {adUnit.size || "Responsive"}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-sm text-gray-500 font-medium flex items-center gap-2">
                  <Monitor className="h-4 w-4" /> Type
                </span>
                <p className="font-medium capitalize">
                  {adUnit.type || "Not specified"}
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">System Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex flex-col">
                  <span className="text-gray-500">ID</span>
                  <span className="font-mono text-gray-700">{adUnit.id}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500">Created At</span>
                  <span className="text-gray-700">
                    {adUnit.created_at ? format(new Date(adUnit.created_at), "PPP p") : "N/A"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500">Last Updated</span>
                  <span className="text-gray-700">
                    {adUnit.updated_at ? format(new Date(adUnit.updated_at), "PPP p") : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Link href={`/admin/ads/units/${adUnit.id}`}>
                <Button>Edit Ad Unit</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Associated Campaigns Card */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Associated Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            {adUnit.campaigns && adUnit.campaigns.length > 0 ? (
              <ul className="space-y-3">
                {adUnit.campaigns.map((campaign) => (
                  <li key={campaign.id} className="border rounded-md p-3 hover:bg-gray-50 transition-colors">
                    <Link href={`/admin/ads/campaigns/${campaign.id}`} className="block">
                      <div className="font-medium text-blue-600 hover:underline mb-1">
                        {campaign.name}
                      </div>
                      <div className="text-xs text-gray-500 flex justify-between">
                        <span className={
                          campaign.status === 'active' ? 'text-green-600 font-medium' :
                            campaign.status === 'paused' ? 'text-yellow-600' : 'text-gray-500'
                        }>
                          {campaign.status.toUpperCase()}
                        </span>
                        {campaign.start_date && (
                          <span>{format(new Date(campaign.start_date), "MMM d, yyyy")}</span>
                        )}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No active campaigns linked to this ad unit.</p>
                <div className="mt-4">
                  <Link href="/admin/ads">
                    <Button variant="outline" size="sm">Manage Campaigns</Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
