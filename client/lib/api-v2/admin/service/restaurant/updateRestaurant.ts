"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";
import type { Restaurant } from "../../../types/RestaurantResource";

export interface UpdateRestaurantRequest {
    name?: string;
    description?: string;
    image_url?: string;
    category?: string;
    rating?: number;
    location?: string;
    country?: string;
    website?: string;

    // New fields
    cuisine_type?: string;
    price_range?: string;
    address?: string;
    google_maps_url?: string;
    specialty_dish?: string;
    opening_hours?: string;
    contact_info?: string;
    is_filipino_owned?: boolean;
    budget_category?: string;
    social_media?: string;
    tags?: string[];
    features?: string[];

    // Status
    status?: "published" | "pending" | "draft";
}

export interface UpdateRestaurantResponse {
    data: Restaurant;
    message?: string;
}

/**
 * Update an existing restaurant
 * PUT /admin/restaurants/{id}
 */
export async function updateRestaurant(
    id: string,
    body: UpdateRestaurantRequest
): Promise<AxiosResponse<UpdateRestaurantResponse>> {
    return AXIOS_INSTANCE_ADMIN.put<UpdateRestaurantResponse>(`/v1/admin/restaurants/${id}`, body);
}
