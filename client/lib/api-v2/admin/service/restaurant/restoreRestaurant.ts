"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";

/**
 * Restore a deleted restaurant
 * POST /admin/restaurants/{id}/restore
 */
export async function restoreRestaurant(
    id: string
): Promise<AxiosResponse<void>> {
    return AXIOS_INSTANCE_ADMIN.post(`/v1/admin/restaurants/${id}/restore`);
}
