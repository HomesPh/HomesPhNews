import { Article, ArticleListItem } from "./model";

export interface ArticlesFeedResponse {
  trending: Article[];
  most_read: Article[];
  latest_global: Article[];
}

export interface ArticlesListResponse {
  data: ArticleListItem[];
  meta: {
    limit: number;
    offset: number;
    count: number;
  };
}