"use client";

import { useEffect, useState, useMemo } from 'react';
import StatCard from "@/components/features/admin/shared/StatCard";
import AdminPageHeader from "@/components/features/admin/shared/AdminPageHeader";
import { ChevronDown, Download, Loader2 } from 'lucide-react';
import TrafficTrendsChart from "@/components/features/admin/analytics/TrafficTrendsChart";
import CategoryDistributionChart from "@/components/features/admin/analytics/CategoryDistributionChart";
import CountryPerformanceChart from "@/components/features/admin/analytics/CountryPerformanceChart";
import PartnerPerformanceTable from "@/components/features/admin/analytics/PartnerPerformanceTable";
import ContentPerformanceTable from "@/components/features/admin/analytics/ContentPerformanceTable";
import VisitorBreakdownChart from "@/components/features/admin/analytics/VisitorBreakdownChart";
import TrafficSourcesChart from "@/components/features/admin/analytics/TrafficSourcesChart";
import ArticleDistribution from "@/components/features/admin/dashboard/ArticleDistribution";
import { getAdminAnalytics, AdminAnalyticsResponse } from "@/lib/api-v2/admin/service/analytics/getAdminAnalytics";
import { Skeleton } from "@/components/ui/skeleton";
import { Categories, Countries, RestaurantCategories } from '@/app/data';
import { format, parseISO, startOfWeek, startOfMonth, startOfQuarter, startOfYear, getQuarter, getYear } from 'date-fns';

type TimeInterval = 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Bi-annual' | 'Annually';
type ContentType = 'All' | 'Article' | 'Blog' | 'Newsletter' | 'Restaurant';

const PERIOD_MAPPING: Record<string, string> = {
    'Last 7 Days': '7d',
    'Last 30 Days': '30d',
    'Last 3 Months': '90d',
    'Last 6 Months': '180d',
    'Last Year': '1y'
};

