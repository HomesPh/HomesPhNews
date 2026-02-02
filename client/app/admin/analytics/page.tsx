"use client";

import { useEffect, useState } from 'react';
import StatCard from "@/components/features/admin/shared/StatCard";
import AdminPageHeader from "@/components/features/admin/shared/AdminPageHeader";
import { ChevronDown, Download, Loader2, Filter, Info } from 'lucide-react';
import TrafficTrendsChart from "@/components/features/admin/analytics/TrafficTrendsChart";
import CategoryDistributionChart from "@/components/features/admin/analytics/CategoryDistributionChart";
import CountryPerformanceChart from "@/components/features/admin/analytics/CountryPerformanceChart";
import PartnerPerformanceTable from "@/components/features/admin/analytics/PartnerPerformanceTable";
import ArticleDistribution from "@/components/features/admin/dashboard/ArticleDistribution";
import { getAdminAnalytics, AdminAnalyticsResponse } from "@/lib/api-v2/admin/service/analytics/getAdminAnalytics";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export default function AnalyticsPage() {
    const [dateRange, setDateRange] = useState('Last 7 Days');
    const [exportFormat, setExportFormat] = useState('CSV');
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<AdminAnalyticsResponse | null>(null);

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
                const response = await getAdminAnalytics({ period });
                setData(response.data);
            } catch (error) {
                console.error("Failed to fetch analytics", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [dateRange]);

    // Map backend data to component formats
    const stats = data ? [
        { title: "News Published", value: data.overview.total_page_news, trend: data.overview.total_page_news_trend, iconName: "FileText" as const, iconColor: "text-blue-600", iconBgColor: "bg-blue-50" },
        { title: "Total Reach", value: data.overview.unique_visitors.toLocaleString(), trend: data.overview.unique_visitors_trend, iconName: "Eye" as const, iconColor: "text-purple-600", iconBgColor: "bg-purple-50" },
        { title: "Engagement", value: data.overview.total_clicks.toLocaleString(), trend: data.overview.total_clicks_trend, iconName: "MousePointerClick" as const, iconColor: "text-emerald-600", iconBgColor: "bg-emerald-50" },
        { title: "Engagement Rate", value: `${data.overview.avg_engagement}%`, trend: data.overview.avg_engagement_trend, iconName: "TrendingUp" as const, iconColor: "text-orange-600", iconBgColor: "bg-orange-50" }
    ] : [];

    const trafficData = data?.traffic_trends.map(t => ({
        month: t.date,
        pageViews: Number(t.total_page_news),
        visitors: Number(t.unique_visitors)
    })) ?? [];

    const colors = ['#C10007', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
    const categoryData = data?.content_by_category.map((cat, index) => ({
        name: cat.category,
        value: cat.count,
        color: colors[index % colors.length]
    })) ?? [];

    const countryPerformanceData = data?.performance_by_country.map((c) => ({
        country: c.country,
        articlesPublished: 0,
        totalViews: Number(c.total_views)
    })) ?? [];

    const partnerData = data?.partner_performance ?? [];

    const distributionSites = data?.partner_performance.map(p => ({
        name: p.site,
        count: p.articlesShared,
        totalViews: p.monthlyViews
    })) ?? [];

    const handleExportData = () => {
        if (!data) return;
        if (exportFormat === 'CSV') {
            let csv = 'Metric,Value\n';
            csv += `Total Page News,${data.overview.total_page_news}\n`;
            csv += `Unique Visitors,${data.overview.unique_visitors}\n`;
            csv += `Total Clicks,${data.overview.total_clicks}\n`;
            csv += `Avg Engagement,${data.overview.avg_engagement}%\n`;

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
        <div className="p-4 md:p-8 bg-[#f8fafc] min-h-screen">
            <div className="max-w-[1600px] mx-auto space-y-8">
                {/* Premium Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-200">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
                            Growth Analytics
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Info className="w-5 h-5 text-gray-400 cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Real-time performance metrics across all integrated news platforms.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </h1>
                        <p className="text-gray-500 mt-1 font-medium">Monitoring your impact across the globe.</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-xl border border-gray-200">
                            <Filter className="w-4 h-4 text-gray-400" />
                            <select
                                value={dateRange}
                                onChange={(e) => setDateRange(e.target.value)}
                                className="bg-transparent border-none text-[14px] font-bold text-gray-700 focus:ring-0 cursor-pointer outline-none"
                            >
                                <option>Last 7 Days</option>
                                <option>Last 30 Days</option>
                                <option>Last 3 Months</option>
                                <option>Last 6 Months</option>
                                <option>Last Year</option>
                            </select>
                        </div>

                        <div className="h-6 w-[1px] bg-gray-200 mx-1 hidden sm:block" />

                        <div className="flex items-center gap-2">
                            <select
                                value={exportFormat}
                                onChange={(e) => setExportFormat(e.target.value)}
                                className="px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-[14px] font-semibold text-gray-600 focus:ring-2 focus:ring-[#C10007] outline-none cursor-pointer"
                            >
                                <option>CSV</option>
                                <option>PDF</option>
                                <option>Excel</option>
                            </select>

                            <button
                                onClick={handleExportData}
                                className="flex items-center gap-2 px-5 py-2 bg-[#C10007] text-white rounded-xl hover:bg-[#a10006] transition-all active:scale-95 shadow-md shadow-red-100 disabled:opacity-50"
                                disabled={isLoading}
                            >
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                                <span className="text-[14px] font-bold uppercase tracking-wider">Export</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {isLoading ? (
                        Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-[140px] rounded-2xl bg-white shadow-sm" />)
                    ) : (
                        stats.map((stat, index) => (
                            <StatCard key={index} {...stat} hasIconBg={true} />
                        ))
                    )}
                </div>

                {/* Charts Row 1 */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    <div className="xl:col-span-2">
                        {isLoading ? (
                            <Skeleton className="h-[450px] rounded-2xl bg-white shadow-sm" />
                        ) : (
                            <TrafficTrendsChart data={trafficData} />
                        )}
                    </div>
                    <div className="xl:col-span-1">
                        {isLoading ? (
                            <Skeleton className="h-[450px] rounded-2xl bg-white shadow-sm" />
                        ) : (
                            <CategoryDistributionChart data={categoryData} />
                        )}
                    </div>
                </div>

                {/* Charts Row 2: Breakdowns */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {isLoading ? (
                        <>
                            <Skeleton className="h-[500px] rounded-2xl bg-white shadow-sm" />
                            <Skeleton className="h-[500px] rounded-2xl bg-white shadow-sm" />
                        </>
                    ) : (
                        <>
                            <CountryPerformanceChart data={countryPerformanceData} />
                            <ArticleDistribution sites={distributionSites} totalArticles={data?.overview.total_page_news ?? 1} />
                        </>
                    )}
                </div>

                {/* Full Partner Performance Table */}
                <div className="pt-4">
                    {isLoading ? (
                        <Skeleton className="h-[500px] rounded-2xl bg-white shadow-sm" />
                    ) : (
                        <PartnerPerformanceTable data={partnerData} />
                    )}
                </div>
            </div>
        </div>
    );
}
