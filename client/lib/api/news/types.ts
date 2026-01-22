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

export interface ArticleMini {
  id: string;
  country: string;
  category: string;
  title: string;
  image_url: string;
}

export interface ArticleFilters {
  search?: string;
  country?: string;
  category?: string;
}

//
// Responses
//

export interface LandingPageArticlesResponse {
  trending: Article[];
  most_read: Article[];
  latest_global: Article[];
  filter_applied: {
    search?: string | null;
    country?: string | null;
    category?: string | null;
  };
}

export interface ArticlesListResponse {
  data: ArticleMini[];
  meta: {
    limit: number;
    offset: number;
    count: number;
  };
}