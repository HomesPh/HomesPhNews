"use server";

import AXIOS_INSTANCE_PUBLIC from "../../axios-instance";
import type { ArticleResource } from "../../../types/ArticleResource";

export type ArticleByIdResponse = ArticleResource;

/**
 * Fetch a single article by ID
 * Returns only the article data, not the entire Axios response
 */
export async function getArticleById(id: string): Promise<ArticleByIdResponse> {
  const response = await AXIOS_INSTANCE_PUBLIC.get<ArticleByIdResponse>(`/articles/${id}`);
  // Return only the data to avoid serializing Axios response objects with circular references
  return response.data;
}