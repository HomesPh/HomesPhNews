"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";
import type { Article } from "../../../types/Article";

export type AdminAnalyticsParams = {
  period?: string; // e.g. "7d"
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

export interface AdminAnalyticsResponse {
  range: string | null;
  overview: AdminAnalyticsOverview;
  traffic_trends: AdminAnalyticsTrafficTrend[];
  content_by_category: Array<{
    category: string;
    count: number;
  }>;
  performance_by_country: Array<{
    country: string;
    total_views: number;
  }>;
  partner_performance: Array<{
    site: string;
    articlesShared: number;
    monthlyViews: number;
    revenueGenerated: string;
    avgEngagement: string;
  }>;
}

/**
 * Admin analytics (traffic + breakdowns)
 * GET /admin/analytics
 */
export async function getAdminAnalytics(
  params?: AdminAnalyticsParams
): Promise<AxiosResponse<AdminAnalyticsResponse>> {
  return AXIOS_INSTANCE_ADMIN.get<AdminAnalyticsResponse>("/admin/analytics", { params });
}

