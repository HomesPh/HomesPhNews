"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";
import type { SiteResource } from "../../../types/SiteResource";

export interface UpdateSiteRequest {
  name?: string;
  domain?: string;
  contact_name?: string | null;
  contact_email?: string | null;
  description?: string | null;
  categories?: string[] | null;
  image?: string | null;
  status?: "active" | "suspended";
}

export interface UpdateSiteResponse {
  data: SiteResource;
}

/**
 * Update a site
 * PUT /admin/sites/{id}
 */
export async function updateSite(
  id: number,
  body: UpdateSiteRequest
): Promise<AxiosResponse<UpdateSiteResponse>> {
  return AXIOS_INSTANCE_ADMIN.put<UpdateSiteResponse>(`/admin/sites/${id}`, body);
}

