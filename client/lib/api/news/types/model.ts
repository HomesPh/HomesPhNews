export type ISOString = string;

export interface Article {
  id: string;
  country: string;
  category: string;
  title: string;
  content: string;
  keywords: string;
  original_url: string;
  image_url: string;
  timestamp: ISOString;
  topics?: string[];
}

export interface ArticleListItem {
  id: string;
  country: string;
  category: string;
  title: string;
  summary: string;
  image: string;
  image_url?: string;
  created_at: ISOString;
  views_count?: number;
}

export interface ArticleFilters {
  mode: "feed" | "list";
  search?: string;
  topic?: string;
  country?: string;
  category?: string;
  limit?: number;
  offset?: number;
}