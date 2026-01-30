"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";
import type { Article } from "../../../types/Article";

export interface AdminStatsSummary {
  total_articles: string | number;
  total_published: number | string;
  pending_review: string | number;
  total_views: number | string;
  total_distribution: Array<{
    distributed_in: string;
    published_count: number;
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
  return AXIOS_INSTANCE_ADMIN.get<AdminStatsResponse>("/admin/stats");
}

