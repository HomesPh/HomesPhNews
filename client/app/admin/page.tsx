"use client";

import { useEffect, useState } from 'react';
import AdminPageHeader from "@/components/features/admin/shared/AdminPageHeader";
import StatCard from "@/components/features/admin/shared/StatCard";
import ArticleCard from "@/components/features/admin/dashboard/ArticleCard";
import ArticleDistribution from "@/components/features/admin/dashboard/ArticleDistribution";
import QuickActions from "@/components/features/admin/dashboard/QuickActions";
import Link from 'next/link';
import { getAdminStats, AdminStatsResponse } from "@/lib/api-v2/admin/service/dashboard/getAdminStats";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from 'next/navigation';

/**
 * AdminDashboard - Main overview page for administrative operations
 */
export default function AdminDashboard() {
    const router = useRouter();
    const userName = "Admin";
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<AdminStatsResponse | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getAdminStats();
                setData(response.data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const stats = [
        {
            title: "Total Articles",
            value: data?.stats.total_articles ?? 0,
            trend: data?.stats.total_articles_trend ?? "+0%",
            iconName: "FileText" as const,
            iconColor: "text-blue-600",
            iconBgColor: "bg-blue-50"
        },
        {
            title: "Total Views",
            value: (data?.stats.total_views ?? 0).toLocaleString(),
            trend: data?.stats.total_views_trend ?? "+0%",
            iconName: "Eye" as const,
            iconColor: "text-purple-600",
            iconBgColor: "bg-purple-50"
        },
        {
            title: "Published",
            value: data?.stats.total_published ?? 0,
            trend: data?.stats.total_published_trend ?? "+0%",
            iconName: "CheckCircle" as const,
            iconColor: "text-emerald-600",
            iconBgColor: "bg-emerald-50"
        },
        {
            title: "Pending Review",
            value: data?.stats.pending_review ?? 0,
            trend: data?.stats.pending_review_trend ?? "Checking",
            iconName: "SquareStack" as const,
            iconColor: "text-orange-600",
            iconBgColor: "bg-orange-50"
        }
    ];

    // Format distribution data for the component
    const distributionSites = data?.stats.total_distribution.map(d => ({
        name: d.distributed_in,
        count: d.published_count,
        totalViews: 0, // The API might need update to return this, or we default to 0 for now as per reference
        color: "#C10007"
    })) ?? [];

    return (
        <div className="p-4 md:px-8 md:py-6 bg-[#f8fafc] min-h-screen">
            <div className="max-w-[1400px] mx-auto space-y-6">
                {/* Header Section */}
                <div className="pb-2">
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Main Dashboard</h1>
                    <p className="text-sm text-gray-500 font-medium">Welcome back, {userName}. Here's the latest performance across your network.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
                    {isLoading ? (
                        Array(4).fill(0).map((_, i) => (
                            <Skeleton key={i} className="h-[100px] rounded-xl bg-white shadow-sm" />
                        ))
                    ) : (
                        stats.map((stat, index) => (
                            <StatCard key={index} {...stat} hasIconBg={true} />
                        ))
                    )}
                </div>

                {/* Main Content: Two Columns */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
                    {/* Left Column: Recent Articles */}
                    <div className="xl:col-span-2 space-y-4 h-fit">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 h-fit">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">Recent Coverage</h2>
                                    <p className="text-[11px] text-gray-400 font-black uppercase tracking-widest">Latest articles published across synced platforms</p>
                                </div>
                                <Link
                                    href="/admin/articles?status=published"
                                    className="px-4 py-1.5 rounded-lg bg-gray-50 text-[12px] font-bold text-gray-600 hover:bg-gray-100 transition-colors border border-gray-200"
                                >
                                    View Repository
                                </Link>
                            </div>

                            <div className="space-y-2">
                                {isLoading ? (
                                    Array(4).fill(0).map((_, i) => (
                                        <Skeleton key={i} className="h-[70px] rounded-xl bg-gray-50" />
                                    ))
                                ) : data?.recent_articles && data.recent_articles.length > 0 ? (
                                    data.recent_articles.map((article: any) => (
                                        <ArticleCard
                                            key={article.id}
                                            id={article.id}
                                            image={article.image_url || article.image}
                                            category={article.category}
                                            location={article.country}
                                            title={article.title}
                                            date={new Date(article.created_at).toLocaleDateString()}
                                            views={article.views_count.toString()}
                                            status={article.status}
                                            onClick={() => router.push(`/admin/articles/${article.id}`)}
                                        />
                                    ))
                                ) : (
                                    <div className="py-8 text-center">
                                        <p className="text-gray-400 font-bold italic">No active articles found.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Distribution & Actions */}
                    <div className="space-y-6 h-fit">
                        {isLoading ? (
                            <>
                                <Skeleton className="h-[300px] rounded-2xl bg-white" />
                                <Skeleton className="h-[150px] rounded-2xl bg-white" />
                            </>
                        ) : (
                            <>
                                <ArticleDistribution sites={distributionSites} totalArticles={Number(data?.stats.total_published ?? 1)} />
                                <QuickActions />
                            </>
                        )}
                    </div>
                </div>

                {/* Sidebar: Distribution and Quick Actions */}
                <div className="space-y-8">
                    {isLoading ? (
                        <>
                            <Skeleton className="h-[300px] rounded-xl bg-white" />
                            <Skeleton className="h-[200px] rounded-xl bg-white" />
                        </>
                    ) : (
                        <>
                            <ArticleDistribution
                                sites={distributionSites.map(s => ({
                                    ...s,
                                    totalViews: 0 // Adding missing prop requirement for current ArticleDistribution
                                }))}
                                totalArticles={Number(data?.stats.total_published ?? 0)}
                            />
                            <QuickActions />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
