"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";
import type { RestaurantStats } from "../../../types/RestaurantResource";

/**
 * Get restaurant statistics
 * GET /admin/restaurants/stats
 */
export async function getAdminRestaurantStats(): Promise<AxiosResponse<RestaurantStats>> {
    return AXIOS_INSTANCE_ADMIN.get<RestaurantStats>("/admin/restaurants/stats");
}
