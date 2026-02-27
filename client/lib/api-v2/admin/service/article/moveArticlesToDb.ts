"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";

export interface MoveArticlesToDbResponse {
  message: string;
  inserted: string[];
  failed: { id: string; reason: string }[];
}

/**
 * Bulk move Redis articles to database with status 'pending review'.
 * POST /v1/admin/articles/move-to-db
 */
export async function moveArticlesToDb(
  ids: string[]
): Promise<AxiosResponse<MoveArticlesToDbResponse>> {
  return AXIOS_INSTANCE_ADMIN.post<MoveArticlesToDbResponse>(
    "/v1/admin/articles/move-to-db",
    { ids }
  );
}
