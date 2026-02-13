"use client";

import AdminPageHeader from "@/components/features/admin/shared/AdminPageHeader";
import StatCard from "@/components/features/admin/shared/StatCard";
import { BookOpen, Eye, ThumbsUp, MessageSquare, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { mockBlogs } from "@/app/admin/users/data";

export default function BloggerDashboardPage() {
    const router = useRouter();

    // Filter blogs for the mock author "Maria Santos"
    const mariaBlogs = mockBlogs.filter(b => b.authorName === "Maria Santos");
    const totalViews = mariaBlogs.reduce((acc, b) => acc + b.views, 0);

    const stats = [
        {
            title: "Total Blogs",
            value: mariaBlogs.length.toString(),
            iconName: "BookOpen" as const,
            trend: "+12% vs last month",
        },
        {
            title: "Total Views",
            value: totalViews.toLocaleString(),
            iconName: "Eye" as const,
            trend: "+8% vs last month",
        },
        {
            title: "Engagements",
            value: "2,450", // Mock value
            iconName: "ThumbsUp" as const,
            trend: "+5% vs last month",
        },
        {
            title: "Comments",
            value: "128", // Mock value
            iconName: "MessageSquare" as const,
            trend: "Needs attention",
        }
    ];

    return (
        <div className="p-8 space-y-8">
            <AdminPageHeader
                title="Blogger Dashboard"
                description="Welcome back, Maria! Here's how your blogs are performing."
                actionLabel="Create New Blog"
                onAction={() => router.push('/blogger/blogs/create')}
                actionIcon={Plus}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Performance</h3>
                <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <p className="text-gray-500">Analytics chart rendering placeholder...</p>
                </div>
            </div>
        </div>
    );
}
