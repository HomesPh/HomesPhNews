/**
 * API Type Definitions
 * This module contains all TypeScript interfaces used across the API library.
 */

/**
 * Represents a single article entity with all its metadata.
 */
export interface Article {

  /** Internal UUID or numeric ID */
  id: string;

  /** Legacy article ID if applicable */
  article_id: string | null;

  /** Article title */
  title: string;

  /** Original title from source if available */
  original_title: string | null;

  /** Brief summary or excerpt */
  summary: string | null;

  /** Full content of the article (rendered HTML or markdown) */
  content: string | null;

  /** Main image path or identifier */
  image: string | null;

  /** Article category (e.g., "politics", "tech") */
  category: string | null;

  /** Country of origin or focus */
  country: string | null;

  /** Source name (e.g., "BBC", "CNN") */
  source: string | null;

  /** Link to the original article source */
  original_url: string | null;

  /** Array of keywords associated with the article */
  keywords: string[] | null;

  /** Array of topics associated with the article */
  topics: string[] | null;

  /** Current status ("published", "pending", etc.) */
  status: string;

  /** Flag for featured content */
  is_featured: number | null;

  /** Flag for visibility on site */
  is_live: number | null;

  /** Comma-separated list of sites where this is published */
  published_sites: string | null;

  /** Alternative titles for A/B testing or site-specific use */
  custom_titles: string[] | null;

  /** Number of times the article has been viewed */
  views_count: number;

  /** ISO timestamp of creation */
  created_at: string | null;

  /** ISO timestamp of last update */
  updated_at: string | null;

  /** Associated site ID */
  site_id: number | null;

  /** Fully qualified URL to the main image */
  image_url: string;
}

/**
 * A lighter version of the Article entity used in collections and feeds.
 */
export interface ArticleResource {
  id: string | null;
  title: string;
  summary: string;
  content: string;
  image: string;
  image_url?: string;
  category: string;
  country: string;
  status: string;
  views_count: number;
  topics: any;
  keywords: string;
  source: string;
  original_url: string;
  created_at: string | null;
  timestamp?: string | null;
  published_sites: string | string[] | null;
}

/**
 * Standard collection response for articles.
 */
export interface ArticleCollection {
  /** Array of article resources */
  data: ArticleResource[];
}

/**
 * Collection response with pagination metadata.
 */
export interface ArticleCollectionWithMeta extends ArticleCollection {
  /** Pagination and filter metadata */
  meta: {
    /** Total number of records matching filters */
    total: number;

    /** Number of items per page requested */
    limit: number | null;

    /** Offset/starting point of current page */
    offset: number | null;

    /** Applied filters */
    filters: any[];
  };
}

/**
 * Curated response for the homepage or dashboard.
 */
export interface ArticleFeedResponse {
  /** Currently trending articles */
  trending: ArticleResource[];

  /** Articles with the highest engagement */
  most_read: ArticleResource[];

  /** Newest global articles */
  latest_global: ArticleResource[];
}

/**
 * Filters available for article listing and search.
 */
export interface ArticleFilters {

  /** Filter mode: feed uses curation, list uses simple pagination */
  mode?: "feed" | "list" | null;

  /** General search query */
  q?: string | null;

  /** Search query (alias for q) */
  search?: string | null;

  /** Filter by country code */
  country?: string | null;

  /** Filter by category name */
  category?: string | null;

  /** Filter by single topic */
  topic?: string | null;

  /** Filter by multiple topics (comma separated) */
  topics?: string | null;

  /** Number of items to return */
  limit?: number | null;

  /** Number of items to skip */
  offset?: number | null;

  /** Filter by publication status */
  status?: "published" | "pending" | "rejected" | "pending review" | "all" | null;

  /** Field to sort by */
  sort_by?: "created_at" | "views_count" | "title" | "timestamp" | null;

  /** Sort order */
  sort_direction?: "asc" | "desc" | null;

  /** Items per page */
  per_page?: number | null;

  /** Page number (1-indexed) */
  page?: number | null;

  /** Filter by start date (ISO string) */
  start_date?: string | null;

  /** Filter by end date (ISO string) */
  end_date?: string | null;
}

/**
 * High-level analytics metrics.
 */
export interface AnalyticsOverview {
  total_page_news: number;
  unique_visitors: number;
  total_clicks: number;
  avg_engagement: number;
}

/**
 * Daily traffic data point for charts.
 */
export interface TrafficTrend {
  /** The date for this trend point */
  date: string;
  total_page_news: string | number;
  unique_visitors: string | number;
}

/**
 * Complete analytics report response.
 */
export interface AnalyticsResponse {
  /** The time range covered by this report */
  range: string | any[] | null;

  /** KPI summary metrics */
  overview: AnalyticsOverview;

  /** Historical traffic data */
  traffic_trends: TrafficTrend[];

  /** Content distribution by category */
  content_by_category: Article[];

  /** Regional performance metrics */
  performance_by_country: Article[];
}

/**
 * Authenticated user information.
 */
export interface UserResource {
  id: number;
  name: string;
  email: string;

  /** Flag indicating if the user has administrative privileges */
  is_admin: boolean;

  email_verified_at: string | null;
}

/**
 * Credentials for user authentication.
 */
export interface LoginRequest {
  email: string;
  password?: string;
}

/**
 * Successful authentication response.
 */
export interface LoginResponse {
  /** JWT or session token */
  token: string;

  /** The user record */
  user: UserResource;
}

/**
 * Represents a site/domain where articles can be published.
 */
export interface SiteResource {
  id: number;

  /** Display name of the site */
  name: string;

  /** Full domain name */
  domain: string;

  /** Verification or active status */
  status: string;

  /** Site logo or banner */
  image: string | null;

  /** Contact person name */
  contact_name: string | null;

  /** Contact email address */
  contact_email: string | null;

  description: string | null;

  /** Categories supported by this site */
  categories: any[] | null;

  /** When it was added/requested */
  requested: string;

  /** Number of articles published on this site */
  articles_count: number;

  /** Monthly traffic estimation */
  monthly_views: number;
}

/**
 * Payload for creating a new article.
 */
export interface StoreArticleRequest {
  title: string;
  summary: string;
  content: string;
  category: string;
  country: string;
  image?: string | null;
  status?: "published" | "pending review" | null;
  topics?: string[] | null;
  published_sites?: string[] | null;
}

/**
 * Payload for updating an existing article.
 */
export interface UpdateArticleRequest extends Partial<StoreArticleRequest> {
  image_url?: string | null;
  custom_titles?: string[] | null;
  keywords?: string | null;
}

/**
 * Laravel-style validation error bag.
 * Map of field names to arrays of error messages.
 */
export interface MessageBag {
  [key: string]: string[];
}

/**
 * standard validation error response from the backend.
 */
export interface ValidationErrorResponse {

  /** General error message (e.g., "The given data was invalid.") */
  message: string;

  /** Detailed field errors */
  errors: MessageBag;
}