export default function AnalyticsPage() {
    const [activeTab, setActiveTab] = useState<ContentType>('All');
    const [restaurantFilter, setRestaurantFilter] = useState('Listings');
    const [dateRange, setDateRange] = useState('Last 30 Days');
    const [category, setCategory] = useState('All');
    const [country, setCountry] = useState('All');
    const [exportFormat, setExportFormat] = useState('CSV');
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
    const [distributionSites, setDistributionSites] = useState<any[]>([]);
    const [totalPublished, setTotalPublished] = useState(0);
    const [partnerData, setPartnerData] = useState<any[]>([]);

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

                // Derived data
                const totalContent = resData.content_by_category.reduce((sum, item) => sum + item.count, 0);
                const overview = resData.overview;

                setStats([
                    {
                        title: activeTab === 'All' ? "Total Content" : `Total ${activeTab}s`,
                        value: totalContent,
                        trend: overview.total_page_news_trend, // Using generic trend for now
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
                    },
                    {
                        title: "Avg. Engagement",
                        value: `${overview.avg_engagement}%`,
                        trend: overview.avg_engagement_trend,
                        iconName: "TrendingUp",
                        iconBgColor: "bg-orange-50",
                        iconColor: "text-orange-500"
                    },
                    {
                        title: "Avg. Read Time",
                        value: overview.avg_read_duration,
                        trend: "+0%",
                        iconName: "Clock",
                        iconBgColor: "bg-teal-50", // Changed color to distinguish
                        iconColor: "text-teal-500"
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

                const partners = resData.partner_performance || [];
                setPartnerData(partners);
                setDistributionSites(partners.map(p => ({
                    name: p.site,
                    count: p.articlesShared,
                    totalViews: p.monthlyViews
                })));
                setTotalPublished(totalContent);

            } catch (error) {
                console.error("Failed to fetch analytics:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnalytics();
    }, [dateRange, category, country, activeTab]);

    // Dynamic Categories based on active tab
    const currentCategories = activeTab === 'Restaurant' ? RestaurantCategories : Categories;

    // Filter Content Performance Data
    const contentPerfData = (data?.content_performance || []).filter(item => {
        if (activeTab === 'All') return true;
        if (activeTab === 'Restaurant') {
            if (restaurantFilter === 'Listings') return item.type === 'Restaurant';
            if (restaurantFilter === 'Related Articles') return item.type === 'Article';
            if (restaurantFilter === 'Related Blogs') return item.type === 'Blog';
            if (restaurantFilter === 'Related Newsletters') return item.type === 'Newsletter';
        }
        return item.type === activeTab;
    });

    // Export Data Handler
    const handleExportData = () => {
        if (exportFormat === 'CSV') {
            // Define headers
            const headers = ['Title', 'Type', 'Views', 'Clicks', 'Read Time', 'Top Country'];

            // Format data rows
            const rows = contentPerfData.map(item => [
                `"${item.title.replace(/"/g, '""')}"`, // Handle commas/quotes in title
                item.type,
                item.views,
                item.clicks,
                item.read_time,
                item.country
            ]);

            // Combine headers and rows
            const csvContent = [
                headers.join(','),
                ...rows.map(row => row.join(','))
            ].join('\n');

            // Create download link
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', `analytics_export_${format(new Date(), 'yyyy-MM-dd')}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            // Placeholder for PDF export
            console.log('PDF export not yet implemented');
            alert('PDF export is coming soon. Please use CSV for now.');
        }
    };

    // Filter Category Data based on active tab
    const filteredCategoryData = useMemo(() => {
        if (activeTab === 'Restaurant') {
            const restaurantCategoryLabels = new Set(RestaurantCategories.map(c => c.label));
            return categoryData.filter(d => restaurantCategoryLabels.has(d.name));
        }
        return categoryData;
    }, [categoryData, activeTab]);

    // Dynamic Labels
    const contentPerformanceTitle = activeTab === 'All'
        ? "Content Performance"
        : `${activeTab} Performance`;

    const contentPerformanceDescription = activeTab === 'All'
        ? "Detailed metrics for Articles, Blogs, Newsletters, and Restaurants"
        : `Detailed metrics for ${activeTab}s`;

    const categoryDistributionTitle = "Content Mix";
    const categoryDistributionDescription = activeTab === 'All'
        ? "Distribution by category"
        : `Distribution of ${activeTab} categories`;

    return (
        <div className="p-8 bg-[#f9fafb] min-h-screen">
            <AdminPageHeader
                title="Analytics Management"
                description="Comprehensive insights into your content performance and audience."
            >
                <div className="flex flex-wrap items-center gap-4">
                    {/* Category Filter */}
                    <div className="relative">
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="appearance-none px-4 pr-10 h-[50px] border border-[#d1d5db] rounded-[8px] text-[14px] font-medium text-black bg-white focus:outline-none focus:ring-2 focus:ring-[#C10007] focus:border-transparent tracking-[-0.3px] cursor-pointer min-w-[140px]"
                        >
                            <option value="All">All Categories</option>
                            {currentCategories.filter(c => c.id !== 'All').map((cat) => (
                                <option key={cat.id} value={cat.label}>{cat.label}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af] pointer-events-none" />
                    </div>

                    {/* Country Filter */}
                    <div className="relative">
                        <select
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            className="appearance-none px-4 pr-10 h-[50px] border border-[#d1d5db] rounded-[8px] text-[14px] font-medium text-black bg-white focus:outline-none focus:ring-2 focus:ring-[#C10007] focus:border-transparent tracking-[-0.3px] cursor-pointer min-w-[140px]"
                        >
                            <option value="All">All Countries</option>
                            {Countries.map((c) => (
                                <option key={c.id} value={c.label}>{c.label}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af] pointer-events-none" />
                    </div>

                    {/* Date Range Filter */}
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

                    {/* Export */}
                    <div className="relative hidden md:block">
                        <select
                            value={exportFormat}
                            onChange={(e) => setExportFormat(e.target.value)}
                            className="appearance-none px-4 pr-10 h-[50px] border border-[#d1d5db] rounded-[8px] text-[14px] font-medium text-black bg-white focus:outline-none focus:ring-2 focus:ring-[#C10007] focus:border-transparent tracking-[-0.3px] cursor-pointer w-[100px]"
                        >
                            <option>CSV</option>
                            <option>PDF</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af] pointer-events-none" />
                    </div>
                    <button
                        onClick={handleExportData}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-5 h-[50px] bg-[#C10007] text-white rounded-[6px] hover:bg-[#a10006] transition-colors disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                        <span className="hidden md:inline text-[14px] font-medium tracking-[-0.3px]">Export</span>
                    </button>
                </div>
            </AdminPageHeader>

            {/* Content Type Tabs - Centered */}
            <div className="flex justify-center mb-8">
                <div className="flex p-1 bg-gray-100 rounded-lg w-fit">
                    {(['All', 'Article', 'Blog', 'Newsletter', 'Restaurant'] as const).map((type) => (
                        <button
                            key={type}
                            onClick={() => {
                                setActiveTab(type);
                                setCategory('All'); // Reset category on tab switch
                            }}
                            className={`px-4 py-2 text-[13px] font-bold rounded-md transition-all ${activeTab === type
                                ? 'bg-white text-[#C10007] shadow-sm'
                                : 'text-[#6b7280] hover:text-[#111827]'
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>


            {/* Analytics Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
                {isLoading ? (
                    Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-[140px] rounded-[12px] bg-white shadow-sm" />)
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

            {/* Interval Selection for Chart */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {(['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Bi-annual', 'Annually'] as const).map((int) => (
                    <button
                        key={int}
                        onClick={() => setInterval(int)}
                        className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${interval === int
                            ? 'bg-[#C10007] text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                            }`}
                    >
                        {int}
                    </button>
                ))}
            </div>

            {/* Charts Grid */}
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
                            data={filteredCategoryData}
                            title={categoryDistributionTitle}
                            description={categoryDistributionDescription}
                            centerLabel={activeTab === 'All' ? "Total Articles" : `Total ${activeTab}s`}
                        />
                    </>
                )}
            </div>

            {/* New Charts: Visitors & Sources */}
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

            {/* Country and Article Distribution Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
                {isLoading ? (
                    <>
                        <Skeleton className="h-[400px] rounded-[12px] bg-white shadow-sm" />
                        <Skeleton className="h-[400px] rounded-[12px] bg-white shadow-sm" />
                    </>
                ) : (
                    <>
                        <CountryPerformanceChart data={countryPerformanceData} />
                        <ArticleDistribution sites={distributionSites} totalArticles={totalPublished} className="h-full" />
                    </>
                )}
            </div>

            {/* Content Performance Table */}
            <div className="mb-8 relative">
                {isLoading ? (
                    <Skeleton className="h-[400px] rounded-[12px] bg-white shadow-sm" />
                ) : (
                    <ContentPerformanceTable
                        data={contentPerfData}
                        title={contentPerformanceTitle}
                        description={contentPerformanceDescription}
                        action={activeTab === 'Restaurant' ? (
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-700">View:</span>
                                <div className="relative">
                                    <select
                                        value={restaurantFilter}
                                        onChange={(e) => setRestaurantFilter(e.target.value)}
                                        className="appearance-none pl-3 pr-8 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#C10007] focus:border-transparent cursor-pointer"
                                    >
                                        <option value="Listings">Restaurant Listings</option>
                                        <option value="Related Articles">Related Articles</option>
                                        <option value="Related Blogs">Related Blogs</option>
                                        <option value="Related Newsletters">Related Newsletters</option>
                                    </select>
                                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none" />
                                </div>
                            </div>
                        ) : undefined}
                    />
                )}
            </div>

            {/* Partner Performance Table */}
            <div className="mb-8">
                {isLoading ? (
                    <Skeleton className="h-[400px] rounded-[12px] bg-white shadow-sm" />
                ) : (
                    <PartnerPerformanceTable data={partnerData} />
                )}
            </div>
        </div >
    );
}
