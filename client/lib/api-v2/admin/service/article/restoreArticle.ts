"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";

/**
 * Restore a soft-deleted article.
 * POST /admin/articles/{id}/restore
 */
export async function restoreArticle(id: string): Promise<AxiosResponse<any>> {
    return AXIOS_INSTANCE_ADMIN.post(`/admin/articles/${id}/restore`);
}
