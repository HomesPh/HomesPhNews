"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";
import type { ArticleResource } from "../../../types/ArticleResource";

export interface UpdatePendingArticleRequest {
  title?: string | null;
  summary?: string | null;
  content?: string | null;
  category?: string | null;
  country?: string | null;
  image?: string | null;
  image_url?: string | null;
  status?: "published" | "pending review" | "rejected" | null;
  custom_titles?: string[] | null;
  topics?: string[] | null;
  keywords?: string | null;
  published_sites?: string[] | null;
  content_blocks?: any[] | null;
  template?: string | null;
  author?: string | null;
}

export interface UpdatePendingArticleResponse {
  data: ArticleResource;
}

/**
 * Update a pending (Redis) article.
 * PATCH /admin/articles/{id}/pending
 */
export async function updatePendingArticle(
  id: string,
  body: UpdatePendingArticleRequest
): Promise<AxiosResponse<UpdatePendingArticleResponse>> {
  return AXIOS_INSTANCE_ADMIN.patch<UpdatePendingArticleResponse>(
    `/v1/admin/articles/${id}/pending`,
    body
  );
}

