import api from "@/lib/api/axios";
import { Article } from "@/app/admin/articles/data";

interface SingleStat {
    count: number | string;
    trend?: {
        value: number;
        label: string;
        isPositive: boolean;
    };
}

export interface AdminStatsResponse {
    stats: {
        total_articles: number;
        total_published: number;
        pending_review: number;
        total_views: number;
        total_distribution: Array<{
            distributed_in: string;
            published_count: number;
        }>;
    };
    recent_articles: Article[];
}

/**
 * Fetch Admin Dashboard Stats
 */
export async function getAdminStats(): Promise<AdminStatsResponse> {
    try {
        const response = await api.get<AdminStatsResponse>('/admin/stats');
        console.log(`[API] Fetch Admin Stats: ${response.status} OK`);
        return response.data;
    } catch (error: any) {
        console.error(`[API] Fetch Admin Stats Failed: ${error.response?.status || 'Unknown error'}`);
        throw error;
    }
}
