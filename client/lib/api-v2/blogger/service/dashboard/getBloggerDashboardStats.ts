
export interface BloggerDashboardStats {
    stats: {
        total_blogs: number;
        total_views: number;
        total_comments: number;
        avg_engagement: number;
        total_distribution: {
            distributed_in: string;
            published_count: number;
        }[];
    };
    recent_blogs: {
        id: number;
        title: string;
        image: string;
        category: string;
        country: string;
        views_count: number;
        status: "published" | "draft" | "review";
        created_at: string;
        image_position?: number;
        image_position_x?: number;
    }[];
}

export const getBloggerDashboardStats = async (): Promise<BloggerDashboardStats> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    return {
        stats: {
            total_blogs: 45,
            total_views: 125430,
            total_comments: 342,
            avg_engagement: 8.5,
            total_distribution: [
                { distributed_in: "Main News Portal", published_count: 20 },
                { distributed_in: "Homes", published_count: 15 },
                { distributed_in: "FilipinoHomes", published_count: 10 },
            ]
        },
        recent_blogs: [
            {
                id: 1,
                title: "The Future of Real Estate in the Philippines",
                image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                category: "Real Estate",
                country: "Philippines",
                views_count: 5231,
                status: "published",
                created_at: "2024-02-15T10:00:00Z"
            },
            {
                id: 2,
                title: "Top 10 Investment Locations for 2024",
                image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                category: "Investment",
                country: "United States",
                views_count: 4120,
                status: "published",
                created_at: "2024-02-10T14:30:00Z"
            },
            {
                id: 3,
                title: "Draft Discussion on Urban Planning",
                image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                category: "Urban Planning",
                country: "Singapore",
                views_count: 0,
                status: "draft",
                created_at: "2024-02-20T09:15:00Z"
            }
        ]
    };
};
