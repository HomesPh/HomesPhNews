"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";
import type { Restaurant } from "../../../types/RestaurantResource";

export interface CreateRestaurantRequest {
    name: string;
    description: string;
    image_url: string;
    category: string;
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

export interface CreateRestaurantResponse {
    data: Restaurant;
    message?: string;
}

/**
 * Create a new restaurant
 * POST /admin/restaurants
 */
export async function createRestaurant(
    body: CreateRestaurantRequest
): Promise<AxiosResponse<CreateRestaurantResponse>> {
    return AXIOS_INSTANCE_ADMIN.post<CreateRestaurantResponse>(`/v1/admin/restaurants`, body);
}
