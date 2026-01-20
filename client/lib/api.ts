
import axios from 'axios';

// Define the base URL suitable for development; in production this might come from env vars
const API_URL = 'http://localhost:8000/api';

export interface Article {
    id: number;
    title: string;
    summary: string;
    content: string;
    category: string;
    country: string;
    views_count: number;
    image: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface SearchParams {
    search?: string;
    country?: string;
    category?: string;
    filter?: string;
    page?: number;
}

export interface ArticleFeed {
    trending: Article[];
    most_read: Article[];
    latest_global: Article[];
}

export const searchArticles = async (params: SearchParams): Promise<ArticleFeed> => {
    try {
        const response = await axios.get<ArticleFeed>(`${API_URL}/article`, {
            params: {
                search: params.search,
                country: params.country,
                category: params.category,
                // filter param removed as endpoint returns all sections
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching articles:', error);
        throw error;
    }
};
