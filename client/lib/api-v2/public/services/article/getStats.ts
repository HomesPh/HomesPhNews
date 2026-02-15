"use server";

import AXIOS_INSTANCE_PUBLIC from "../../axios-instance";
import type { AxiosResponse } from "axios";

export interface StatsResponse {
  total_articles: string;
  countries: number;
  categories: number;
}

/**
 * Get statistics summary
 * GET /stats
 */
export async function getStats(): Promise<AxiosResponse<StatsResponse>> {
  return AXIOS_INSTANCE_PUBLIC.get<StatsResponse>("/v1/stats");
}
