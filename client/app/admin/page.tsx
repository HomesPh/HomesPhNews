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
            trend: "+12% vs last month",
            iconName: "FileText" as const
        },
        {
            title: "Total Views",
            value: (data?.stats.total_views ?? 0).toLocaleString(),
            trend: "+8% vs last month",
            iconName: "Eye" as const
        },
        {
            title: "Published",
            value: data?.stats.total_published ?? 0,
            trend: "+5% vs last month",
            iconName: "CheckCircle" as const
        },
        {
            title: "Pending Review",
            value: data?.stats.pending_review ?? 0,
            trend: "Needs attention",
            iconName: "SquareStack" as const
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
        <div className="p-8 bg-[#f9fafb] min-h-screen">
            {/* Header: User Welcome and Title */}
            <AdminPageHeader
                title="Dashboard"
                description={`Welcome back, ${userName}. Here's what's happening today.`}
            />

            {/* Stats Grid: Summary metrics across the platform */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {isLoading ? (
                    Array(4).fill(0).map((_, i) => (
                        <Skeleton key={i} className="h-[120px] rounded-xl bg-white" />
                    ))
                ) : (
                    stats.map((stat, index) => (
                        <StatCard key={index} {...stat} />
                    ))
                )}
            </div>

            {/* Main Content Area: Articles and Side actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Section: Recent Articles List */}
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-[18px] font-bold text-[#111827] tracking-[-0.5px]">Recent Published Articles</h2>
                        <Link
                            href="/admin/articles?status=published"
                            className="text-[14px] font-semibold text-[#C10007] hover:text-[#a10006] tracking-[-0.5px]"
                        >
                            View All →
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {isLoading ? (
                            Array(3).fill(0).map((_, i) => (
                                <Skeleton key={i} className="h-[100px] rounded-lg bg-white" />
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
                            <div className="p-10 text-center bg-white rounded-lg border border-dashed">
                                <p className="text-gray-500">No published articles yet.</p>
                            </div>
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
