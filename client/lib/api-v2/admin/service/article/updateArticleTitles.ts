"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";
import type { ArticleResource } from "../../../types/ArticleResource";

export interface UpdateArticleTitlesRequest {
  custom_titles?: string[] | null;
}

/**
 * Update custom titles for an article.
 * PATCH /admin/articles/{article}/titles
 */
export async function updateArticleTitles(
  articleId: string,
  body: UpdateArticleTitlesRequest
): Promise<AxiosResponse<ArticleResource>> {
  return AXIOS_INSTANCE_ADMIN.patch<ArticleResource>(
    `/v1/admin/articles/${articleId}/titles`,
    body
  );
}

