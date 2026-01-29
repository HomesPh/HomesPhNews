"use client";

import LandingHeroCarousel from "./LandingHeroCarousel";
import LandingNewsBlock from "./LandingNewsBlock";
import TrendingTopicsCard from "@/components/features/dashboard/TrendingTopicsCard";
import MostReadTodayCard from "@/components/features/dashboard/MostReadTodayCard";
import CategoriesSidebarCard from "./CategoriesSidebarCard";
import LatestPostsSection from "./LatestPostsSection";
import AdSpace from "@/components/shared/AdSpace";
import { use } from "react";
import { ArticleResource, FeedResponse } from "@/lib/api-v2";

type DashboardFeedProps = {
    country: string;
    category: string;
    feed: Promise<FeedResponse>;
};

export default function DashboardFeed({ country, category, feed }: DashboardFeedProps) {
    const feedData = use(feed);

    // Dummy data fallback for Blogs/Newsletters
    const dummyArticles: ArticleResource[] = Array.from({ length: 20 }).map((_, i) => ({
        id: `dummy-${i}`,
        title: i % 2 === 0 ? `Featured Blog Post ${i + 1}: Modern Real Estate Trends` : `Global Newsletter Update: Market Analysis Q1 2026`,
        summary: "Discover the latest trends in the real estate market with our comprehensive guide to modern living and investment strategies.",
        content: "Full content would go here...",
        image: `https://placehold.co/800x450?text=News+Image+${i + 1}`,
        category: i % 2 === 0 ? "Real Estate" : "Market Insight",
        country: "Global",
        status: "published",
        views_count: 120 + i * 5,
        topics: ["Real Estate", "Trends"],
        keywords: "real estate, trends",
        source: "HomesTV",
        original_url: "#",
        created_at: "2026-01-28T07:00:00.000Z",
        published_sites: ""
    }));

    // Safely extract with fallbacks for empty responses
    const latest_global = feedData?.latest_global?.length ? feedData.latest_global : dummyArticles;
    const trending = feedData?.trending || [];
    const most_read = feedData?.most_read || [];

    // Filter dummy data for slides
    const realEstateArticles = dummyArticles.filter(a => a.category === "Real Estate").slice(0, 4);
    const marketInsightArticles = dummyArticles.filter(a => a.category === "Market Insight").slice(0, 4);

    const slides = [
        {
            id: 'news',
            label: 'Top Stories',
            articles: latest_global.slice(0, 4)
        },
        {
            id: 'real-estate',
            label: 'Real Estate',
            articles: realEstateArticles
        },
        {
            id: 'market',
            label: 'Market Insight',
            articles: marketInsightArticles
        }
    ];

    return (
        <div className="w-full max-w-[1280px] mx-auto px-4 py-8">
            {/* Top Hero Carousel - Full Width in Container */}
            {latest_global.length > 0 && (
                <LandingHeroCarousel slides={slides} />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Main Content Column (Left/Center) */}
                <div className="lg:col-span-8">
                    {latest_global.length > 0 ? (
                        <div className="space-y-12">
                            {/* News Blocks - Sequence matching reference exactly */}
                            <LandingNewsBlock
                                title="Top Stories"
                                articles={latest_global.slice(4, 10)}
                                variant={1}
                            />

                            <LandingNewsBlock
                                title="Featured Stories"
                                articles={latest_global.slice(10, 15)}
                                variant={2}
                            />

                            <LandingNewsBlock
                                title="Insights & Analysis"
                                articles={latest_global.slice(15, 19)}
                                variant={3}
                            />

                            <LandingNewsBlock
                                title="Latest Blogs"
                                articles={dummyArticles.filter(a => a.category === "Real Estate").slice(0, 6)}
                                variant={1}
                            />

                            <LandingNewsBlock
                                title="Community Newsletter"
                                articles={dummyArticles.filter(a => a.category === "Market Insight").slice(0, 5)}
                                variant={2}
                            />

                            <LandingNewsBlock
                                title="More Updates"
                                articles={latest_global.slice(5, 10)}
                                variant={2}
                            />

                            <LatestPostsSection articles={latest_global.slice(0, 6)} />
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">
                            <p className="font-semibold text-lg text-gray-900 mb-1">
                                No articles found
                            </p>
                            <p>
                                Try adjusting your search or filters to find what you're looking
                                for.
                            </p>
                        </div>
                    )}
                </div>

                {/* Sidebar Column (Right) */}
                <aside className="lg:col-span-4 space-y-10">
                    <AdSpace
                        className="h-28"
                        width="300x600"
                        height="Leader board Ad"
                    />

                    <MostReadTodayCard
                        items={most_read.slice(0, 5).map((article) => ({
                            id: article.id || '',
                            title: article.title,
                            imageUrl: article.image,
                            views: article.views_count,
                            timeAgo: article.created_at ? new Date(article.created_at).toLocaleDateString() : 'Recently',
                        }))}
                    />

                    <TrendingTopicsCard
                        items={trending.slice(0, 5).map((article) => ({
                            id: article.id || '',
                            label:
                                article.topics && Array.isArray(article.topics) && article.topics.length > 0
                                    ? String(article.topics[0])
                                    : article.title,
                        }))}
                    />

                    <CategoriesSidebarCard />

                    {/* Newsletter Section */}
                    <section className="bg-gray-50 p-6 border border-gray-100">
                        <h3 className="text-[14px] font-black uppercase tracking-widest mb-4">Newsletter</h3>
                        <p className="text-[10px] font-medium text-gray-500 mb-4 leading-relaxed">
                            Subscribe to our daily news update and stay informed.
                        </p>
                        <div className="flex flex-col space-y-3">
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="w-full px-4 py-3 bg-white border border-gray-200 text-[10px] font-bold outline-none focus:border-[#cc0000]"
                            />
                            <button className="w-full bg-[#1a1a1a] text-white py-3 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#cc0000] transition-colors">
                                Subscribe
                            </button>
                        </div>
                    </section>

                </aside>
            </div>
        </div>
    );
}
