import { DashboardStat } from "../data";

export interface AnalyticsStat extends DashboardStat { }

export interface TrafficData {
    month: string;
    pageViews: number;
    visitors: number;
    [key: string]: any;
}

export interface CategoryData {
    name: string;
    value: number;
    color: string;
    [key: string]: any;
}

export interface CountryPerformance {
    country: string;
    articlesPublished: number;
    totalViews: number;
    [key: string]: any;
}

export interface PartnerPerformance {
    site: string;
    articlesShared: number;
    monthlyViews: number;
    revenueGenerated: string;
    avgEngagement: string;
}

export const analyticsStats: AnalyticsStat[] = [
    {
        title: "Total Page Views",
        value: "4.7M",
        trend: "+15.3%",
        iconName: 'Eye',
        hasIconBg: false,
        iconColor: "text-[#155DFC]",
        iconSize: "w-[20px] h-[18px]"
    },
    {
        title: "Unique Visitors",
        value: "1477K",
        trend: "+12.8%",
        iconName: 'Users',
        hasIconBg: false,
        iconColor: "text-[#9810FA]",
        iconSize: "w-[22px] h-[18px]"
    },
    {
        title: "Total Clicks",
        value: "264K",
        trend: "+16.5%",
        iconName: 'MousePointerClick',
        hasIconBg: false,
        iconColor: "text-[#10B981]",
        iconSize: "w-[18px] h-[18px]"
    },
    {
        title: "Avg Engagement",
        value: "5.65%",
        trend: "+2.3%",
        iconName: 'TrendingUp',
        hasIconBg: false,
        iconColor: "text-[#F97316]",
        iconSize: "w-[18px] h-[18px]"
    }
];

export const trafficData: TrafficData[] = [
    { month: 'Jan', pageViews: 350000, visitors: 120000 },
    { month: 'Feb', pageViews: 380000, visitors: 135000 },
    { month: 'Mar', pageViews: 420000, visitors: 155000 },
    { month: 'Apr', pageViews: 460000, visitors: 165000 },
    { month: 'May', pageViews: 480000, visitors: 170000 },
    { month: 'Jun', pageViews: 520000, visitors: 180000 },
    { month: 'Jul', pageViews: 550000, visitors: 190000 },
    { month: 'Aug', pageViews: 580000, visitors: 195000 },
    { month: 'Sep', pageViews: 600000, visitors: 200000 },
    { month: 'Oct', pageViews: 630000, visitors: 205000 },
    { month: 'Nov', pageViews: 650000, visitors: 210000 },
    { month: 'Dec', pageViews: 680000, visitors: 220000 },
];

export const categoryData: CategoryData[] = [
    { name: 'Real Estate', value: 32, color: '#3B82F6' },
    { name: 'Business', value: 24, color: '#8B5CF6' },
    { name: 'Technology', value: 18, color: '#10B981' },
    { name: 'Economy', value: 14, color: '#F59E0B' },
    { name: 'Politics', value: 8, color: '#EF4444' },
    { name: 'Tourism', value: 4, color: '#EC4899' },
];

export const countryData: CountryPerformance[] = [
    { country: 'Philippines', articlesPublished: 120, totalViews: 1200000 },
    { country: 'UAE', articlesPublished: 85, totalViews: 950000 },
    { country: 'Singapore', articlesPublished: 72, totalViews: 780000 },
    { country: 'USA', articlesPublished: 65, totalViews: 720000 },
    { country: 'Canada', articlesPublished: 48, totalViews: 580000 },
    { country: 'Others', articlesPublished: 35, totalViews: 420000 },
];

export const partnerPerformanceData: PartnerPerformance[] = [
    { site: 'FilipinoHomes', articlesShared: 145, monthlyViews: 250000, revenueGenerated: '$12,500', avgEngagement: '1.7K' },
    { site: 'Rent.ph', articlesShared: 234, monthlyViews: 450000, revenueGenerated: '$22,000', avgEngagement: '1.9K' },
    { site: 'Homes.ph', articlesShared: 87, monthlyViews: 180000, revenueGenerated: '$8,500', avgEngagement: '2.3K' },
    { site: 'Bayanihan', articlesShared: 156, monthlyViews: 320000, revenueGenerated: '$15,000', avgEngagement: '2.1K' },
];
