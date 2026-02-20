'use client';

import { useEffect, use } from "react";
import { useRouter } from "next/navigation";
import AdminPageHeader from "@/components/features/admin/shared/AdminPageHeader";
import useCampaign from "@/lib/ads/useCampaign";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, ArrowLeft, Calendar, ExternalLink, Link as LinkIcon, Target, ImageIcon } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import AdMetricsOverview from "@/components/features/admin/ads/AdMetricsOverview";

export default function CampaignDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { campaign, fetchCampaign, isLoading, error } = useCampaign();

  useEffect(() => {
    fetchCampaign(id);
  }, [id, fetchCampaign]);

  if (isLoading && !campaign) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-screen text-red-500 gap-4">
        <p>Error loading campaign: {error}</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-screen gap-4">
        <p>Campaign not found.</p>
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
          Campaign Details
        </h1>
      </div>

      <AdMetricsOverview campaignId={id} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Info Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{campaign.name}</span>
              <Badge variant="secondary" className={
                campaign.status === 'active' ? 'bg-green-100 text-green-800' :
                  campaign.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
              }>
                {campaign.status.toUpperCase()}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <span className="text-sm text-gray-500 font-medium flex items-center gap-2">
                  <LinkIcon className="h-4 w-4" /> Target URL
                </span>
                <div className="font-medium truncate" title={campaign.target_url}>
                  <a
                    href={campaign.target_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    {campaign.target_url}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-sm text-gray-500 font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" /> Date Range
                </span>
                <p className="font-medium">
                  {campaign.start_date ? format(new Date(campaign.start_date), "MMM d, yyyy") : "No start date"}
                  {campaign.end_date && ` - ${format(new Date(campaign.end_date), "MMM d, yyyy")}`}
                </p>
              </div>

              {campaign.headline && (
                <div className="space-y-1 sm:col-span-2">
                  <span className="text-sm text-gray-500 font-medium">Headline</span>
                  <p className="font-medium text-lg">"{campaign.headline}"</p>
                </div>
              )}
            </div>

            <Separator />

            {/* Visuals Segment */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <ImageIcon className="h-4 w-4" /> Creatives
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {campaign.image_url && (
                  <div className="space-y-2">
                    <span className="text-xs text-gray-500 uppercase tracking-wider">Main Image</span>
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                      <img src={campaign.image_url} alt="Campaign main" className="w-full h-full object-cover" />
                    </div>
                  </div>
                )}
                {campaign.banner_image_urls && campaign.banner_image_urls.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs text-gray-500 uppercase tracking-wider">Banners ({campaign.banner_image_urls.length})</span>
                    <div className="grid grid-cols-2 gap-2">
                      {campaign.banner_image_urls.map((url, idx) => (
                        <div key={idx} className="aspect-video bg-gray-100 rounded-md overflow-hidden border border-gray-200">
                          <img src={url} alt={`Banner ${idx + 1}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">System Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex flex-col">
                  <span className="text-gray-500">ID</span>
                  <span className="font-mono text-gray-700">{campaign.id}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500">Created At</span>
                  <span className="text-gray-700">
                    {campaign.created_at ? format(new Date(campaign.created_at), "PPP p") : "N/A"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500">Last Updated</span>
                  <span className="text-gray-700">
                    {campaign.updated_at ? format(new Date(campaign.updated_at), "PPP p") : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Link href={`/admin/ads/campaigns/${campaign.id}`}>
                <Button>Edit Campaign</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Associated Ad Units Card */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-gray-400" /> Linked Ad Units
            </CardTitle>
          </CardHeader>
          <CardContent>
            {campaign.ad_units && campaign.ad_units.length > 0 ? (
              <ul className="space-y-3">
                {campaign.ad_units.map((unit) => (
                  <li key={unit.id} className="border rounded-md p-3 hover:bg-gray-50 transition-colors">
                    <Link href={`/admin/ads/units/${unit.id}/details`} className="block">
                      <div className="font-medium text-blue-600 hover:underline mb-1">
                        {unit.name}
                      </div>
                      <div className="text-xs text-gray-500 flex justify-between">
                        <span className="capitalize">{unit.type}</span>
                        <span>{unit.size || 'Adaptive'}</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No ad units linked to this campaign.</p>
                <div className="mt-4">
                  <Link href="/admin/ads?tab=ad-units">
                    <Button variant="outline" size="sm">Browse Ad Units</Button>
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
