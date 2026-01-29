import { client } from "../client";
import {
  ArticleResource,
  ArticleCollectionWithMeta,
  ArticleFeedResponse,
  ArticleFilters
} from "../types";

/**
 * Service for interacting with article-related endpoints.
 * Handles both public feed access and administrative article management.
 */
export const articleService = {
  /**
   * Retrieves a paginated list of articles based on provided filters.
   * 
   * @param params Filtering and pagination options
   * @returns A collection of articles with metadata
   */
  async list(params?: ArticleFilters): Promise<ArticleCollectionWithMeta> {
    return client.get<ArticleCollectionWithMeta>("/articles", { params: params as any });
  },

  /**
   * Retrieves a curated feed of articles (trending, most read, etc.).
   * 
   * @param params Filtering options for the feed
   * @returns A structured feed response
   */
  async feed(params?: ArticleFilters): Promise<ArticleFeedResponse> {
    return client.get<ArticleFeedResponse>("/articles/feed", { params: params as any });
  },

  /**
   * Retrieves a single article's full details.
   * 
   * @param id The unique identifier of the article
   * @returns The article resource wrapper
   */
  async getById(id: string): Promise<{ data: ArticleResource }> {
    // Why this is different? 
    // The API's ArticleResource returns the article 
    // without wrapping it in a data property.
    const article = await client.get<ArticleResource>(`/articles/${id}`);
    return { data: article };
  },

  /**
   * Increments the view count for a specific article.
   * Usually called when an article page is viewed.
   * 
   * @param id The unique identifier of the article
   * @returns Confirmation message and the updated view count
   */
  async incrementViews(id: string): Promise<{ message: string; views_count: number }> {
    return client.post<{ message: string; views_count: number }>(`/articles/${id}/view`);
  },

  /**
   * Public-facing article search/index.
   * Used for general browsing outside of the curated feed.
   * 
   * @param params Search and filter parameters
   * @returns Raw response data
   */
  async index(params?: ArticleFilters): Promise<any> {
    return client.get("/article", { params: params as any });
  },

  /**
   * [Admin] Creates a new article.
   * 
   * @param data The article payload (StoreArticleRequest)
   * @returns The created article data
   */
  async store(data: any): Promise<any> {
    return client.post("/admin/articles", data);
  },

  /**
   * [Admin] Updates an existing article.
   * 
   * @param id The unique identifier of the article to update
   * @param data The update payload (UpdateArticleRequest)
   * @returns The updated article data
   */
  async update(id: string, data: any): Promise<any> {
    return client.put(`/admin/articles/${id}`, data);
  },

  /**
   * [Admin] Deletes an article permanently.
   * 
   * @param id The unique identifier of the article to delete
   * @returns Confirmation message
   */
  async delete(id: string): Promise<any> {
    return client.delete(`/admin/articles/${id}`);
  }
};

