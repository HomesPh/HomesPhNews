import api from "../axios";
import { Article, ArticleFilters, ArticlesFeedResponse, ArticlesListResponse } from "./types";

/**
 * Returns Trending, Most Read (Latest), and Latest Global articles from Redis. 
 * Optionally filter by country, category, or search term.
 * @param params.mode - Select either "feed" or "list".
 * @param params.search - Search term to filter by.
 * @param params.country - Country to filter by.
 * @param params.category - Category to filter by.
 * @param params.limit - Amount of articles to show per fetch.
 * @param params.offset - Pagination index
 */
export async function getArticles(params: ArticleFilters) {
  const response = await api.get<ArticlesFeedResponse | ArticlesListResponse>("/article", { params });
  return response.data;
}

/**
 * Returns a single article by ID
 * @param id - ID of the article to return
 */
export async function getArticleById(id: string): Promise<Article> {
  const response = await api.get<Article>(`/article/${id}`);
  return response.data;
}