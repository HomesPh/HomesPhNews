"use server";

import AXIOS_INSTANCE_PUBLIC from "../../axios-instance";
import type { ArticleResource } from "../../../types/ArticleResource";
import type { AxiosResponse } from "axios";

export type ArticleListResponse = {
  data: {
    data: ArticleResource[];
    current_page?: number;
    per_page?: number;
    total?: number;
    last_page?: number;
    from?: number;
    to?: number;
  };
  links?: any;
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

export async function getArticlesList(params?: ArticleListParams): Promise<ArticleListResponse> {
  const response = await AXIOS_INSTANCE_PUBLIC.get<ArticleListResponse>("/v1/articles", { params });
  // Return only the data to avoid serializing Axios response objects with circular references
  return response.data;
}