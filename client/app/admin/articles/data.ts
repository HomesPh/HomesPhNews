export interface Article {
    id: number;
    image: string;
    category: string;
    location: string;
    title: string;
    description: string;
    date: string;
    views: string;
    status: 'published' | 'pending' | 'rejected';
    sites: string[];
    tags: string[];
    author?: string;
    slug?: string;
    content?: string;
}

export const articlesData: Article[] = [
    {
        id: 1,
        image: "/healthcare.jpg",
        category: 'Technology',
        location: 'USA',
        title: 'AI Revolution: How Machine Learning is Transforming Healthcare in North America',
        description: 'Computer researchers develop groundbreaking AI system that can detect early signs of cancer with 98% accuracy, potentially saving thousands of lives annually.',
        date: 'January 14, 2026',
        views: '1,240 views',
        status: 'published',
        sites: ['Main Portal', 'Bayanihan'],
        tags: ['Healthcare', 'AI', 'Technology'],
        author: 'John Doe',
        slug: 'ai-revolution-healthcare'
    },
    {
        id: 2,
        image: "/healthcare.jpg",
        category: 'Technology',
        location: 'SINGAPORE',
        title: "Singapore Launches World's First AI-Powered Urban Management System",
        description: 'The smart city initiative aims to optimize traffic flow and energy consumption across the island using real-time sensor data.',
        date: 'January 14, 2026',
        views: '850 views',
        status: 'published',
        sites: ['Main Portal', 'Filipino Homes'],
        tags: ['Singapore', 'Smart City', 'AI'],
        author: 'Jane Smith',
        slug: 'singapore-ai-urban-management'
    },
    {
        id: 3,
        image: "/healthcare.jpg",
        category: 'Politics',
        location: 'EUROPE',
        title: 'EU Passes Landmark AI Ethics Legislation: Tech Giants Face New Restrictions',
        description: 'The new regulations set strict guidelines for high-risk AI applications and require transparency from developers on algorithmic decision-making.',
        date: 'January 14, 2026',
        views: '620 views',
        status: 'pending',
        sites: ['Main Portal'],
        tags: ['EU', 'Ethics', 'Legislation'],
        author: 'Mark Johnson',
        slug: 'eu-ai-ethics-legislation'
    },
    {
        id: 4,
        image: "/healthcare.jpg",
        category: 'Business',
        location: 'PHILIPPINES',
        title: "Philippines Emerges as Southeast Asia's AI Outsourcing Leader",
        description: 'Local firms are rapidly adopting AI tools to enhance their service offerings, attracting significantly more international clients.',
        date: 'January 14, 2026',
        views: '2,100 views',
        status: 'published',
        sites: ['Main Portal', 'Filipino Homes', 'Rent.ph'],
        tags: ['Philippines', 'Outsourcing', 'Business'],
        author: 'Maria Santos',
        slug: 'philippines-ai-outsourcing'
    },
    {
        id: 5,
        image: "/healthcare.jpg",
        category: 'Economy',
        location: 'GLOBAL',
        title: 'Global Markets Volatile Amidst Shift in AI Investment Strategies',
        description: 'Investors are becoming more cautious as companies face pressure to demonstrate clear returns on massive AI infrastructure spending.',
        date: 'January 14, 2026',
        views: '430 views',
        status: 'rejected',
        sites: ['Main Portal'],
        tags: ['Economy', 'Investment', 'Global'],
        author: 'David Wilson',
        slug: 'global-markets-ai-investment'
    },
];

export const articleSettings = {
    categories: ['Technology', 'Politics', 'Business', 'Economy', 'Real Estate', 'Tourism'],
    countries: ['USA', 'Singapore', 'Philippines', 'Europe', 'Canada', 'UAE', 'Saudi Arabia', 'UK'],
    sites: ['Main Portal', 'Filipino Homes', 'Rent.ph', 'HomesPh', 'Bayanihan']
};
