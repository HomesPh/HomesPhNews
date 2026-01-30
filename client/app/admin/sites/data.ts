export interface Site {
    id: number;
    name: string;
    domain: string;
    status: 'active' | 'suspended';
    image: string;
    contact: string;
    description: string;
    categories: string[];
    requested: string;
    articles: number;
    monthlyViews: string;
    contact_name?: string;
    contact_email?: string;
    apiKey?: string;
}

export const sitesData: Site[] = [
    {
        id: 1,
        name: 'FilipinoHomes',
        domain: 'filipinohomes.com',
        status: 'active',
        image: "/images/HomesTV.png",
        contact: 'Name (name@filipinohomes.com)',
        description: 'Premier Philippine real estate platform focusing on properties for Filipino families.',
        categories: ['Real Estate', 'Business'],
        requested: '2025-11-15',
        articles: 145,
        monthlyViews: '250,000'
    },
    {
        id: 2,
        name: 'Rent.ph',
        domain: 'rent.ph',
        status: 'active',
        image: "/images/HomesTV.png",
        contact: 'Name (name@rent.ph)',
        description: 'Leading property rental and investment platform in the Philippines.',
        categories: ['Real Estate', 'Business', 'Economy'],
        requested: '2025-11-15',
        articles: 234,
        monthlyViews: '450,000'
    },
    {
        id: 3,
        name: 'Bayanihan',
        domain: 'bayanihan.com',
        status: 'active',
        image: "/images/HomesTV.png",
        contact: 'Name (name@bayanihan.com)',
        description: 'Connects Filipino communities worldwide by showcasing local events, restaurants, festivals, and cultural stories',
        categories: ['Real Estate', 'Business', 'Economy'],
        requested: '2025-11-15',
        articles: 234,
        monthlyViews: '450,000'
    }
];

