"use client";

import { useEffect, useState, useMemo } from 'react';
import StatCard from "@/components/features/admin/shared/StatCard";
import AdminPageHeader from "@/components/features/admin/shared/AdminPageHeader";
import { ChevronDown, Download, Loader2 } from 'lucide-react';
import TrafficTrendsChart from "@/components/features/admin/analytics/TrafficTrendsChart";
import CategoryDistributionChart from "@/components/features/admin/analytics/CategoryDistributionChart";
import CountryPerformanceChart from "@/components/features/admin/analytics/CountryPerformanceChart";
import ContentPerformanceTable from "@/components/features/admin/analytics/ContentPerformanceTable";
import VisitorBreakdownChart from "@/components/features/admin/analytics/VisitorBreakdownChart";
import TrafficSourcesChart from "@/components/features/admin/analytics/TrafficSourcesChart";
import { getAdminAnalytics, AdminAnalyticsResponse } from "@/lib/api-v2/admin/service/analytics/getAdminAnalytics";
import { Skeleton } from "@/components/ui/skeleton";
import { Categories, Countries } from '@/app/data';
import { format } from 'date-fns';

type TimeInterval = 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Bi-annual' | 'Annually';
type ContentType = 'All' | 'Article';

const PERIOD_MAPPING: Record<string, string> = {
    'Last 7 Days': '7d',
    'Last 30 Days': '30d',
    'Last 3 Months': '90d',
    'Last 6 Months': '180d',
    'Last Year': '1y'
};

export default function SubscriberAnalyticsPage() {
    const [activeTab, setActiveTab] = useState<ContentType>('All');
    const [dateRange, setDateRange] = useState('Last 30 Days');
    const [category, setCategory] = useState('All');
    const [country, setCountry] = useState('All');
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<AdminAnalyticsResponse | null>(null);
    const [interval, setInterval] = useState<TimeInterval>('Daily');

    // Chart and Stats State
    const [stats, setStats] = useState<any[]>([]);
    const [aggregatedTrafficData, setAggregatedTrafficData] = useState<any[]>([]);
    const [categoryData, setCategoryData] = useState<any[]>([]);
    const [deviceData, setDeviceData] = useState<any[]>([]);
    const [sourceData, setSourceData] = useState<any[]>([]);
    const [countryPerformanceData, setCountryPerformanceData] = useState<any[]>([]);

    useEffect(() => {
        const fetchAnalytics = async () => {
            setIsLoading(true);
            try {
                const response = await getAdminAnalytics({
                    period: PERIOD_MAPPING[dateRange] || '30d',
                    category: category === 'All' ? undefined : category,
                    country: country === 'All' ? undefined : country
                });

                const resData = response.data;
                setData(resData);

                const totalContent = resData.content_by_category.reduce((sum, item) => sum + item.count, 0);
                const overview = resData.overview;

                setStats([
                    {
                        title: "Total Content",
                        value: totalContent,
                        trend: overview.total_page_news_trend,
                        iconName: "FileText",
                        iconBgColor: "bg-blue-50",
                        iconColor: "text-blue-500"
                    },
                    {
                        title: "Total Visitors",
                        value: overview.unique_visitors,
                        trend: overview.unique_visitors_trend,
                        iconName: "Users",
                        iconBgColor: "bg-purple-50",
                        iconColor: "text-purple-500"
                    },
                    {
                        title: "Total Views",
                        value: overview.total_page_news,
                        trend: overview.total_page_news_trend,
                        iconName: "Eye",
                        iconBgColor: "bg-indigo-50",
                        iconColor: "text-indigo-500"
                    },
                    {
                        title: "Total Clicks",
                        value: overview.total_clicks,
                        trend: overview.total_clicks_trend,
                        iconName: "MousePointerClick",
                        iconBgColor: "bg-green-50",
                        iconColor: "text-green-500"
                    }
                ]);

                setAggregatedTrafficData(resData.traffic_trends.map(t => ({
                    date: t.date,
                    visitors: Number(t.unique_visitors),
                    pageViews: Number(t.total_page_news)
                })));

                setCategoryData(resData.content_by_category.map(c => ({
                    name: c.category,
                    value: c.count
                })));

                setCountryPerformanceData(resData.performance_by_country.map(c => ({
                    country: c.country,
                    visitors: c.total_views
                })));

                setDeviceData(resData.device_breakdown || []);
                setSourceData(resData.traffic_sources || []);

            } catch (error) {
                console.error("Failed to fetch analytics:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnalytics();
    }, [dateRange, category, country, activeTab]);

    return (
        <div className="p-8 bg-[#f9fafb] min-h-screen">
            <AdminPageHeader
                title="Subscriber Analytics"
                description="Insights into platform-wide content performance."
            >
                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative">
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="appearance-none px-4 pr-10 h-[50px] border border-[#d1d5db] rounded-[8px] text-[14px] font-medium text-black bg-white focus:outline-none focus:ring-2 focus:ring-[#C10007] focus:border-transparent tracking-[-0.3px] cursor-pointer"
                        >
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                            <option>Last 3 Months</option>
                            <option>Last 6 Months</option>
                            <option>Last Year</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af] pointer-events-none" />
                    </div>
                </div>
            </AdminPageHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {isLoading ? (
                    Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-[140px] rounded-[12px] bg-white shadow-sm" />)
                ) : (
                    stats.map((stat, index) => (
                        <StatCard
                            key={index}
                            {...stat}
                            hasIconBg={true}
                        />
                    ))
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {isLoading ? (
                    <>
                        <Skeleton className="h-[400px] rounded-[12px] bg-white shadow-sm" />
                        <Skeleton className="h-[400px] rounded-[12px] bg-white shadow-sm" />
                    </>
                ) : (
                    <>
                        <TrafficTrendsChart data={aggregatedTrafficData} />
                        <CategoryDistributionChart
                            data={categoryData}
                            title="Content Mix"
                            description="Distribution by category"
                            centerLabel="Total Articles"
                        />
                    </>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {isLoading ? (
                    <>
                        <Skeleton className="h-[400px] rounded-[12px] bg-white shadow-sm" />
                        <Skeleton className="h-[400px] rounded-[12px] bg-white shadow-sm" />
                    </>
                ) : (
                    <>
                        <VisitorBreakdownChart data={deviceData} />
                        <TrafficSourcesChart data={sourceData} />
                    </>
                )}
            </div>

            <div className="mb-8 relative">
                {isLoading ? (
                    <Skeleton className="h-[400px] rounded-[12px] bg-white shadow-sm" />
                ) : (
                    <ContentPerformanceTable
                        data={data?.content_performance || []}
                        title="Content Performance"
                        description="Detailed metrics for top articles"
                    />
                )}
            </div>
        </div>
    );
}
