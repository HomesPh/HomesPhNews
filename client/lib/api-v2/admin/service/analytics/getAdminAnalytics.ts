"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";
import type { Article } from "../../../types/Article";

export type AdminAnalyticsParams = {
  period?: string; // e.g. "7d"
};

export interface AdminAnalyticsOverview {
  total_page_news: number;
  unique_visitors: number;
  total_clicks: number;
  avg_engagement: number;
}

export interface AdminAnalyticsTrafficTrend {
  date: string;
  total_page_news: string | number;
  unique_visitors: string | number;
}

export interface AdminAnalyticsResponse {
  range: string | unknown[] | null;
  overview: AdminAnalyticsOverview;
  traffic_trends: AdminAnalyticsTrafficTrend[];
  content_by_category: Article[];
  performance_by_country: Article[];
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

