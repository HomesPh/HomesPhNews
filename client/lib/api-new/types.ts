/**
 * API Type Definitions
 */

export interface Article {
  id: string;
  article_id: string | null;
  title: string;
  original_title: string | null;
  summary: string | null;
  content: string | null;
  image: string | null;
  category: string | null;
  country: string | null;
  source: string | null;
  original_url: string | null;
  keywords: string[] | null;
  topics: string[] | null;
  status: string;
  is_featured: number | null;
  is_live: number | null;
  published_sites: string | null;
  custom_titles: string[] | null;
  views_count: number;
  created_at: string | null;
  updated_at: string | null;
  site_id: number | null;
  image_url: string;
}

export interface ArticleResource {
  id: string | null;
  title: string;
  summary: string;
  content: string;
  image: string;
  category: string;
  country: string;
  status: string;
  views_count: number;
  topics: any;
  keywords: string;
  source: string;
  original_url: string;
  created_at: string | null;
  published_sites: string | string[] | null;
}

export interface ArticleCollection {
  data: ArticleResource[];
}

export interface ArticleCollectionWithMeta extends ArticleCollection {
  meta: {
    total: number;
    limit: number | null;
    offset: number | null;
    filters: any[];
  };
}

export interface ArticleFeedResponse {
  trending: ArticleResource[];
  most_read: ArticleResource[];
  latest_global: ArticleResource[];
}

export interface ArticleFilters {
  mode?: "feed" | "list" | null;
  q?: string | null;
  search?: string | null;
  country?: string | null;
  category?: string | null;
  topic?: string | null;
  topics?: string | null;
  limit?: number | null;
  offset?: number | null;
  status?: "published" | "pending" | "rejected" | "pending review" | "all" | null;
  sort_by?: "created_at" | "views_count" | "title" | "timestamp" | null;
  sort_direction?: "asc" | "desc" | null;
  per_page?: number | null;
  page?: number | null;
  start_date?: string | null;
  end_date?: string | null;
}

export interface AnalyticsOverview {
  total_page_news: number;
  unique_visitors: number;
  total_clicks: number;
  avg_engagement: number;
}

export interface TrafficTrend {
  date: string;
  total_page_news: string | number;
  unique_visitors: string | number;
}

export interface AnalyticsResponse {
  range: string | any[] | null;
  overview: AnalyticsOverview;
  traffic_trends: TrafficTrend[];
  content_by_category: Article[];
  performance_by_country: Article[];
}

export interface UserResource {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  email_verified_at: string | null;
}

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface LoginResponse {
  token: string;
  user: UserResource;
}

export interface SiteResource {
  id: number;
  name: string;
  domain: string;
  status: string;
  image: string | null;
  contact_name: string | null;
  contact_email: string | null;
  description: string | null;
  categories: any[] | null;
  requested: string;
  articles_count: number;
  monthly_views: number;
}

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

export interface UpdateArticleRequest extends Partial<StoreArticleRequest> {
  image_url?: string | null;
  custom_titles?: string[] | null;
  keywords?: string | null;
}

export interface MessageBag {
  [key: string]: string[];
}

export interface ValidationErrorResponse {
  message: string;
  errors: MessageBag;
}
