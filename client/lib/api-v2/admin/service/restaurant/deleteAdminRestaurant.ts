"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";

interface DeleteResponse {
    message: string;
    id: string;
}

/**
 * Delete a restaurant by ID
 * DELETE /admin/restaurants/{id}
 */
export async function deleteAdminRestaurant(
    id: string
): Promise<AxiosResponse<DeleteResponse>> {
    return AXIOS_INSTANCE_ADMIN.delete<DeleteResponse>(`/admin/restaurants/${id}`);
}
