"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";

export interface DeleteArticleResponse {
  message: string;
  from_db: boolean;
  from_redis: boolean;
}

/**
 * Permanently delete an article from storage (DB or Redis).
 * DELETE /admin/articles/{id}
 */
export async function deleteArticle(
  id: string
): Promise<AxiosResponse<DeleteArticleResponse>> {
  return AXIOS_INSTANCE_ADMIN.delete<DeleteArticleResponse>(
    `/v1/admin/articles/${id}`
  );
}
