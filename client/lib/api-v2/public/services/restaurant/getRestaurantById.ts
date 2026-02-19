"use server";

import AXIOS_INSTANCE_PUBLIC from "../../axios-instance";
import type { Restaurant } from "../../../types/RestaurantResource";

/**
 * Fetch a single published restaurant by ID
 */
export async function getRestaurantById(id: string): Promise<Restaurant> {
    const response = await AXIOS_INSTANCE_PUBLIC.get<Restaurant>(`/v1/restaurants/${id}`);
    return response.data;
}
