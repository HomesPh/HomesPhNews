"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";
import type { Restaurant } from "../../../types/RestaurantResource";

/**
 * Publish a restaurant to the database.
 * POST /admin/restaurants/{id}/publish
 */
export async function publishRestaurant(
    id: string,
    body?: { published_sites?: string[] }
): Promise<AxiosResponse<Restaurant>> {
    return AXIOS_INSTANCE_ADMIN.post<Restaurant>(
        `/admin/restaurants/${id}/publish`,
        body
    );
}
