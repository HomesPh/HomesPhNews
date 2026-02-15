"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";
import type { RestaurantSummary } from "../../../types/RestaurantResource";

export interface GetRestaurantsParams {
    limit?: number;
    offset?: number;
}

/**
 * Get all restaurants with pagination
 * GET /admin/restaurants
 */
export async function getAdminRestaurants(
    params?: GetRestaurantsParams
): Promise<AxiosResponse<RestaurantSummary[]>> {
    return AXIOS_INSTANCE_ADMIN.get<RestaurantSummary[]>("/v1/admin/restaurants", { params });
}
