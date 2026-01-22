/**
 * Article interface matching the Laravel API response
 * For pending articles: data comes from Redis (Python scraper)
 * For other statuses: data comes from Database
 */
export interface Article {
    id: string;                    // UUID from Python scraper
    title: string;
    summary: string;               // First 200 chars of content for pending
    category: string;
    country: string;               // Full country name (e.g., "Philippines")
    status: 'published' | 'pending' | 'pending review' | 'rejected';
    created_at: string | null;     // ISO date string
    views_count: number;

    // Optional fields (available in detail view or pending articles)
    image_url?: string;
    content?: string;
    topics?: string[];
    keywords?: string;
    source?: string;
    original_url?: string;
    distributed_in?: string;

    // Legacy field mappings for backward compatibility
    image?: string;                // Alias for image_url
    location?: string;             // Alias for country
    description?: string;          // Alias for summary
    date?: string;                 // Alias for created_at
    views?: string;                // Formatted views_count
    sites?: string[];              // Alias for distributed_in
    tags?: string[];               // Alias for topics
    author?: string;
    slug?: string;
}

/**
 * API response format for paginated articles
 */
export interface ArticlesApiResponse {
    data: Article[];
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number | null;
    to: number | null;
    available_filters?: {
        categories: string[];
        countries: string[];
    };
}

export const articlesData: Article[] = [
    {
        id: "1",
        image_url: "https://placehold.co/800x450?text=Healthcare",
        category: 'Technology',
        country: 'USA',
        title: 'AI Revolution: How Machine Learning is Transforming Healthcare in North America',
        summary: 'Computer researchers develop groundbreaking AI system that can detect early signs of cancer with 98% accuracy, potentially saving thousands of lives annually.',
        created_at: '2026-01-14T00:00:00Z',
        views_count: 1240,
        status: 'published',
        topics: ['Healthcare', 'AI', 'Technology'],
        author: 'John Doe',
        slug: 'ai-revolution-healthcare'
    },
    {
        id: "2",
        image_url: "https://placehold.co/800x450?text=Healthcare",
        category: 'Technology',
        country: 'Singapore',
        title: "Singapore Launches World's First AI-Powered Urban Management System",
        summary: 'The smart city initiative aims to optimize traffic flow and energy consumption across the island using real-time sensor data.',
        created_at: '2026-01-14T00:00:00Z',
        views_count: 850,
        status: 'published',
        topics: ['Singapore', 'Smart City', 'AI'],
        author: 'Jane Smith',
        slug: 'singapore-ai-urban-management'
    },
    {
        id: "3",
        image_url: "https://placehold.co/800x450?text=Healthcare",
        category: 'Politics',
        country: 'Europe',
        title: 'EU Passes Landmark AI Ethics Legislation: Tech Giants Face New Restrictions',
        summary: 'The new regulations set strict guidelines for high-risk AI applications and require transparency from developers on algorithmic decision-making.',
        created_at: '2026-01-14T00:00:00Z',
        views_count: 620,
        status: 'pending',
        topics: ['EU', 'Ethics', 'Legislation'],
        author: 'Mark Johnson',
        slug: 'eu-ai-ethics-legislation'
    },
    {
        id: "4",
        image_url: "https://placehold.co/800x450?text=Healthcare",
        category: 'Business',
        country: 'Philippines',
        title: "Philippines Emerges as Southeast Asia's AI Outsourcing Leader",
        summary: 'Local firms are rapidly adopting AI tools to enhance their service offerings, attracting significantly more international clients.',
        created_at: '2026-01-14T00:00:00Z',
        views_count: 2100,
        status: 'published',
        topics: ['Philippines', 'Outsourcing', 'Business'],
        author: 'Maria Santos',
        slug: 'philippines-ai-outsourcing'
    },
    {
        id: "5",
        image_url: "https://placehold.co/800x450?text=Healthcare",
        category: 'Economy',
        country: 'Global',
        title: 'Global Markets Volatile Amidst Shift in AI Investment Strategies',
        summary: 'Investors are becoming more cautious as companies face pressure to demonstrate clear returns on massive AI infrastructure spending.',
        created_at: '2026-01-14T00:00:00Z',
        views_count: 430,
        status: 'rejected',
        topics: ['Economy', 'Investment', 'Global'],
        author: 'David Wilson',
        slug: 'global-markets-ai-investment'
    },
];

export const articleSettings = {
    categories: ['Technology', 'Politics', 'Business', 'Economy', 'Real Estate', 'Tourism'],
    countries: ['USA', 'Singapore', 'Philippines', 'Europe', 'Canada', 'UAE', 'Saudi Arabia', 'UK'],
    sites: ['Main Portal', 'Filipino Homes', 'Rent.ph', 'HomesPh', 'Bayanihan']
};
