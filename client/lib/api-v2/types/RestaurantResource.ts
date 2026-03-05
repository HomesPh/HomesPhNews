/**
 * Restaurant TypeScript types for the Admin API
 * Enhanced with real restaurant data fields
 */

export interface RestaurantSummary {
  id: string;
  name: string;
  country: string;
  city: string;
  cuisine_type: string;
  price_range: string;
  rating: number;
  image_url: string;
  timestamp: number;
  // Quick engagement fields
  clickbait_hook?: string;
  is_filipino_owned?: boolean;

  // Status & detailed pricing
  status?: 'published' | 'draft' | 'deleted' | 'archived';
  avg_meal_cost?: string;
  /** True when item is from Redis (Being Processed), not yet in DB */
  is_redis?: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  country: string;
  city: string;
  cuisine_type: string;
  description: string;

  // Location & Maps
  address: string;
  latitude?: number | null;
  longitude?: number | null;
  google_maps_url?: string;

  // Business Info
  is_filipino_owned?: boolean;
  brand_story?: string;
  owner_info?: string;

  // Food & Menu
  specialty_dish?: string;
  menu_highlights?: string;
  food_topics?: string;

  // Pricing & Budget
  price_range?: string;
  budget_category?: string;
  avg_meal_cost?: string;

  // Engagement
  rating: number;
  clickbait_hook?: string;
  why_filipinos_love_it?: string;

  // Contact
  contact_info?: string;
  website?: string;
  social_media?: string;
  opening_hours?: string;

  // Meta
  image_url: string;
  original_url: string;
  timestamp: number;

  // New standardized fields
  category?: string;
  location?: string;
  status?: 'published' | 'draft' | 'deleted' | 'archived';
  tags?: string[];
  features?: string[];
  /** Site names this restaurant is published to (e.g. ["FilipinoHomes", "Main News Portal"]) */
  published_sites?: string[];
  /** True when from Redis (Being Processed), not yet in DB */
  is_redis?: boolean;
}

export interface RestaurantStats {
  total_restaurants: number;
  by_country: Record<string, number>;
}
