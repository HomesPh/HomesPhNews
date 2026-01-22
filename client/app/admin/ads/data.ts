export interface Ad {
    id: number;
    title: string;
    status: 'active' | 'inactive';
    image: string;
    client: string;
    type: string;
    placement: string;
    articlePages: string;
    revenue: string;
    impressions: string;
    clicks: string;
    period: string;
}

export const adsData: Ad[] = [
    {
        id: 1,
        title: 'Real Estate Expo 2026',
        status: 'active',
        image: "/healthcare.jpg", // Using existing placeholder for now
        client: 'Dubai Property Developers',
        type: 'Leaderboard (728×90)',
        placement: 'News Portal - Top',
        articlePages: 'Article Pages - Top',
        revenue: '$15,000',
        impressions: '245,000',
        clicks: '3,420',
        period: '2026-01-01 to 2026-03-31'
    },
    {
        id: 2,
        title: 'AI Business Summit',
        status: 'active',
        image: "/healthcare.jpg",
        client: 'Tech Conference Inc',
        type: 'Rectangle (300×250)',
        placement: 'Sidebar - All Pages',
        articlePages: 'Article Pages - In-feed',
        revenue: '$8,500',
        impressions: '180,000',
        clicks: '2,150',
        period: '2026-01-15 to 2026-06-30'
    },
    {
        id: 3,
        title: 'Tourism Philippines Campaign',
        status: 'inactive',
        image: "/healthcare.jpg",
        client: 'Manila Hotels Group',
        type: 'Leaderboard (728×90)',
        placement: 'News Portal - Top',
        articlePages: 'Article Pages - Top',
        revenue: '$12,000',
        impressions: '150,000',
        clicks: '1,800',
        period: '2026-02-01 to 2026-04-30'
    }
];

export const adSettings = {
    types: [
        'Leaderboard (728×90)',
        'Rectangle (300×250)',
        'Wide Skyscraper (160×600)',
        'Square (250×250)',
        'Large Leaderboard (970×90)'
    ],
    placements: [
        'News Portal - Top',
        'Sidebar - All Pages',
        'Article Pages - Top',
        'Article Pages - In-feed',
        'Article Pages - Bottom',
        'Homepage - Mid Section'
    ]
};
