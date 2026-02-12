"use server";

import AXIOS_INSTANCE_PUBLIC from "../../axios-instance";
import type { Restaurant } from "../../../types/RestaurantResource";

export interface GetRestaurantsParams {
    limit?: number;
    per_page?: number;
    page?: number;
    topic?: string;
    country?: string;
}

export interface PaginatedRestaurants {
    data: Restaurant[];
    current_page: number;
    last_page: number;
    total: number;
}

/**
 * Fetch a paginated list of published restaurants
 */
export async function getRestaurants(params?: GetRestaurantsParams): Promise<PaginatedRestaurants> {
    const response = await AXIOS_INSTANCE_PUBLIC.get<PaginatedRestaurants>("/restaurants", { params });
    return response.data;
}
