"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";
import type { ArticleResource } from "../../../types/ArticleResource";

export interface RejectArticleRequest {
  custom_titles?: string[] | null;
  reason?: string | null;
  published_sites: string[];
}

export interface RejectArticleResponse {
  data: ArticleResource;
}

/**
 * Reject a pending article.
 * POST /admin/articles/{id}/reject
 */
export async function rejectArticle(
  id: string,
  body: RejectArticleRequest
): Promise<AxiosResponse<RejectArticleResponse>> {
  return AXIOS_INSTANCE_ADMIN.post<RejectArticleResponse>(
    `/admin/articles/${id}/reject`,
    body
  );
}

