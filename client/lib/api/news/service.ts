import api from "../axios";
import { Article, ArticleFilters, LandingPageArticlesResponse } from "./types";

/**
 * Returns Trending, Most Read (Latest), and Latest Global articles from Redis. 
 * Optionally filter by country, category, or search term.
 * @param params.country - Country to filter by.
 * @param params.category - Category to filter by.
 * @param params.search - Search term to filter by.
 */
export async function getLandingPageArticles(params?: ArticleFilters): Promise<LandingPageArticlesResponse> {
  const response = await api.get<LandingPageArticlesResponse>("/article", { params });
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