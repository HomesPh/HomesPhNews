export interface AdminUser {
    id: string;
    name: string;
    email: string;
    role: 'Admin' | 'Blogger';
    status: 'active' | 'suspended' | 'banned';
    joinedDate: string;
    blogsPublished: number;
    lastActive: string;
}

export const mockUsers: AdminUser[] = [
    {
        id: '1',
        name: 'Maria Santos',
        email: 'maria.santos@email.com',
        role: 'Blogger',
        status: 'active',
        joinedDate: 'Jan 15, 2026',
        blogsPublished: 12,
        lastActive: '2 hours ago',
    },
    {
        id: '2',
        name: 'Juan Dela Cruz',
        email: 'juan.delacruz@email.com',
        role: 'Blogger',
        status: 'active',
        joinedDate: 'Jan 20, 2026',
        blogsPublished: 2,
        lastActive: '1 day ago',
    },
    {
        id: '3',
        name: 'Anna Reyes',
        email: 'anna.reyes@email.com',
        role: 'Blogger',
        status: 'active',
        joinedDate: 'Jan 10, 2026',
        blogsPublished: 24,
        lastActive: '5 hours ago',
    },
    {
        id: '4',
        name: 'Carlos Garcia',
        email: 'carlos.garcia@email.com',
        role: 'Blogger',
        status: 'suspended',
        joinedDate: 'Dec 5, 2025',
        blogsPublished: 8,
        lastActive: '3 days ago',
    },
    {
        id: '5',
        name: 'Lisa Fernandez',
        email: 'lisa.fernandez@email.com',
        role: 'Blogger',
        status: 'active',
        joinedDate: 'Jan 5, 2026',
        blogsPublished: 18,
        lastActive: '1 hour ago',
    },
    {
        id: '6',
        name: 'Roberto Cruz',
        email: 'roberto.cruz@email.com',
        role: 'Blogger',
        status: 'active',
        joinedDate: 'Jan 22, 2026',
        blogsPublished: 0,
        lastActive: '6 hours ago',
    },
    {
        id: '7',
        name: 'Elena Martinez',
        email: 'elena.martinez@email.com',
        role: 'Admin',
        status: 'active',
        joinedDate: 'Dec 1, 2025',
        blogsPublished: 0,
        lastActive: '30 mins ago',
    },
    {
        id: '8',
        name: 'Ramon Bautista',
        email: 'ramon.b@email.com',
        role: 'Blogger',
        status: 'banned',
        joinedDate: 'Dec 10, 2023',
        lastActive: '1 month ago',
        blogsPublished: 2,
    }
];

export interface AdminBlog {
    id: number;
    image: string;
    category: string;
    authorId: number;
    authorName: string;
    authorEmail: string;
    title: string;
    description: string;
    content: string;
    date: string;
    views: number;
    status: 'published' | 'pending';
    sites: string[];
}

export const mockBlogs: AdminBlog[] = [
    {
        id: 1,
        image: "https://placehold.co/800x450?text=Blog+1",
        category: 'Real Estate',
        authorId: 1,
        authorName: 'Maria Santos',
        authorEmail: 'maria.santos@email.com',
        title: 'Top 10 Properties in Manila for OFWs',
        description: 'Discover the best property investments in Manila perfect for overseas Filipino workers looking to invest back home.',
        content: `
            <h2>Introduction</h2>
            <p>For Overseas Filipino Workers (OFWs) looking to invest back home, Manila offers a wealth of property opportunities. From modern condominiums in Makati's business district to spacious family homes in suburban areas, the capital city presents diverse options for every budget and preference.</p>
            
            <h2>Top Property Recommendations</h2>
            <p>We've carefully selected these properties based on their location, amenities, investment potential, and suitability for OFW buyers. Each property has been evaluated for its accessibility to key areas, security features, and long-term value appreciation.</p>
            
            <h3>1. Premium Condos in Bonifacio Global City</h3>
            <p>BGC continues to be a top choice for OFWs seeking modern, secure living spaces with international standards. These properties offer excellent rental yields and capital appreciation.</p>
            
            <h3>2. Family Homes in Alabang</h3>
            <p>For those planning to retire or bring their families back, Alabang offers spacious properties in gated communities with excellent schools and healthcare facilities nearby.</p>
            
            <h2>Investment Considerations</h2>
            <p>When investing in Manila real estate as an OFW, consider factors such as property management services, rental potential, proximity to transportation, and future development plans in the area.</p>
            
            <h2>Conclusion</h2>
            <p>Manila's real estate market offers promising opportunities for OFWs. With careful research and the right guidance, you can find the perfect property that serves both as an investment and a future home.</p>
        `,
        date: 'January 20, 2026',
        views: 1245,
        status: 'published',
        sites: ['Filipino Homes']
    },
    {
        id: 2,
        image: "https://placehold.co/800x450?text=Blog+2",
        category: 'Investment',
        authorId: 3,
        authorName: 'Anna Reyes',
        authorEmail: 'anna.reyes@email.com',
        title: 'Guide to Property Investment in Dubai',
        description: 'Everything you need to know about investing in Dubai real estate as a Filipino expat.',
        content: '<p>Content for Dubai investment guide...</p>',
        date: 'January 18, 2026',
        views: 856,
        status: 'published',
        sites: ['Global Property News']
    },
    {
        id: 3,
        image: "https://placehold.co/800x450?text=Blog+3",
        category: 'Lifestyle',
        authorId: 1,
        authorName: 'Maria Santos',
        authorEmail: 'maria.santos@email.com',
        title: 'Singapore Condo Living: A Complete Guide',
        description: 'Comprehensive guide to condo living in Singapore for Filipino families.',
        content: '<p>Content for Singapore condo living...</p>',
        date: 'January 15, 2026',
        views: 632,
        status: 'published',
        sites: ['Filipino Homes', 'Asian Network']
    },
    {
        id: 4,
        image: "https://placehold.co/800x450?text=Blog+4",
        category: 'Real Estate',
        authorId: 2,
        authorName: 'Juan Dela Cruz',
        authorEmail: 'juan.delacruz@email.com',
        title: 'Renting vs Buying in Metro Manila',
        description: 'A financial analysis of renting versus buying property in the current economic climate.',
        content: '<p>Should you rent or buy? We look at the numbers...</p>',
        date: 'January 12, 2026',
        views: 450,
        status: 'published',
        sites: ['Rent.ph']
    },
    {
        id: 5,
        image: "https://placehold.co/800x450?text=Blog+5",
        category: 'Technology',
        authorId: 5,
        authorName: 'Lisa Fernandez',
        authorEmail: 'lisa.fernandez@email.com',
        title: 'Smart Home Security for Expats',
        description: 'How to secure your home remotely using the latest IoT devices.',
        content: '<p>Keeping your home safe from halfway across the world...</p>',
        date: 'January 10, 2026',
        views: 290,
        status: 'published',
        sites: ['Global Property News']
    },
    {
        id: 6,
        image: "https://placehold.co/800x450?text=Blog+6",
        category: 'Community',
        authorId: 4,
        authorName: 'Carlos Garcia',
        authorEmail: 'carlos.garcia@email.com',
        title: 'Building Resilience in Local Communities',
        description: 'How grassroots initiatives are improving neighborhood safety and cooperation.',
        content: '<p>Community power is the strongest force for change...</p>',
        date: 'January 8, 2026',
        views: 180,
        status: 'published',
        sites: ['Bayanihan Network']
    },
];
