"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";
import type { ArticleResource } from "../../../types/ArticleResource";

export interface StoreArticleRequest {
  title: string;
  summary: string;
  content: string;
  category: string;
  country: string;
  image?: string | null;
  status?: "published" | "pending review" | null;
  topics?: string[] | null;
  published_sites?: string[] | null;
}

export interface CreateArticleResponse {
  data: ArticleResource;
}

/**
 * Create a new article via the admin API.
 * POST /admin/articles
 */
export async function createArticle(
  body: StoreArticleRequest
): Promise<AxiosResponse<CreateArticleResponse>> {
  return AXIOS_INSTANCE_ADMIN.post<CreateArticleResponse>("/admin/articles", body);
}
