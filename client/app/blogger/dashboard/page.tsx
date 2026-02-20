"use client";

import { useEffect, useState } from 'react';
import AdminPageHeader from "@/components/features/admin/shared/AdminPageHeader";
import StatCard from "@/components/features/admin/shared/StatCard";
import ArticleCard from "@/components/features/admin/dashboard/ArticleCard";
import ArticleDistribution from "@/components/features/admin/dashboard/ArticleDistribution";
import BloggerQuickActions from "@/components/features/blogger/dashboard/BloggerQuickActions";
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { getBloggerDashboardStats, BloggerDashboardStats } from "@/lib/api-v2/blogger/service/dashboard/getBloggerDashboardStats";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";
import { useAuth } from "@/lib/api-v2";

export default function BloggerDashboardPage() {
    const router = useRouter();
    const user = useAuth((state) => state.user);
    const userName = user?.first_name || "Blogger";
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<BloggerDashboardStats | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getBloggerDashboardStats();
                setData(response);
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
            title: "Total Blogs",
            value: data?.stats.total_blogs || 0,
            trend: "+12% vs last month",
            iconName: "FileText" as const
        },
        {
            title: "Total Views",
            value: (data?.stats.total_views || 0).toLocaleString(),
            trend: "+8% vs last month",
            iconName: "Eye" as const
        },
        {
            title: "Total Comments",
            value: data?.stats.total_comments || 0,
            trend: "+5% vs last month",
            iconName: "MessageSquare" as const
        },
        {
            title: "Avg. Engagement",
            value: `${data?.stats.avg_engagement || 0}%`,
            trend: "Needs attention",
            iconName: "Activity" as const
        }
    ];

    // Format distribution data for the component
    const distributionSites = data?.stats.total_distribution.map(d => ({
        name: d.distributed_in,
        count: d.published_count,
        color: "#C10007"
    })) ?? [];

    return (
        <div className="p-8 bg-[#f9fafb] min-h-screen">
            <AdminPageHeader
                title="Blogger Dashboard"
                description={`Welcome back, ${userName}! Here's how your blogs are performing.`}
                actionLabel="Create New Blog"
                onAction={() => router.push('/blogger/blogs/create')}
                actionIcon={Plus}
            />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {isLoading ? (
                    Array(4).fill(0).map((_, i) => (
                        <Skeleton key={i} className="h-[120px] rounded-xl bg-white shadow-sm" />
                    ))
                ) : (
                    stats.map((stat, index) => (
                        <StatCard key={index} {...stat} />
                    ))
                )}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Section: Recent Blogs List */}
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-[18px] font-bold text-[#111827] tracking-[-0.5px]">Recent Blogs</h2>
                        <Link
                            href="/blogger/blogs"
                            className="text-[14px] font-semibold text-[#C10007] hover:text-[#a10006] tracking-[-0.5px]"
                        >
                            View All →
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {isLoading ? (
                            Array(3).fill(0).map((_, i) => (
                                <Skeleton key={i} className="h-[100px] rounded-lg bg-white shadow-sm" />
                            ))
                        ) : data?.recent_blogs && data.recent_blogs.length > 0 ? (
                            data.recent_blogs.map((blog) => (
                                <ArticleCard
                                    key={blog.id}
                                    id={blog.id}
                                    image={blog.image}
                                    category={blog.category}
                                    location={blog.country}
                                    title={blog.title}
                                    date={new Date(blog.created_at).toLocaleDateString()}
                                    views={blog.views_count.toString()}
                                    status={blog.status as any} // Cast to any to avoid strict union check for now, or ensure mock matches StatusType
                                    image_position={blog.image_position}
                                    image_position_x={blog.image_position_x}
                                    onClick={() => router.push(`/blogger/blogs/${blog.id}`)}
                                />
                            ))
                        ) : (
                            <div className="p-10 text-center bg-white rounded-lg border border-dashed border-gray-200">
                                <p className="text-gray-500 font-medium tracking-[-0.5px]">No blogs yet.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar: Distribution and Quick Actions */}
                <div className="space-y-8">
                    {isLoading ? (
                        <>
                            <Skeleton className="h-[300px] rounded-xl bg-white shadow-sm" />
                            <Skeleton className="h-[200px] rounded-xl bg-white shadow-sm" />
                        </>
                    ) : (
                        <>
                            <div className="bg-white rounded-[12px] border border-[#f3f4f6] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] overflow-hidden">
                                <ArticleDistribution
                                    sites={distributionSites}
                                    totalArticles={Number(data?.stats.total_blogs ?? 0)}
                                    className="border-none shadow-none"
                                />
                            </div>
                            <BloggerQuickActions />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
