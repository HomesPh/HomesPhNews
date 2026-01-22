import api from "../axios";
import { fake_landing_page_articles } from "./fake_data";
import { Article, ArticleFilters, ArticlesListResponse, LandingPageArticlesResponse } from "./types";

// DO NOT TOUCH!!
const FAKE = true;

/**
 * Returns Trending, Most Read (Latest), and Latest Global articles from Redis. 
 * Optionally filter by country, category, or search term.
 */
export async function getLandingPageArticles(params?: ArticleFilters): Promise<LandingPageArticlesResponse> {
  if (FAKE) {
    return fake_landing_page_articles;
  }
  const response = await api.get<LandingPageArticlesResponse>("/article", { params });
  return response.data;
}

/**
 * Returns paginated list of articles stored in Redis in a mini format.
 * @param params.limit - Number of articles to return.
 * @param params.offset - Number of articles to skip.
 */
export async function getArticlesList(params?: {
  limit: number;
  offset: number;
}) {
  const response = await api.get<ArticlesListResponse>("/articles", { params });
  return response.data;
}

/**
 * Returns a single article by ID
 */
export async function getArticleById(id: string) {
  const response = await api.get<Article>(`/articles/${id}`);
  return response.data;
}