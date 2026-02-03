import { getArticlesFeed } from "@/lib/api-v2/public/services/article/getArticlesFeed";
import LandingNewsBlock from "@/components/features/dashboard/LandingNewsBlock";
import MostReadTodayCard from "@/components/features/dashboard/MostReadTodayCard";
import TrendingTopicsCard from "@/components/features/dashboard/TrendingTopicsCard";
import LatestPostsSection from "@/components/features/dashboard/LatestPostsSection";
import LandingHeroCarousel from "@/components/features/dashboard/LandingHeroCarousel";
import AdSpace from "@/lib/ads/components/AdSpace";
import Link from 'next/link';
import type { ArticleResource } from "@/lib/api-v2/types/ArticleResource";

export const dynamic = 'force-dynamic';

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function RestaurantPage({ searchParams }: Props) {
    const params = await searchParams;
    const topic = (params.topic as string) || undefined;

    const feedData = await getArticlesFeed({
        category: "Restaurant",
        topic: topic,
        limit: 30, // Increased limit to feed carousel + blocks
    });

    let articles = feedData.latest_global || [];
    const trending = feedData.trending || [];
    const mostRead = feedData.most_read || [];

    // --- DUMMY DATA FOR VISUAL VERIFICATION ---
    if (articles.length === 0) {
        const { mockSpecialtyContent } = require('@/lib/api-v2/mock/mockArticles');
        articles = mockSpecialtyContent.filter((a: ArticleResource) => a.category === "Restaurant");
    }
    // -------------------------------------------

    // Prepare Slides for the Featured Hero Carousel
    // We simulate different "Tabs" of content
    const heroSlides = [
        {
            id: 'featured',
            label: 'Featured',
            articles: articles.slice(0, 4)
        },
        {
            id: 'reviews',
            label: 'Reviews',
            articles: articles.slice(4, 8)
        },
        {
            id: 'dining',
            label: 'Fine Dining',
            articles: articles.slice(8, 12)
        }
    ];

    // Data Slicing for Rest of Page
    // We offset the offsets used in carousel to avoid duplication if real data, 
    // but for visual fullness often overlap is fine or we slice further down.
    const topStories = articles.slice(12, 18);
    const communityNewsletter = articles.slice(18, 23);
    const moreUpdates = articles.slice(23, 27);
    const latestPosts = articles.slice(27, 35); // Just remixing for the bottom list

    const restaurantCategories = [
        { label: "Fine Dining", count: 4 },
        { label: "Casual Dining", count: 8 },
        { label: "Fast Food", count: 12 },
        { label: "Industry News", count: 5 },
        { label: "Chef Interviews", count: 3 },
        { label: "Reviews", count: 15 },
    ];

    return (
        <div className="w-full max-w-[1280px] mx-auto px-4 py-8">
            <header className="mb-0 border-b border-gray-200 dark:border-slate-800 pb-4">
                <h1 className="text-3xl font-bold text-[#111827] dark:text-white">Restaurant News</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Latest updates, reviews, and trends from the culinary world.</p>
            </header>

            {/* Featured Hero Carousel Tab Section */}
            <div className="mt-8">
                <LandingHeroCarousel slides={heroSlides} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-12">
                {/* Main Content Column (Left/Center) */}
                <div className="lg:col-span-8 space-y-12">

                    {articles.length > 0 ? (
                        <>
                            {/* 1. LATEST BLOGS (Grid Style - Variant 1) */}
                            <LandingNewsBlock
                                title="Latest Blogs"
                                articles={topStories}
                                variant={1}
                            />

                            {/* 2. COMMUNITY NEWSLETTER (Split Style - Variant 2) */}
                            <LandingNewsBlock
                                title="Community Newsletter"
                                articles={communityNewsletter}
                                variant={2}
                            />

                            {/* 3. Top Stories / More Updates */}
                            <LandingNewsBlock
                                title="Top Stories"
                                articles={moreUpdates}
                                variant={1}
                            />

                            {/* Latest Posts List (Standard List) */}
                            <LatestPostsSection
                                articles={latestPosts}
                                viewAllHref="/search?category=Restaurant"
                            />
                        </>
                    ) : (
                        <div className="bg-white dark:bg-[#1a1d2e] rounded-xl border border-gray-200 dark:border-[#2a2d3e] p-12 text-center text-gray-500 dark:text-gray-400">
                            <p className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
                                No restaurant articles found
                            </p>
                        </div>
                    )}
                </div>

                {/* Sidebar Column (Right) */}
                <aside className="lg:col-span-4 space-y-10">
                    <AdSpace
                        className="h-[112px]"
                        width="300x600"
                        height="Leader board Ad"
                    />

                    <MostReadTodayCard
                        items={mostRead.slice(0, 5).map((article) => ({
                            id: article.id || '',
                            title: article.title,
                            imageUrl: article.image || article.image_url || '',
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

                    {/* Custom Restaurant Categories Sidebar */}
                    <section>
                        <div className="bg-[#cc0000] px-4 py-1 mb-6">
                            <h3 className="text-white text-xs font-black uppercase tracking-widest">Restaurant Categories</h3>
                        </div>
                        <div className="flex flex-col divide-y divide-gray-100 dark:divide-slate-800">
                            {restaurantCategories.map((cat, idx) => (
                                <Link
                                    key={idx}
                                    href={`/restaurants?topic=${encodeURIComponent(cat.label)}`}
                                    className="flex items-center justify-between py-3 text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 hover:text-[#cc0000] dark:hover:text-[#cc0000] transition-colors text-left"
                                >
                                    <span>{cat.label}</span>
                                    <span className="text-gray-300 dark:text-gray-600">({cat.count})</span>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* Newsletter Section */}
                    <section className="bg-gray-50 dark:bg-slate-900 p-6 border border-gray-100 dark:border-slate-800">
                        <h3 className="text-[14px] font-black uppercase tracking-widest mb-4 dark:text-white">Newsletter</h3>
                        <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
                            Subscribe to our restaurant industry updates.
                        </p>
                        <div className="flex flex-col space-y-3">
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-[10px] font-bold outline-none focus:border-[#cc0000] dark:text-white dark:placeholder:text-gray-600"
                            />
                            <button className="w-full bg-[#1a1a1a] dark:bg-slate-800 text-white py-3 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#cc0000] transition-colors">
                                Subscribe
                            </button>
                        </div>
                    </section>
                </aside>
            </div>
        </div>
    );
}
