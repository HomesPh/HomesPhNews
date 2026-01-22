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
