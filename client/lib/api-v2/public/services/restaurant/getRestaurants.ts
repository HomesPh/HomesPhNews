import AXIOS_INSTANCE_PUBLIC from "../../axios-instance";
import type { Restaurant } from "../../../types/RestaurantResource";
import type { AxiosResponse } from "axios";

export interface GetPublicRestaurantsParams {
    limit?: number;
    page?: number;
    country?: string;
    category?: string;
    topic?: string;
    search?: string;
}

/**
 * Get all published restaurants for public view
 */
export async function getRestaurants(
    params?: GetPublicRestaurantsParams
): Promise<AxiosResponse<{ data: Restaurant[], current_page: number, last_page: number, total: number }>> {
    return AXIOS_INSTANCE_PUBLIC.get("/restaurants", { params });
}
