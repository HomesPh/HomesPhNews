import { getArticlesFeed } from "@/lib/api-v2/public/services/article/getArticlesFeed";
import LandingNewsBlock from "@/components/features/dashboard/LandingNewsBlock";
import MostReadTodayCard from "@/components/features/dashboard/MostReadTodayCard";
import TrendingTopicsCard from "@/components/features/dashboard/TrendingTopicsCard";
import LatestPostsSection from "@/components/features/dashboard/LatestPostsSection";
import LandingHeroCarousel from "@/components/features/dashboard/LandingHeroCarousel";
import AdSpace from "@/components/features/admin/ads/AdSpace";
import Link from 'next/link';
import type { ArticleResource } from "@/lib/api-v2/types/ArticleResource";

export const dynamic = 'force-dynamic';

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function RestaurantPage({ searchParams }: Props) {
    const params = await searchParams;
    const topic = (params.topic as string) || undefined;

    let feedData: any = { trending: [], latest_global: [], most_read: [] };
    try {
        feedData = await getArticlesFeed({
            category: "Restaurant",
            topic: topic,
            limit: 30,
        });
    } catch (error) {
        console.error("Failed to fetch restaurant feed:", error);
    }

    let articles = feedData.latest_global || [];
    const trending = feedData.trending || [];
    const mostRead = feedData.most_read || [];

    // --- DUMMY DATA FOR VISUAL VERIFICATION ---
    // Always ensure we have enough articles for the layout
    if (articles.length < 35) {
        const { mockSpecialtyContent } = require('@/lib/api-v2/mock/mockArticles');
        const mockRestaurants = mockSpecialtyContent.filter((a: ArticleResource) => a.category === "Restaurant");

        // Filter out any duplicates if real data exists
        const seenIds = new Set(articles.map(a => a.id));
        const uniqueMock = mockRestaurants.filter((a: ArticleResource) => !seenIds.has(a.id));

        articles = [...articles, ...uniqueMock];

        // If we still don't have enough, generate some filler
        if (articles.length < 35) {
            const fillerCount = 35 - articles.length;
            const filler = Array.from({ length: fillerCount }).map((_, i) => ({
                id: `dummy-fill-${i}`,
                article_id: `dummy-fill-${i}`,
                slug: `dummy-fill-${i}`,
                title: `Culinary Discovery ${i + 7}: Exploring Regional Filipino Flavors`,
                summary: "A deep dive into the diverse regional cuisines of the Philippines, from the spicy Bicol Express to the savory Iloilo Batchoy.",
                image: [
                    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1544124499-1804ba2e447b?auto=format&fit=crop&q=80'
                ][i % 5],
                category: "Restaurant",
                country: "Philippines",
                views_count: 120 + (i * 15),
                created_at: new Date(Date.now() - i * 86400000).toISOString(),
                topics: ["Food", "Culture"],
                status: "published"
            }));
            articles = [...articles, ...filler];
        }
    }
    // -------------------------------------------

    // Prepare Slides for the Featured Hero Carousel
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
    const topStories = articles.slice(12, 18);
    const communityNewsletter = articles.slice(18, 23);
    const moreUpdates = articles.slice(23, 27);
    const latestPosts = articles.slice(27, 35);

    const restaurantCategories = [
        { label: "Fine Dining", count: 4 },
        { label: "Casual Dining", count: 8 },
        { label: "Fast Food", count: 12 },
        { label: "Industry News", count: 5 },
        { label: "Chef Interviews", count: 3 },
        { label: "Reviews", count: 18 },
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

            <div className="flex flex-col lg:flex-row gap-12 mt-12">
                {/* Main Content Column (Left/Center) */}
                <div className="flex-1 min-w-0 space-y-12">

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
                                title="Complete Archive"
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
                <aside className="w-full lg:w-[350px] flex-shrink-0 space-y-10">
                    <AdSpace
                        width={336}
                        height={280}
                        rotateInterval={10000}
                    />
                    <MostReadTodayCard
                        items={mostRead.slice(0, 5).map((article: ArticleResource) => ({
                            id: article.id || '',
                            title: article.title,
                            imageUrl: article.image || article.image_url || '',
                            views: article.views_count,
                            timeAgo: article.created_at ? new Date(article.created_at).toLocaleDateString() : 'Recently',
                        }))}
                    />

                    <TrendingTopicsCard
                        items={trending.slice(0, 5).map((article: ArticleResource) => ({
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



                </aside>
            </div>
        </div>
    );
}
