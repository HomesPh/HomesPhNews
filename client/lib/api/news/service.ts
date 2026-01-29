import api from "../axios";
import {
  fake_landing_page_articles,
  fake_articles_list_response,
  fake_latest_articles,
  fake_search_results,
  fake_countries,
  fake_categories,
  fake_stats,
} from "./fake_data";
import {
  Article,
  ArticleFilters,
  ArticlesFeedResponse,
  ArticlesListResponse,
  LatestArticlesResponse,
  SearchArticlesResponse,
  CountriesResponse,
  CategoriesResponse,
  ArticleStatsResponse,
} from "./types";

/**
 * Fetch articles in two modes:
 * - feed: grouped sections (trending, most_read, latest_global)
 * - list: flat list with pagination/meta
 * Mirrors GET /article; parameters follow ArticleFilters.
 *
 * @param params.mode feed | list (forces list if search provided)
 * @param params.search optional keyword search
 * @param params.country optional country filter
 * @param params.category optional category filter
 * @param params.limit page size (list mode)
 * @param params.offset pagination offset (list mode)
 * @returns ArticlesFeedResponse (feed) | ArticlesListResponse (list)
 */
export async function getArticlesList(params: ArticleFilters): Promise<ArticlesFeedResponse | ArticlesListResponse | undefined> {
  try {
    // fakes data for dev purposes
    if (process.env.FAKE_API === "true") {
      if (params.mode === "list") {
        return fake_articles_list_response;
      }
      return fake_landing_page_articles;
    }

    const response = await api.get<ArticlesFeedResponse | ArticlesListResponse>("/article", { params });
    return response.data;
  } catch (error) {
    console.error(`Error fetching articles list:`, error);
    throw error;
  }
}

/**
 * Fetch a single article by ID (GET /articles/{id}).
 * @param id article id (uuid)
 * @returns Article
 */
export async function getArticleById(id: string): Promise<Article> {
  try {
    const response = await api.get<Article>(`/articles/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching article ${id}:`, error);
    throw error;
  }
}

/**
 * Increment article view count (POST /articles/{id}/view).
 * @param id article id (uuid)
 */
export async function incrementArticleViews(id: string): Promise<void> {
  try {
    await api.post(`/articles/${id}/view`);
  } catch (error) {
    console.error(`Error incrementing views for article ${id}:`, error);
  }
}

/**
 * Fetch latest articles sorted by timestamp (GET /latest).
 * @param params.limit optional max items
 * @returns LatestArticlesResponse
 */
export async function getLatestArticles(params?: { limit?: number }): Promise<LatestArticlesResponse> {
  try {
    if (process.env.FAKE_API === "true") {
      return fake_latest_articles;
    }

    const response = await api.get<LatestArticlesResponse>("/latest", { params });
    return response.data;
  } catch (error) {
    console.error(`Error fetching latest articles:`, error);
    throw error;
  }
}

/**
 * Search articles by title or content (GET /search).
 * @param params.q required search query
 * @param params.limit optional max items
 * @returns SearchArticlesResponse
 */
export async function searchArticles(params: { q: string; limit?: number }): Promise<SearchArticlesResponse> {
  try {
    if (process.env.FAKE_API === "true") {
      return fake_search_results;
    }

    const response = await api.get<SearchArticlesResponse>("/search", { params });
    return response.data;
  } catch (error) {
    console.error(`Error searching articles:`, error);
    throw error;
  }
}

/**
 * Get all countries with article counts (GET /countries).
 * @returns CountriesResponse
 */
export async function getCountries(): Promise<CountriesResponse> {
  try {
    if (process.env.FAKE_API === "true") {
      return fake_countries;
    }

    const response = await api.get<CountriesResponse>("/countries");
    return response.data;
  } catch (error) {
    console.error(`Error fetching countries:`, error);
    throw error;
  }
}

/**
 * Get all categories with article counts (GET /categories).
 * @returns CategoriesResponse
 */
export async function getCategories(): Promise<CategoriesResponse> {
  try {
    if (process.env.FAKE_API === "true") {
      return fake_categories;
    }

    const response = await api.get<CategoriesResponse>("/categories");
    return response.data;
  } catch (error) {
    console.error(`Error fetching categories:`, error);
    throw error;
  }
}

/**
 * Get article statistics (total counts for articles, countries, categories) (GET /stats).
 * @returns ArticleStatsResponse
 */
export async function getArticleStats(): Promise<ArticleStatsResponse> {
  try {
    if (process.env.FAKE_API === "true") {
      return fake_stats;
    }

    const response = await api.get<ArticleStatsResponse>("/stats");
    return response.data;
  } catch (error) {
    console.error(`Error fetching article stats:`, error);
    throw error;
  }
}
