"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";

export interface MoveRestaurantsToDbResponse {
  message: string;
  inserted: string[];
  failed: { id: string; reason: string }[];
}

/**
 * Bulk move Redis restaurants to database with status 'draft' (Pending Review).
 * POST /v1/admin/restaurants/move-to-db
 */
export async function moveRestaurantsToDb(
  ids: string[]
): Promise<AxiosResponse<MoveRestaurantsToDbResponse>> {
  return AXIOS_INSTANCE_ADMIN.post<MoveRestaurantsToDbResponse>(
    "/v1/admin/restaurants/move-to-db",
    { ids }
  );
}
