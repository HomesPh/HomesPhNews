"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";
import type { ArticleResource } from "../../../types/ArticleResource";

export interface GetAdminArticleByIdResponse {
  data: ArticleResource;
}

/**
 * Get a single article via admin endpoint.
 * GET /admin/articles/{id}
 */
export async function getAdminArticleById(
  id: string
): Promise<AxiosResponse<GetAdminArticleByIdResponse>> {
  return AXIOS_INSTANCE_ADMIN.get<GetAdminArticleByIdResponse>(`/admin/articles/${id}`);
}

