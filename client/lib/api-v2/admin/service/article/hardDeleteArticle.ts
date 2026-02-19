"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";

/**
 * Permanently delete an article via admin endpoint.
 * DELETE /v1/admin/articles/{id}/hard-delete
 */
export async function hardDeleteArticle(id: string): Promise<AxiosResponse<any>> {
    return AXIOS_INSTANCE_ADMIN.delete(`/v1/admin/articles/${id}/hard-delete`);
}
