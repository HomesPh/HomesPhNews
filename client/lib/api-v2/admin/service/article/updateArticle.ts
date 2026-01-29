"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";
import type { ArticleResource } from "../../../types/ArticleResource";

export interface UpdateArticleRequest {
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
}

export interface UpdateArticleResponse {
  data: ArticleResource;
}

/**
 * Update an existing database article.
 * PUT /admin/articles/{article}
 */
export async function updateArticle(
  articleId: string,
  body: UpdateArticleRequest
): Promise<AxiosResponse<UpdateArticleResponse>> {
  return AXIOS_INSTANCE_ADMIN.put<UpdateArticleResponse>(`/admin/articles/${articleId}`, body);
}
