"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";
import type { Article } from "../../../types/Article";

export interface AdminStatsSummary {
  total_articles: number;
  total_articles_trend: string;
  total_published: number;
  total_published_trend: string;
  pending_review: number;
  pending_review_trend: string;
  total_views: number;
  total_views_trend: string;
  total_distribution: Array<{
    distributed_in: string;
    published_count: number;
    total_views: number;
  }>;
}

export interface AdminStatsResponse {
  stats: AdminStatsSummary;
  recent_articles: Article[];
}

/**
 * Admin dashboard statistics
 * GET /admin/stats
 */
export async function getAdminStats(): Promise<AxiosResponse<AdminStatsResponse>> {
  return AXIOS_INSTANCE_ADMIN.get<AdminStatsResponse>("/v1/admin/stats");
}

