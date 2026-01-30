"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";
import type { SiteResource } from "../../../types/SiteResource";

export interface AdminSitesCounts {
  all: number;
  active: number;
  suspended: number;
}

export interface GetAdminSitesResponse {
  data: SiteResource[];
  counts: AdminSitesCounts;
}

export interface AdminSitesParams {
  status?: string;
  search?: string;
}

/**
 * List sites
 * GET /admin/sites
 */
export async function getAdminSites(params?: AdminSitesParams): Promise<AxiosResponse<GetAdminSitesResponse>> {
  return AXIOS_INSTANCE_ADMIN.get<GetAdminSitesResponse>("/admin/sites", { params });
}

