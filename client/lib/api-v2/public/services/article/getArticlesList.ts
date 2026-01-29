"use server";

import AXIOS_INSTANCE_PUBLIC from "../../axios-instance";
import type { ArticleResource } from "../../../types/ArticleResource";
import type { AxiosResponse } from "axios";

export type ArticleListResponse = {
  data: ArticleResource[];
  meta?: any;
}

export type ArticleListParams = {
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
}

export async function getArticlesList(params?: ArticleListParams): Promise<AxiosResponse<ArticleListResponse>> {
  return AXIOS_INSTANCE_PUBLIC.get<ArticleListResponse>("/articles", { params });
}