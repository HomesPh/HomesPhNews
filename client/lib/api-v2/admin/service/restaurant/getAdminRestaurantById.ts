"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";
import type { Restaurant } from "../../../types/RestaurantResource";

/**
 * Get a single restaurant by ID
 * GET /admin/restaurants/{id}
 */
export async function getAdminRestaurantById(
    id: string
): Promise<AxiosResponse<Restaurant>> {
    return AXIOS_INSTANCE_ADMIN.get<Restaurant>(`/admin/restaurants/${id}`);
}
