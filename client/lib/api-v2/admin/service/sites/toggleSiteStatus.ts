"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";
import type { SiteResource } from "../../../types/SiteResource";

export interface ToggleSiteStatusResponse {
  data: SiteResource;
}

/**
 * Toggle a site's status
 * PATCH /admin/sites/{id}/toggle-status
 */
export async function toggleSiteStatus(
  id: number
): Promise<AxiosResponse<ToggleSiteStatusResponse>> {
  return AXIOS_INSTANCE_ADMIN.patch<ToggleSiteStatusResponse>(
    `/admin/sites/${id}/toggle-status`
  );
}

