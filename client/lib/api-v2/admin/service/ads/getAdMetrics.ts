import AXIOS_INSTANCE_ADMIN from "@/lib/api-v2/admin/axios-instance";
import { AdMetricFilters, AdMetricResponse } from "@/lib/api-v2/types/AdMetric";

/**
 * Get aggregated analytics for all ads.
 */
export async function getAdMetrics(params: AdMetricFilters = {}): Promise<AdMetricResponse> {
  const response = await AXIOS_INSTANCE_ADMIN.get<AdMetricResponse>("/v1/admin/ad-metrics", { params });
  return response.data;
}

/**
 * Get metrics for a specific ad unit.
 */
export async function getAdUnitMetrics(adUnitId: number | string, params: AdMetricFilters = {}): Promise<AdMetricResponse> {
  const response = await AXIOS_INSTANCE_ADMIN.get<AdMetricResponse>(`/v1/admin/ad-metrics/units/${adUnitId}`, { params });
  return response.data;
}

/**
 * Get metrics for a specific campaign.
 */
export async function getCampaignMetrics(campaignId: number | string, params: AdMetricFilters = {}): Promise<AdMetricResponse> {
  const response = await AXIOS_INSTANCE_ADMIN.get<AdMetricResponse>(`/v1/admin/ad-metrics/campaigns/${campaignId}`, { params });
  return response.data;
}
