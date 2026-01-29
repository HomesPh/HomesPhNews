"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";
import type { SiteResource } from "../../../types/SiteResource";

export interface CreateSiteRequest {
  name: string;
  domain: string;
  contact_name?: string | null;
  contact_email?: string | null;
  description?: string | null;
  categories?: string[] | null;
  image?: string | null;
}

export interface CreateSiteResponse {
  data: SiteResource;
}

/**
 * Create a site
 * POST /admin/sites
 */
export async function createSite(
  body: CreateSiteRequest
): Promise<AxiosResponse<CreateSiteResponse>> {
  return AXIOS_INSTANCE_ADMIN.post<CreateSiteResponse>("/admin/sites", body);
}

