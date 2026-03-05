"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";

/**
 * Get a list of all active site names
 * GET /admin/sites/names
 */
export async function getSiteNames(): Promise<AxiosResponse<string[]>> {
  return AXIOS_INSTANCE_ADMIN.get<string[]>("/v1/admin/sites/names");
}

