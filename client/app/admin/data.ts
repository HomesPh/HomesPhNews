export interface DashboardStat {
    title: string;
    value: string | number;
    trend: string;
    iconName: 'FileText' | 'CheckCircle2' | 'AlertCircle' | 'Eye' | 'Users' | 'MousePointerClick' | 'TrendingUp';
    hasIconBg?: boolean;
    iconBgColor?: string;
    iconColor?: string;
    iconSize?: string;
}


export interface DashboardArticle {
    id: number;
    image: string;
    category: string;
    location: string;
    title: string;
    date: string;
    views: string;
    status: 'published' | 'pending' | 'rejected' | 'active';
}

export interface SiteDistribution {
    name: string;
    count: number;
}

export const stats: DashboardStat[] = [
    {
        title: "Total Articles",
        value: "8",
        trend: "+15.3%",
        iconName: 'FileText',
        hasIconBg: true,
        iconBgColor: "bg-[#dbeafe]",
        iconColor: "text-[#155DFC]",
        iconSize: "w-4 h-4"
    },
    {
        title: "Published",
        value: "6",
        trend: "+12.8%",
        iconName: 'CheckCircle2',
        hasIconBg: false,
        iconColor: "text-[#10b981]",
        iconSize: "w-[18px] h-[18px]"
    },
    {
        title: "Pending Review",
        value: "10",
        trend: "+18.5%",
        iconName: 'AlertCircle',
        hasIconBg: false,
        iconColor: "text-[#F59E0B]",
        iconSize: "w-[18px] h-[18px]"
    },
    {
        title: "Total Views",
        value: "89.2K",
        trend: "+2.3%",
        iconName: 'Eye',
        hasIconBg: false,
        iconColor: "text-[#A13DE4]",
        iconSize: "w-[20px] h-[18px]"
    }
];

export const recentArticles: DashboardArticle[] = [
    {
        id: 1,
        image: "/healthcare.jpg",
        category: 'Technology',
        location: 'USA',
        title: 'Self-Driving Cars Get Federal Approval: What This Means for the Future',
        date: 'January 14, 2026',
        views: '100 views',
        status: 'published'
    },
    {
        id: 2,
        image: "/healthcare.jpg",
        category: 'Technology',
        location: 'SINGAPORE',
        title: "Singapore Launches World's First AI-Powered Urban Management System",
        date: 'January 14, 2026',
        views: '100 views',
        status: 'pending'
    },
    {
        id: 3,
        image: "/healthcare.jpg",
        category: 'Politics',
        location: 'EUROPE',
        title: 'EU Passes Landmark AI Ethics Legislation: Tech Giants Face New Restrictions',
        date: 'January 14, 2026',
        views: '100 views',
        status: 'rejected'
    },
    {
        id: 4,
        image: "/healthcare.jpg",
        category: 'Business',
        location: 'PHILIPPINES',
        title: "Philippines Emerges as Southeast Asia's AI Outsourcing Leader",
        date: 'January 14, 2026',
        views: '100 views',
        status: 'published'
    }
];

export const sites: SiteDistribution[] = [
    { name: 'Main Portal', count: 5 },
    { name: 'Filipino Homes', count: 6 },
    { name: 'Rent.ph', count: 8 },
    { name: 'HomesPh', count: 7 },
    { name: 'Bayanihan', count: 6 }
];
