import { client } from "../client";
import {
  ArticleResource,
  ArticleCollectionWithMeta,
  ArticleFeedResponse,
  ArticleFilters
} from "../types";

/**
 * Article service
 */
export const articleService = {
  /**
   * Get paginated list of articles
   */
  async list(params?: ArticleFilters): Promise<ArticleCollectionWithMeta> {
    return client.get<ArticleCollectionWithMeta>("/articles", { params: params as any });
  },

  /**
   * Get curated article feed
   */
  async feed(params?: ArticleFilters): Promise<ArticleFeedResponse> {
    return client.get<ArticleFeedResponse>("/articles/feed", { params: params as any });
  },

  /**
   * Get single article by ID
   */
  async getById(id: string): Promise<{ data: ArticleResource }> {
    return client.get<{ data: ArticleResource }>(`/articles/${id}`);
  },

  /**
   * Increment article view count
   */
  async incrementViews(id: string): Promise<{ message: string; views_count: number }> {
    return client.post<{ message: string; views_count: number }>(`/articles/${id}/view`);
  },

  /**
   * User-facing article index (legacy or specific use-case)
   */
  async index(params?: ArticleFilters): Promise<any> {
    return client.get("/article", { params: params as any });
  },

  /**
   * Admin: Store new article
   */
  async store(data: any): Promise<any> {
    return client.post("/admin/articles", data);
  },

  /**
   * Admin: Update article
   */
  async update(id: string, data: any): Promise<any> {
    return client.put(`/admin/articles/${id}`, data);
  },

  /**
   * Admin: Delete article
   */
  async delete(id: string): Promise<any> {
    return client.delete(`/admin/articles/${id}`);
  }
};
