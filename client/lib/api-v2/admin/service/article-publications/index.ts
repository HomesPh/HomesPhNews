"use client";

import AXIOS_INSTANCE_ADMIN from "../../axios-instance";
import type { AxiosResponse } from "axios";

export interface CreateArticlePublicationRequest {
    date: string;
    time: string;
    articles: {
        id: string;
        title: string;
        image?: string | null;
        category?: string | null;
        country?: string | null;
        summary?: string | null;
        source?: string | null;
    }[];
}

export interface ArticlePublication {
    id: number;
    article_id: string;
    title: string;
    scheduled_at: string;
    status: 'pending' | 'published' | 'failed';
    image_url?: string;
    category?: string;
    country?: string;
}

/**
 * Schedule article publications
 * POST /admin/article-publications
 */
export async function scheduleArticles(
    body: CreateArticlePublicationRequest
): Promise<AxiosResponse<{ message: string; data: ArticlePublication[] }>> {
    return AXIOS_INSTANCE_ADMIN.post("/v1/admin/article-publications", body);
}

/**
 * Get scheduled publications
 * GET /admin/article-publications
 */
export async function getScheduledArticles(params?: {
    start_date?: string;
    end_date?: string;
}): Promise<AxiosResponse<ArticlePublication[]>> {
    return AXIOS_INSTANCE_ADMIN.get("/v1/admin/article-publications", { params });
}
