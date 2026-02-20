"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";

/**
 * Delete a restaurant (soft delete)
 * DELETE /admin/restaurants/{id}
 */
export async function deleteRestaurant(
    id: string
): Promise<AxiosResponse<void>> {
    return AXIOS_INSTANCE_ADMIN.delete(`/v1/admin/restaurants/${id}`);
}
