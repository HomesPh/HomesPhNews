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
  slug?: string;
  image?: string | null;
  status?: "published" | "pending review" | null;
  topics?: string[] | null;
  published_sites?: string[] | null;
  author?: string;
  date?: string;
  gallery_images?: any[];
  split_images?: any[];
  content_blocks?: any[];
  template?: string;
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
  return AXIOS_INSTANCE_ADMIN.post<CreateArticleResponse>("/v1/admin/articles", body);
}
