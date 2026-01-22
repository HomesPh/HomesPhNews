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
}

export interface ArticleListItem {
  id: string;
  country: string;
  category: string;
  title: string;
  image_url: string;
}

export interface ArticleFilters {
  mode: "feed" | "list";
  search?: string;
  country?: string;
  category?: string;
  limit: number;
  offset: number;
}