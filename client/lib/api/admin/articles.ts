import api from "@/lib/api/axios";
import { Article, ArticlesApiResponse } from "@/app/admin/articles/data";

interface ArticleFilters {
    status?: string;
    category?: string;
    country?: string;
    search?: string;
    page?: number;
    per_page?: number;
}

/**
 * Fetch articles for the admin dashboard
 */
export async function getAdminArticles(filters: ArticleFilters): Promise<ArticlesApiResponse> {
    const params = new URLSearchParams();

    if (filters.status && filters.status !== 'all') params.append('status', filters.status);
    if (filters.category && filters.category !== 'All Category') params.append('category', filters.category);
    if (filters.country && filters.country !== 'All Countries') params.append('country', filters.country);
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.per_page) params.append('per_page', filters.per_page.toString());

    try {
        const response = await api.get<ArticlesApiResponse>(`/admin/articles?${params.toString()}`);
        console.log(`[API] Fetch Articles: ${response.status} OK`);
        return response.data;
    } catch (error: any) {
        console.error(`[API] Fetch Articles Failed: ${error.response?.status || 'Unknown error'}`);
        throw error;
    }
}

/**
 * Fetch a single article by ID
 */
export async function getAdminArticle(id: string | number): Promise<Article> {
    try {
        const response = await api.get<Article>(`/admin/articles/${id}`);
        console.log(`[API] Fetch Article ${id}: ${response.status} OK`);
        return response.data;
    } catch (error: any) {
        console.error(`[API] Fetch Article ${id} Failed: ${error.response?.status || 'Unknown error'}`);
        throw error;
    }
}

/**
 * Update a pending (Redis) article without touching the main database.
 */
export async function updatePendingArticle(
    id: string,
    payload: {
        title?: string;
        summary?: string;
        content?: string;
        category?: string;
        country?: string;
        image_url?: string;
        topics?: string[];
        keywords?: string;
    }
): Promise<Article> {
    try {
        const response = await api.patch<Article>(`/admin/articles/${id}/pending`, payload);
        console.log(`[API] Update Pending Article ${id}: ${response.status} OK`);
        return response.data;
    } catch (error: any) {
        console.error(`[API] Update Pending Article ${id} Failed: ${error.response?.status || 'Unknown error'}`);
        throw error;
    }
}

/**
 * Publish a pending article (moves from Redis to MySQL database)
 */
export async function publishArticle(
    id: string,
    publishedSites: string[],
    customTitles?: Record<string, string>
): Promise<{ message: string; article: Article }> {
    try {
        const response = await api.post<{ message: string; article: Article }>(
            `/admin/articles/${id}/publish`,
            {
                published_sites: publishedSites,
                custom_titles: customTitles,
            }
        );
        console.log(`[API] Publish Article ${id}: ${response.status} OK`);
        return response.data;
    } catch (error: any) {
        console.error(`[API] Publish Article ${id} Failed: ${error.response?.status || 'Unknown error'}`);
        throw error;
    }
}

/**
 * Reject a pending article (moves from Redis to MySQL with rejected status)
 */
export async function rejectArticle(
    id: string,
    reason?: string
): Promise<{ message: string; article: Article }> {
    try {
        const response = await api.post<{ message: string; article: Article }>(
            `/admin/articles/${id}/reject`,
            { reason }
        );
        console.log(`[API] Reject Article ${id}: ${response.status} OK`);
        return response.data;
    } catch (error: any) {
        console.error(`[API] Reject Article ${id} Failed: ${error.response?.status || 'Unknown error'}`);
        throw error;
    }
}