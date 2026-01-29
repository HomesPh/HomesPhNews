"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";
import type { Article } from "../../../types/Article";

export interface AdminStatsSummary {
  total_articles: string;
  total_published: number;
  pending_review: string | number;
  total_views: unknown;
  total_distribution: string;
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

