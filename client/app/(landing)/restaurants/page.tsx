import { getRestaurants } from "@/lib/api-v2/public/services/restaurant/getRestaurants";
import type { Restaurant } from "@/lib/api-v2/types/RestaurantResource";
import LandingNewsBlock from "@/components/features/dashboard/LandingNewsBlock";
import MostReadTodayCard from "@/components/features/dashboard/MostReadTodayCard";
import TrendingTopicsCard from "@/components/features/dashboard/TrendingTopicsCard";
import LatestPostsSection from "@/components/features/dashboard/LatestPostsSection";
import LandingHeroCarousel from "@/components/features/dashboard/LandingHeroCarousel";
import AdSpace from "@/components/features/admin/ads/AdSpace";
import Link from 'next/link';
import type { ArticleResource } from "@/lib/api-v2/types/ArticleResource";
import { calculateReadTime } from "@/lib/utils";

export const dynamic = 'force-dynamic';

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function RestaurantPage({ searchParams }: Props) {
    const params = await searchParams;
    const topic = (params.topic as string) || undefined;

    let articles: ArticleResource[] = [];

    try {
        const restaurantData = await getRestaurants({
            limit: 50,
            page: 1,
            topic: topic
        });

        if (restaurantData && restaurantData.data) {
            articles = restaurantData.data.map((r: Restaurant) => ({
                id: r.id,
                article_id: r.id,
                slug: r.id,
                title: r.name,
                summary: r.description || '',
                content: r.description || '',
                category: "Restaurant",
                country: r.country,
                status: r.status || 'published',
                created_at: r.timestamp ? new Date(r.timestamp * 1000).toISOString() : new Date().toISOString(),
                views_count: r.rating ? Math.floor(r.rating * 1000) : 0,
                image_url: r.image_url || '',
                image: r.image_url || '',
                location: r.city,
                topics: [r.cuisine_type].filter(Boolean),
                source: "HomesPh Restaurant",
                original_url: r.original_url || '',
                is_deleted: false,
                is_redis: false,
                published_sites: [],
                sites: [],
                galleryImages: [],
                keywords: r.cuisine_type || '',
            }));
        }
    } catch (error) {
        console.error("Failed to fetch restaurants:", error);
    }

    // Process data for sections
    const trending = [...articles].sort((a, b) => b.views_count - a.views_count).slice(0, 5);
    const mostRead = [...articles].sort((a, b) => b.views_count - a.views_count).slice(0, 10);

    const heroSlides = [
        { id: 'featured', label: 'Featured', articles: articles.slice(0, 4) },
        { id: 'reviews', label: 'Reviews', articles: articles.slice(4, 8) },
        { id: 'dining', label: 'Fine Dining', articles: articles.slice(8, 12) }
    ].filter(slide => slide.articles.length > 0);

    const topStories = articles.slice(0, 6);
    const communityNewsletter = articles.slice(6, 11);
    const moreUpdates = articles.slice(11, 15);
    const latestPosts = articles.slice(15, 23);

    const restaurantCategories = [
        { label: "Fine Dining", count: articles.filter(a => a.topics.includes("Fine Dining")).length || 0 },
        { label: "Casual Dining", count: articles.filter(a => a.topics.includes("Casual Dining")).length || 0 },
        { label: "Fast Food", count: articles.filter(a => a.topics.includes("Fast Food")).length || 0 },
        { label: "Reviews", count: articles.length },
    ];

    return (
        <div className="w-full max-w-[1280px] mx-auto px-4 py-8">
            <header className="mb-0 border-b border-gray-200 dark:border-slate-800 pb-4">
                <h1 className="text-3xl font-bold text-[#111827] dark:text-white">Restaurant News</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Latest updates, reviews, and trends from the culinary world.</p>
            </header>

            {heroSlides.length > 0 && (
                <div className="mt-8">
                    <LandingHeroCarousel slides={heroSlides} />
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-12 mt-12">
                <div className="flex-1 min-w-0 space-y-12">
                    {articles.length > 0 ? (
                        <>
                            <LandingNewsBlock title="Latest Discoveries" articles={topStories} variant={1} />
                            <LandingNewsBlock title="Featured Reviews" articles={communityNewsletter} variant={2} />
                            <LandingNewsBlock title="Top Stories" articles={moreUpdates} variant={1} />
                            <LatestPostsSection title="Complete Archive" articles={latestPosts} viewAllHref="/search?category=Restaurant" />
                        </>
                    ) : (
                        <div className="bg-white dark:bg-[#1a1d2e] rounded-xl border border-gray-200 dark:border-[#2a2d3e] p-12 text-center text-gray-500 dark:text-gray-400">
                            <p className="font-semibold text-lg text-gray-900 dark:text-white mb-1">No restaurants found</p>
                            <p>Try checking back later or refine your search.</p>
                        </div>
                    )}
                </div>

                <aside className="w-full lg:w-[350px] flex-shrink-0 space-y-10">
                    <AdSpace width={336} height={280} rotateInterval={10000} />

                    {mostRead.length > 0 && (
                        <MostReadTodayCard
                            items={mostRead.slice(0, 5).map((article) => ({
                                id: article.id,
                                title: article.title,
                                imageUrl: article.image_url,
                                views: article.views_count,
                                timeAgo: article.created_at ? new Date(article.created_at).toLocaleDateString() : 'Recently',
                            }))}
                        />
                    )}

                    {trending.length > 0 && (
                        <TrendingTopicsCard
                            items={trending.slice(0, 5).map((article) => ({
                                id: article.id,
                                label: article.topics[0] || article.title,
                            }))}
                        />
                    )}

                    <section>
                        <div className="bg-[#cc0000] px-4 py-1 mb-6">
                            <h3 className="text-white text-xs font-black uppercase tracking-widest">Restaurant Categories</h3>
                        </div>
                        <div className="flex flex-col divide-y divide-gray-100 dark:divide-slate-800">
                            {restaurantCategories.map((cat, idx) => (
                                <Link
                                    key={idx}
                                    href={`/restaurants?topic=${encodeURIComponent(cat.label)}`}
                                    className="flex items-center justify-between py-3 text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 hover:text-[#cc0000] transition-colors text-left"
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
