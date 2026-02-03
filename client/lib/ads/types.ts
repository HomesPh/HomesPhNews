// =============================================================================
// Ad Types
// =============================================================================

/** Possible ad placement locations */
export type AdPlacement =
  | "header"
  | "sidebar-top"
  | "sidebar-bottom"
  | "in-article"
  | "footer"
  | "popup"
  | "between-articles";

/** Possible ad sizes (width x height) */
export type AdSize =
  | "728x90" // Leaderboard
  | "300x250" // Medium Rectangle
  | "300x600" // Half Page
  | "320x50" // Mobile Leaderboard
  | "160x600" // Wide Skyscraper
  | "970x250"; // Billboard

/** Ad status */
export type AdStatus = "active" | "paused" | "expired" | "scheduled";

/** Ad type */
export type AdType = "image" | "html" | "script";

// =============================================================================
// Ad Data Structures
// =============================================================================

/** Single ad unit */
export interface Ad {
  id: string;
  name: string;
  type: AdType;
  placement: AdPlacement;
  size: AdSize;
  status: AdStatus;
  content: string; // Image URL, HTML content, or script code
  link?: string; // Click-through URL
  alt?: string; // Alt text for image ads
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
  impressions: number;
  clicks: number;
  priority: number; // Higher = more priority
  createdAt: string;
  updatedAt: string;
}

/** Form data for creating/updating an ad */
export interface AdFormData {
  name: string;
  type: AdType;
  placement: AdPlacement;
  size: AdSize;
  status: AdStatus;
  content: string;
  link?: string;
  alt?: string;
  startDate?: string;
  endDate?: string;
  priority?: number;
}

/** Filters for querying ads */
export interface AdFilters {
  placement?: AdPlacement;
  status?: AdStatus;
  type?: AdType;
  search?: string;
}

/** Pagination options */
export interface AdPagination {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

/** Paginated ads response */
export interface PaginatedAdsResponse {
  data: Ad[];
  pagination: AdPagination;
}

// =============================================================================
// API Response Types
// =============================================================================

export interface AdResponse {
  success: boolean;
  data?: Ad;
  error?: string;
}

export interface AdsListResponse {
  success: boolean;
  data?: PaginatedAdsResponse;
  error?: string;
}
