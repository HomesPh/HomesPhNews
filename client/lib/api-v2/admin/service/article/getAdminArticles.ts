"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";
import type { ArticleResource } from "../../../types/ArticleResource";

export type AdminArticleListParams = {
  mode?: "feed" | "list";
  q?: string;
  search?: string;
  country?: string;
  category?: string;
  topic?: string;
  topics?: string;
  limit?: number;
  offset?: number;
  status?: "published" | "pending" | "rejected" | "pending review" | "all";
  sort_by?: "created_at" | "views_count" | "title" | "timestamp";
  sort_direction?: "asc" | "desc";
  per_page?: number;
  page?: number;
  start_date?: string;
  end_date?: string;
};

export interface AdminArticleStatusCounts {
  all: string;
  published: number | string;
  pending: number | string;
  rejected: number | string;
  pending_review: number | string;
}

export interface AdminArticleAvailableFilters {
  categories: string[];
  countries: string[];
}

export interface PaginatorLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface AdminArticleListMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  links: PaginatorLink[];
  path: string | null;
  per_page: number;
  to: number | null;
  total: number;
}

export interface AdminArticleListResponse {
  data: ArticleResource[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: AdminArticleListMeta;
  status_counts: AdminArticleStatusCounts;
  available_filters?: AdminArticleAvailableFilters;
}

/**
 * Get paginated admin article list with filters.
 * GET /admin/articles
 */
export async function getAdminArticles(
  params?: AdminArticleListParams
): Promise<AxiosResponse<AdminArticleListResponse>> {
  return AXIOS_INSTANCE_ADMIN.get<AdminArticleListResponse>("/admin/articles", { params });
}

