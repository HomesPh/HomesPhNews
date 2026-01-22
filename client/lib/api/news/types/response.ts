import { Article, ArticleListItem } from "./model";

export interface ArticlesFeedResponse {
  trending: Article[];
  most_read: Article[];
  latest_global: Article[];
}

export type LandingPageArticlesResponse = ArticlesFeedResponse;

export interface ArticlesListResponse {
  data: ArticleListItem[];
  meta: {
    limit: number;
    offset: number;
    count: number;
  };
}