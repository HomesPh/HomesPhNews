"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";
import type { Article } from "../../../types/Article";

export type AdminAnalyticsParams = {
  period?: string; // e.g. "7d"
  category?: string;
  country?: string;
};

export interface AdminAnalyticsOverview {
  total_page_news: number;
  total_page_news_trend: string;
  unique_visitors: number;
  unique_visitors_trend: string;
  total_clicks: number;
  total_clicks_trend: string;
  avg_engagement: number;
  avg_engagement_trend: string;
}

export interface AdminAnalyticsTrafficTrend {
  date: string;
  total_page_news: string | number;
  unique_visitors: string | number;
}

export interface AdminAnalyticsContentPerformance {
  id: string;
  title: string;
  type: 'Article' | 'Blog' | 'Newsletter' | 'Restaurant';
  views: number;
  clicks: number;
  read_time: string;
  country: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
}

export interface AdminAnalyticsResponse {
  range: string | null;
  overview: AdminAnalyticsOverview & {
    total_blogs: number;
    total_newsletters: number;
    avg_read_duration: string;
  };
  traffic_trends: AdminAnalyticsTrafficTrend[];
  content_by_category: Array<{
    category: string;
    count: number;
  }>;
  performance_by_country: Array<{
    country: string;
    total_views: number;
  }>;
  content_performance: AdminAnalyticsContentPerformance[];
  partner_performance: Array<{
    site: string;
    articlesShared: number;
    monthlyViews: number;
    revenueGenerated: string;
    avgEngagement: string;
  }>;
  device_breakdown: ChartDataPoint[];
  traffic_sources: ChartDataPoint[];
}

/**
 * Admin analytics (traffic + breakdowns)
 * GET /admin/analytics
 */
export async function getAdminAnalytics(
  params?: AdminAnalyticsParams
): Promise<AxiosResponse<AdminAnalyticsResponse>> {
  return AXIOS_INSTANCE_ADMIN.get<AdminAnalyticsResponse>("/v1/admin/analytics", { params });
}

