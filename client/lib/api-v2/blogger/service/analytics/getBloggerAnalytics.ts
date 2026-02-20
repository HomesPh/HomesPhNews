
export interface BloggerMetric {
    value: string | number;
    change: number;
    prevValue: string | number;
}

export interface BloggerArticle {
    id: number;
    title: string;
    thumbnail: string;
    views: number;
    uniqueVisitors: number;
    avgReadTime: string;
    completionRate: number;
    shares: number;
    engagementRate: number;
    status: string;
    publishedDate: string;
    sites: string[];
    topCountry: string;
    topReferrer: string;
    saves: number;
    bounceRate: number;
    dailyViews: { date: string; views: number }[];
    retentionData: { point: string; percentage: number }[];
    referralSources: {
        name: string;
        value: number; // Visits
        percentage: string;
        avgDuration: string;
        conversionRate: string;
    }[];
}

export interface BloggerAnalyticsData {
    metrics: {
        totalArticles: BloggerMetric;
        totalViews: BloggerMetric;
        totalVisitors: BloggerMetric;
        totalShares: BloggerMetric;
        avgEngagement: BloggerMetric;
        avgReadTime: BloggerMetric;
    };
    dailyTrends: {
        date: string;
        pageViews: number;
        visitors: number;
    }[];
    topArticles: BloggerArticle[];
    siteDistribution: {
        site: string;
        articles: number;
        views: number;
        percentage: number;
    }[];
    geographicDistribution: {
        country: string;
        users: number;
        percentage: number;
        coordinates: [number, number];
    }[];
    visitorDevices: {
        name: string;
        value: number; // percentage
        color: string;
    }[];
    referralSources: {
        name: string;
        value: number;
        percentage: string;
        avgDuration: string;
        conversionRate: string;
    }[];
}

export const getBloggerAnalytics = async (): Promise<BloggerAnalyticsData> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const generateDailyViews = () => Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return {
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            views: Math.floor(Math.random() * 800) + 200,
        };
    });

    const generateRetention = () => [
        { point: "0%", percentage: 100 },
        { point: "10%", percentage: 95 },
        { point: "25%", percentage: 88 },
        { point: "50%", percentage: 76 },
        { point: "75%", percentage: 65 },
        { point: "100%", percentage: 58 },
    ];

    const generateReferrals = () => [
        { name: "Facebook", value: 1200, percentage: "45.0", avgDuration: "2m 15s", conversionRate: "1.2" },
        { name: "Google Search", value: 800, percentage: "30.0", avgDuration: "3m 45s", conversionRate: "2.1" },
        { name: "Direct", value: 400, percentage: "15.0", avgDuration: "1m 30s", conversionRate: "0.5" },
        { name: "Twitter", value: 266, percentage: "10.0", avgDuration: "1m 10s", conversionRate: "0.2" },
    ];

    return {
        metrics: {
            totalArticles: { value: 124, change: 12.5, prevValue: 110 },
            totalViews: { value: 45231, change: 8.2, prevValue: 41800 },
            totalVisitors: { value: 32150, change: 5.4, prevValue: 30500 },
            totalShares: { value: 1240, change: -2.1, prevValue: 1266 },
            avgEngagement: { value: 68, change: 4.5, prevValue: 65 },
            avgReadTime: { value: "4m 12s", change: 1.2, prevValue: "4m 08s" },
        },
        dailyTrends: Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            return {
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                pageViews: Math.floor(Math.random() * 2000) + 1000,
                visitors: Math.floor(Math.random() * 1500) + 800,
            };
        }),
        topArticles: [
            {
                id: 1,
                title: "The Future of Real Estate in the Philippines",
                thumbnail: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                views: 5231,
                uniqueVisitors: 4120,
                avgReadTime: "5m 30s",
                completionRate: 78,
                shares: 145,
                engagementRate: 8.5,
                status: "Published",
                publishedDate: "2024-03-15",
                sites: ["Homes", "Main News Portal"],
                topCountry: "Philippines",
                topReferrer: "Facebook",
                saves: 42,
                bounceRate: 35,
                dailyViews: generateDailyViews(),
                retentionData: generateRetention(),
                referralSources: generateReferrals()
            },
            {
                id: 2,
                title: "Top 10 Investment Locations for 2024",
                thumbnail: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                views: 4120,
                uniqueVisitors: 3500,
                avgReadTime: "4m 15s",
                completionRate: 65,
                shares: 98,
                engagementRate: 7.2,
                status: "Published",
                publishedDate: "2024-03-10",
                sites: ["FilipinoHomes"],
                topCountry: "United States",
                topReferrer: "Google",
                saves: 28,
                bounceRate: 40,
                dailyViews: generateDailyViews(),
                retentionData: [
                    { point: "0%", percentage: 100 },
                    { point: "10%", percentage: 90 },
                    { point: "50%", percentage: 60 },
                    { point: "100%", percentage: 40 },
                ],
                referralSources: [
                    { name: "Google", value: 2000, percentage: "60.0", avgDuration: "5m 00s", conversionRate: "3.5" },
                    { name: "Direct", value: 1000, percentage: "30.0", avgDuration: "2m 00s", conversionRate: "1.0" },
                ]
            },
            {
                id: 3,
                title: "Sustainable Living: A New Trend",
                thumbnail: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                views: 3800,
                uniqueVisitors: 2900,
                avgReadTime: "3m 45s",
                completionRate: 72,
                shares: 112,
                engagementRate: 8.1,
                status: "Published",
                publishedDate: "2024-03-05",
                sites: ["Bayanihan"],
                topCountry: "United Arab Emirates",
                topReferrer: "Direct",
                saves: 35,
                bounceRate: 28,
                dailyViews: generateDailyViews(),
                retentionData: generateRetention(),
                referralSources: generateReferrals()
            }
        ],
        siteDistribution: [
            { site: "Main News Portal", articles: 45, views: 15000, percentage: 35 },
            { site: "Homes", articles: 30, views: 10000, percentage: 25 },
            { site: "FilipinoHomes", articles: 25, views: 8000, percentage: 20 },
            { site: "Bayanihan", articles: 15, views: 5000, percentage: 12 },
            { site: "Faceofmind", articles: 9, views: 3000, percentage: 8 }
        ],
        geographicDistribution: [
            { country: "Philippines", users: 15420, percentage: 45, coordinates: [12.8797, 121.7740] },
            { country: "United States", users: 8200, percentage: 25, coordinates: [37.0902, -95.7129] },
            { country: "United Arab Emirates", users: 3100, percentage: 10, coordinates: [23.4241, 53.8478] },
            { country: "Singapore", users: 2450, percentage: 8, coordinates: [1.3521, 103.8198] },
            { country: "Others", users: 2980, percentage: 12, coordinates: [0, 0] }
        ],
        visitorDevices: [
            { name: "Mobile", value: 55, color: "#10B981" },
            { name: "Desktop", value: 35, color: "#3B82F6" },
            { name: "Tablet", value: 10, color: "#F59E0B" }
        ],
        referralSources: [
            { name: "Organic Search", value: 4500, percentage: "45.0", avgDuration: "2m 15s", conversionRate: "1.2" },
            { name: "Social Media", value: 2500, percentage: "25.0", avgDuration: "1m 45s", conversionRate: "0.8" },
            { name: "Direct", value: 2000, percentage: "20.0", avgDuration: "3m 10s", conversionRate: "2.5" },
            { name: "Referral", value: 1000, percentage: "10.0", avgDuration: "1m 30s", conversionRate: "0.5" }
        ]
    };
};
