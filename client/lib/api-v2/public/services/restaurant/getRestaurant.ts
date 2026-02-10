import AXIOS_INSTANCE_PUBLIC from "../../axios-instance";
import type { Restaurant } from "../../../types/RestaurantResource";
import type { AxiosResponse } from "axios";

/**
 * Get a single published restaurant by ID
 */
export async function getRestaurant(id: string): Promise<AxiosResponse<Restaurant>> {
    return AXIOS_INSTANCE_PUBLIC.get(`/restaurants/${id}`);
}
