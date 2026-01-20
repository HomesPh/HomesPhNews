import StatCard from "@/components/features/admin/dashboard/StatCard";
import ArticleCard from "@/components/features/admin/dashboard/ArticleCard";
import ArticleDistribution from "@/components/features/admin/dashboard/ArticleDistribution";
import QuickActions from "@/components/features/admin/dashboard/QuickActions";
import DashboardHeader from "@/components/features/admin/dashboard/DashboardHeader";
import Link from 'next/link';
import { stats, recentArticles, sites } from "./data";

/**
 * AdminDashboard - Main overview page for administrative operations
 */
export default function AdminDashboard() {
    return (
        <div className="p-8">
            {/* Header: User Welcome and Title */}
            <DashboardHeader userName="John" />

            {/* Stats Grid: Summary metrics across the platform */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            {/* Main Content Area: Articles and Side actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Section: Recent Articles List */}
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-[18px] font-bold text-[#111827] tracking-[-0.5px]">Recent Articles</h2>
                        <Link
                            href="/admin/articles"
                            className="text-[14px] font-semibold text-[#C10007] hover:text-[#a10006] tracking-[-0.5px]"
                        >
                            View All →
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {recentArticles.map((article) => (
                            <ArticleCard
                                key={article.id}
                                image={article.image}
                                category={article.category}
                                location={article.location}
                                title={article.title}
                                date={article.date}
                                views={article.views}
                            />
                        ))}
                    </div>
                </div>

                {/* Sidebar: Distribution and Quick Actions */}
                <div className="space-y-8">
                    <ArticleDistribution sites={sites} totalArticles={8} />
                    <QuickActions />
                </div>
            </div>
        </div>
    );
}
