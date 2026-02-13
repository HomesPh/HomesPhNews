"use client";

import { useEffect, useState } from "react";
import AdminPageHeader from "@/components/features/admin/shared/AdminPageHeader";
import StatCard from "@/components/features/admin/shared/StatCard";
import TrafficTrendsChart from "@/components/features/admin/analytics/TrafficTrendsChart";
import { GeographicMap } from "@/components/features/admin/analytics/GeographicMap";
import TopArticlesList from "@/components/features/blogger/analytics/TopArticlesList";
import SiteDistributionChart from "@/components/features/blogger/analytics/SiteDistributionChart";
import VisitorBreakdownChart from "@/components/features/admin/analytics/VisitorBreakdownChart";
import ReferralSourcesTable from "@/components/features/admin/analytics/ReferralSourcesTable";
import BloggerIndividualAnalytics from "@/components/features/blogger/analytics/BloggerIndividualAnalytics";
import { getBloggerAnalytics, BloggerAnalyticsData } from "@/lib/api-v2/blogger/service/analytics/getBloggerAnalytics";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown, Download, Loader2, LayoutDashboard, FileText } from "lucide-react";

export default function BloggerAnalyticsPage() {
    const [data, setData] = useState<BloggerAnalyticsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [dateRange, setDateRange] = useState("Last 30 Days");
    const [exportFormat, setExportFormat] = useState("CSV");
    const [viewMode, setViewMode] = useState<'overview' | 'individual'>('overview');

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const result = await getBloggerAnalytics();
                setData(result);
            } catch (error) {
                console.error("Failed to fetch blogger analytics:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleExport = () => {
        console.log("Exporting report...");
    };

    if (viewMode === 'individual' && data) {
        return (
            <div className="p-8 bg-[#f9fafb] min-h-screen">
                <BloggerIndividualAnalytics
                    data={data}
                    onBack={() => setViewMode('overview')}
                />
            </div>
        );
    }

    return (
        <div className="p-8 bg-[#f9fafb] min-h-screen">
            <AdminPageHeader
                title="Content Analytics"
                description="Track your writing performance and audience engagement."
            >
                <div className="flex flex-col xl:flex-row items-end xl:items-center gap-4">
                    {/* View Toggle */}
                    <div className="flex items-center p-1 bg-gray-100 rounded-lg border border-gray-200">
                        <button
                            onClick={() => setViewMode('overview')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'overview'
                                ? 'bg-white text-[#C10007] shadow-sm'
                                : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            Overview
                        </button>
                        <button
                            onClick={() => setViewMode('individual')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'individual'
                                ? 'bg-white text-[#C10007] shadow-sm'
                                : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            <FileText className="w-4 h-4" />
                            Individual Blogs
                        </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
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
                            onClick={handleExport}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-5 h-[50px] bg-[#C10007] text-white rounded-[6px] hover:bg-[#a10006] transition-colors disabled:opacity-50"
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                            <span className="hidden md:inline text-[14px] font-medium tracking-[-0.3px]">Export Report</span>
                        </button>
                    </div>
                </div>
            </AdminPageHeader>

            {/* Performance Overview (Stats Grid) */}
            <div className="mb-8">
                <h3 className="text-lg font-bold text-[#111827] mb-4">Performance Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                    {isLoading ? (
                        Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-[140px] rounded-[12px] bg-white shadow-sm" />)
                    ) : (
                        <>
                            <StatCard
                                title="Total Blogs"
                                value={data?.metrics.totalArticles.value || 0}
                                trend={`${data?.metrics.totalArticles.change}%`}
                                iconName="FileText"
                                iconBgColor="bg-blue-50"
                                iconColor="text-blue-600"
                                hasIconBg={true}
                            />
                            <StatCard
                                title="Total Views"
                                value={data?.metrics.totalViews.value.toLocaleString() || 0}
                                trend={`${data?.metrics.totalViews.change}%`}
                                iconName="Eye"
                                iconBgColor="bg-indigo-50"
                                iconColor="text-indigo-600"
                                hasIconBg={true}
                            />
                            <StatCard
                                title="Unique Visitors"
                                value={data?.metrics.totalVisitors.value.toLocaleString() || 0}
                                trend={`${data?.metrics.totalVisitors.change}%`}
                                iconName="Users"
                                iconBgColor="bg-purple-50"
                                iconColor="text-purple-600"
                                hasIconBg={true}
                            />
                            <StatCard
                                title="Total Shares"
                                value={data?.metrics.totalShares.value.toLocaleString() || 0}
                                trend={`${data?.metrics.totalShares.change}%`}
                                iconName="Share2"
                                iconBgColor="bg-green-50"
                                iconColor="text-green-600"
                                hasIconBg={true}
                            />
                            <StatCard
                                title="Engagement Rate"
                                value={`${data?.metrics.avgEngagement.value}%`}
                                trend={`${data?.metrics.avgEngagement.change}%`}
                                iconName="MousePointerClick"
                                iconBgColor="bg-orange-50"
                                iconColor="text-orange-600"
                                hasIconBg={true}
                            />
                            <StatCard
                                title="Avg. Read Time"
                                value={data?.metrics.avgReadTime.value || "0m 0s"}
                                trend={`${data?.metrics.avgReadTime.change}%`}
                                iconName="Clock"
                                iconBgColor="bg-teal-50"
                                iconColor="text-teal-600"
                                hasIconBg={true}
                            />
                        </>
                    )}
                </div>
            </div>

            {/* Performance Trends Chart */}
            <div className="mb-8">
                {isLoading ? (
                    <Skeleton className="h-[400px] w-full rounded-[12px] bg-white shadow-sm" />
                ) : (
                    data && (
                        <TrafficTrendsChart
                            data={data.dailyTrends.map(d => ({
                                month: d.date,
                                pageViews: d.pageViews,
                                visitors: d.visitors
                            }))}
                        />
                    )
                )}
            </div>

            {/* Demographics & Referrals */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {isLoading ? (
                    <Skeleton className="h-[400px] rounded-[12px] bg-white shadow-sm" />
                ) : (
                    data?.visitorDevices && <VisitorBreakdownChart data={data.visitorDevices} />
                )}

                {isLoading ? (
                    <Skeleton className="h-[400px] rounded-[12px] bg-white shadow-sm" />
                ) : (
                    data?.referralSources && <ReferralSourcesTable data={data.referralSources} />
                )}
            </div>

            {/* Top Articles List */}
            <div className="mb-8">
                {isLoading ? (
                    <Skeleton className="h-[400px] w-full rounded-[12px] bg-white shadow-sm" />
                ) : (
                    data && <TopArticlesList articles={data.topArticles} />
                )}
            </div>

            {/* Distribution Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Site Distribution */}
                {isLoading ? (
                    <Skeleton className="h-[400px] rounded-[12px] bg-white shadow-sm" />
                ) : (
                    data && <SiteDistributionChart data={data.siteDistribution} />
                )}

                {/* Geographic Distribution */}
                {isLoading ? (
                    <Skeleton className="h-[400px] rounded-[12px] bg-white shadow-sm" />
                ) : (
                    data && (
                        <div className="bg-white rounded-[12px] border border-[#f3f4f6] shadow-sm p-6 max-h-[462px] overflow-hidden">
                            <div className="mb-4">
                                <h3 className="text-lg font-bold text-[#111827] mb-1">Geographic Distribution</h3>
                                <p className="text-sm text-gray-500">Where your readers are</p>
                            </div>
                            <GeographicMap
                                data={data.geographicDistribution.map(d => ({
                                    country: d.country,
                                    percentage: d.percentage,
                                    lat: d.coordinates[0],
                                    lng: d.coordinates[1],
                                    size: d.percentage // Use percentage as size factor
                                }))}
                            />
                            <div className="mt-6 space-y-3">
                                {data.geographicDistribution.slice(0, 5).map((item, index) => (
                                    <div key={index} className="flex items-center justify-between text-sm py-2 px-3 bg-gray-50 rounded-lg">
                                        <span className="font-medium text-gray-700">{item.country}</span>
                                        <span className="font-semibold text-gray-900">{item.percentage}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
