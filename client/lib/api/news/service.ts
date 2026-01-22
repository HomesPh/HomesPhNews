import api from "../axios";
import { fake_landing_page_articles } from "./fake_data";
import { Article, ArticleFilters, ArticlesFeedResponse, ArticlesListResponse } from "./types";

// Toggle this to true if you want to force mock data when API is down
const FAKE = true;

/**
 * Returns Trending, Most Read (Latest), and Latest Global articles from Redis. 
 * Optionally filter by country, category, or search term.
 */
export async function getArticlesList({ limit = 10, ...params }: ArticleFilters) {

  if (FAKE) {
    return fake_landing_page_articles;
  }

  const response = await api.get<ArticlesFeedResponse | ArticlesListResponse>("/article", {
    params: {
      // 10 limit
      limit,
      // everything else
      ...params
    }
  });
  return response.data;
}
/**
 * Returns a single article by ID
 */
export async function getArticleById(id: string) {
  if (FAKE) {
    const allArticles = [
      ...fake_landing_page_articles.latest_global,
      ...fake_landing_page_articles.trending,
      ...fake_landing_page_articles.most_read
    ];
    // Loose comparison for string/number id mismatch
    return allArticles.find(a => String(a.id) === String(id)) || allArticles[0];
  }

  const response = await api.get<Article>(`/articles/${id}`);
  return response.data;
}
