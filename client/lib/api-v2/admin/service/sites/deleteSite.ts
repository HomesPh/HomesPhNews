"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";

export interface DeleteSiteResponse {
  message: string;
}

/**
 * Delete a site
 * DELETE /admin/sites/{id}
 */
export async function deleteSite(
  id: number
): Promise<AxiosResponse<DeleteSiteResponse>> {
  return AXIOS_INSTANCE_ADMIN.delete<DeleteSiteResponse>(`/v1/admin/sites/${id}`);
}

