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
import { Categories, Countries } from '@/app/data';
import { format, parseISO, startOfWeek, startOfMonth, startOfQuarter, startOfYear, getQuarter, getYear } from 'date-fns';

type TimeInterval = 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Bi-annual' | 'Annually';

export default function AnalyticsPage() {
    const [dateRange, setDateRange] = useState('Last 30 Days');
    const [category, setCategory] = useState('All');
    const [country, setCountry] = useState('All');
    const [exportFormat, setExportFormat] = useState('CSV');
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<AdminAnalyticsResponse | null>(null);
    const [interval, setInterval] = useState<TimeInterval>('Daily');

    const rangeMap: Record<string, string> = {
        'Last 7 Days': '7d',
        'Last 30 Days': '30d',
        'Last 3 Months': '3m',
        'Last 6 Months': '6m',
        'Last Year': '1y',
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const period = rangeMap[dateRange] || '7d';
                const response = await getAdminAnalytics({
                    period,
                    category: category === 'All' ? undefined : category,
                    country: country === 'All' ? undefined : country
                });
                setData(response.data);
            } catch (error) {
                console.error("Failed to fetch analytics", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [dateRange, category, country]);

    // --- Aggregation Logic ---
    const aggregatedTrafficData = useMemo(() => {
        if (!data?.traffic_trends) return [];

        const trends = data.traffic_trends;
        const grouped: Record<string, { pageViews: number; visitors: number; count: number }> = {};

        trends.forEach(item => {
            const date = parseISO(item.date);
            let key = item.date; // Default Daily

            switch (interval) {
                case 'Weekly':
                    key = `Week ${format(startOfWeek(date), 'w, yyyy')}`;
                    break;
                case 'Monthly':
                    key = format(startOfMonth(date), 'MMM yyyy');
                    break;
                case 'Quarterly':
                    key = `Q${getQuarter(date)} ${getYear(date)}`;
                    break;
                case 'Bi-annual':
                    const month = date.getMonth();
                    key = month < 6 ? `H1 ${getYear(date)}` : `H2 ${getYear(date)}`;
                    break;
                case 'Annually':
                    key = format(startOfYear(date), 'yyyy');
                    break;
                case 'Daily':
                default:
                    key = format(date, 'MMM dd');
                    break;
            }

            if (!grouped[key]) {
                grouped[key] = { pageViews: 0, visitors: 0, count: 0 };
            }
            grouped[key].pageViews += Number(item.total_page_news);
            grouped[key].visitors += Number(item.unique_visitors);
            grouped[key].count += 1;
        });

        return Object.entries(grouped).map(([key, value]) => ({
            month: key,
            pageViews: value.pageViews,
            visitors: value.visitors
        }));
    }, [data, interval]);


    // Calculate Custom Metrics
    const totalPublished = (data?.overview.total_page_news || 0) + (data?.overview.total_blogs || 0) + (data?.overview.total_newsletters || 0);
    const totalClicks = data?.overview.total_clicks || 0;
    const totalViews = data?.overview.unique_visitors || 0;

    // Formula: (Total Clicks + Total Views) / 30
    const avgEngagementScore = totalViews > 0 ? ((totalClicks + totalViews) / 30).toFixed(1) : "0.0";

    const stats = data ? [
        { title: "Content Published", value: totalPublished, trend: data.overview.total_page_news_trend, iconName: "FileText" as const, iconColor: "text-blue-600", iconBgColor: "bg-blue-50" },
        { title: "Total Views", value: totalViews.toLocaleString(), trend: data.overview.unique_visitors_trend, iconName: "Eye" as const, iconColor: "text-purple-600", iconBgColor: "bg-purple-50" },
        { title: "Total Clicks", value: totalClicks.toLocaleString(), trend: data.overview.total_clicks_trend, iconName: "MousePointerClick" as const, iconColor: "text-emerald-600", iconBgColor: "bg-emerald-50" },
        { title: "Avg Engagement", value: `${avgEngagementScore}%`, trend: data.overview.avg_engagement_trend, iconName: "TrendingUp" as const, iconColor: "text-orange-600", iconBgColor: "bg-orange-50" },
        { title: "Avg Read Duration", value: data.overview.avg_read_duration || '0m 0s', trend: '+0%', iconName: "Clock" as const, iconColor: "text-cyan-600", iconBgColor: "bg-cyan-50" }
    ] : [];

    const colors = ['#C10007', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
    const categoryData = data?.content_by_category.map((cat, index) => ({
        name: cat.category,
        value: cat.count,
        color: colors[index % colors.length]
    })) ?? [];

    // Calculate Country Percentages
    const countryTotalViews = data?.performance_by_country.reduce((acc, curr) => acc + Number(curr.total_views), 0) || 1;
    const countryPerformanceData = data?.performance_by_country.map((c) => ({
        country: c.country,
        articlesPublished: 0,
        totalViews: Number(c.total_views),
        percentage: ((Number(c.total_views) / countryTotalViews) * 100).toFixed(1) + '%'
    })) ?? [];

    const partnerData = data?.partner_performance ?? [];
    const contentPerfData = data?.content_performance || [];

    const distributionSites = data?.partner_performance.map(p => ({
        name: p.site,
        count: p.articlesShared,
        totalViews: p.monthlyViews
    })) ?? [];

    const deviceData = data?.device_breakdown || [];
    const sourceData = data?.traffic_sources || [];

    const handleExportData = () => {
        // Export logic (kept same as before)
        if (!data) return;
        if (exportFormat === 'CSV') {
            let csv = 'Metric,Value\n';
            csv += `Total Content Published,${totalPublished}\n`;
            csv += `Total Views,${totalViews}\n`;
            csv += `Total Clicks,${totalClicks}\n`;
            csv += `Avg Engagement Score,${avgEngagementScore}\n`;

            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `analytics-${dateRange.toLowerCase().replace(/\s+/g, '-')}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);
        } else {
            alert(`${exportFormat} export would be implemented here`);
        }
    };

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
                            {Categories.map((cat) => (
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

                    {/* Export stuff kept same */}
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

            {/* Analytics Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                {isLoading ? (
                    Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-[140px] rounded-[12px] bg-white shadow-sm" />)
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
                        <CategoryDistributionChart data={categoryData} />
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
            <div className="mb-8">
                {isLoading ? (
                    <Skeleton className="h-[400px] rounded-[12px] bg-white shadow-sm" />
                ) : (
                    <ContentPerformanceTable data={contentPerfData} />
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
