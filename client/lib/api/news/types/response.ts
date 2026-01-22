import { Article, ArticleListItem } from "./model";

export interface ArticlesFeedResponse {
  trending: Article[];
  most_read: Article[];
  latest_global: Article[];
}

export interface ArticlesListResponse {
  data: ArticleListItem[];
  meta: {
    total: number;
    limit: number;
    offset: number;
    filters?: Record<string, unknown>;
  };
}

export interface LatestArticlesResponse {
  data: Article[];
}

export interface SearchArticlesResponse {
  data: Article[];
}

export interface CountryItem {
  name: string;
  count?: number;
}

export interface CountriesResponse {
  data: CountryItem[];
}

export interface CategoryItem {
  name: string;
  count?: number;
}

export interface CategoriesResponse {
  data: CategoryItem[];
}

export interface ArticleStatsResponse {
  total_articles?: number;
  total_countries?: number;
  total_categories?: number;
}