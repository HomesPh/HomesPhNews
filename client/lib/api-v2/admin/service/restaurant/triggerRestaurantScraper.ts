"use client";

import axios from "axios";

const RESTAURANT_SCRAPER_API_URL =
    process.env.NEXT_PUBLIC_RESTAURANTS_SERVICE_URL || "http://localhost:8012";

export interface ScraperLocation {
    country_name: string | null;
    city_name: string | null;
}

/**
 * Fetch the list of (country, city) locations used by the restaurant scraper.
 * Use for targeted scrape country/city pickers.
 */
export async function getRestaurantScraperLocations(): Promise<ScraperLocation[]> {
    const response = await axios.get<ScraperLocation[]>(
        `${RESTAURANT_SCRAPER_API_URL}/locations`,
        { timeout: 15_000 }
    );
    return response.data ?? [];
}

export interface RestaurantScraperResultItem {
    country_name?: string;
    city_name?: string;
    status: "success" | "error" | "no_restaurants";
    saved?: number;
    skipped_duplicate?: number;
    error?: string;
    duration?: number;
}

export interface RestaurantTriggerScraperResponse {
    status: "completed";
    message: string;
    duration_seconds: number;
    success_count: number;
    error_count: number;
    results?: RestaurantScraperResultItem[];
    timestamp: string;
}

/** One (country, city) pair so a city is scoped to that country. */
export interface LocationPair {
    country_name: string;
    city_name: string;
}

/**
 * Trigger a targeted restaurant scrape.
 * - If locations is non-empty: runs only for those exact (country, city) pairs.
 * - Otherwise: runs for countries (all cities) and/or cities (any country), matching any.
 * Uses NEXT_PUBLIC_RESTAURANTS_SERVICE_URL (restaurants service, e.g. http://localhost:8012).
 */
export async function triggerTargetedRestaurantScraper(
    countries: string[],
    cities: string[] = [],
    locations: LocationPair[] = []
): Promise<RestaurantTriggerScraperResponse> {
    const body =
        locations.length > 0
            ? { countries: [], cities: [], locations }
            : { countries, cities, locations: [] };
    const response = await axios.post<RestaurantTriggerScraperResponse>(
        `${RESTAURANT_SCRAPER_API_URL}/trigger/restaurants/targeted`,
        body,
        {
            timeout: 30 * 60 * 1000, // 30 minutes
            validateStatus: (status) => status === 200 || status === 409,
        }
    );
    if (response.status === 409) {
        throw new Error("A restaurant job is already running. Please wait for it to complete.");
    }
    return response.data;
}

