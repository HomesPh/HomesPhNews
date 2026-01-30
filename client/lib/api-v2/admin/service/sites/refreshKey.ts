"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";
import type { SiteResource } from "../../../types/SiteResource";

export interface RefreshKeyResponse {
  data: SiteResource;
}

/**
 * Refresh a site's API key
 * PATCH /admin/sites/{id}/refresh-key
 */
export async function refreshKey(
  id: number
): Promise<AxiosResponse<RefreshKeyResponse>> {
  return AXIOS_INSTANCE_ADMIN.patch<RefreshKeyResponse>(
    `/admin/sites/${id}/refresh-key`
  );
}
