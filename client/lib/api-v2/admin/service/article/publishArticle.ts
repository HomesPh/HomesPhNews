"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";
import type { ArticleResource } from "../../../types/ArticleResource";

export interface PublishArticleRequest {
  custom_titles?: string[] | null;
  reason?: string | null;
  published_sites: string[];
}

export interface PublishArticleResponse {
  data: ArticleResource;
}

/**
 * Publish a pending article to the database.
 * POST /admin/articles/{id}/publish
 */
export async function publishArticle(
  id: string,
  body: PublishArticleRequest
): Promise<AxiosResponse<PublishArticleResponse>> {
  return AXIOS_INSTANCE_ADMIN.post<PublishArticleResponse>(
    `/v1/admin/articles/${id}/publish`,
    body
  );
}

