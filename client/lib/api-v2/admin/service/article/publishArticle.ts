"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";
import type { ArticleResource } from "../../../types/ArticleResource";

export interface PublishArticleRequest {
  published_sites: string[];
  custom_titles?: string[] | null;
  reason?: string | null;

  // Optional Article Data for atomic publish
  title?: string;
  summary?: string;
  content?: string;
  category?: string;
  country?: string;
  image?: string;
  image_url?: string;
  topics?: string[];
  keywords?: string;
  content_blocks?: any[];
  template?: string;
  author?: string;
  gallery_images?: any[];
  slug?: string;
  image_position?: number;
  image_position_x?: number;
}

export interface PublishArticleResponse {
  data: ArticleResource;
}

/**
 * Publish a pending article to the database.
 * POST /admin/articles/{id}/publish
 */
export async function publishArticle(
  id: string,
  body: PublishArticleRequest
): Promise<AxiosResponse<PublishArticleResponse>> {
  return AXIOS_INSTANCE_ADMIN.post<PublishArticleResponse>(
    `/v1/admin/articles/${id}/publish`,
    body
  );
}

