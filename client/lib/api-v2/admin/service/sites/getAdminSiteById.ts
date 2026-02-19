"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";
import type { SiteResource } from "../../../types/SiteResource";

export interface GetAdminSiteByIdResponse {
  data: SiteResource;
}

/**
 * Get a site by id
 * GET /admin/sites/{id}
 */
export async function getAdminSiteById(
  id: number
): Promise<AxiosResponse<GetAdminSiteByIdResponse>> {
  return AXIOS_INSTANCE_ADMIN.get<GetAdminSiteByIdResponse>(`/v1/admin/sites/${id}`);
}

