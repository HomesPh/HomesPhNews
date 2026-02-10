import { getRestaurants } from "@/lib/api-v2/public/services/restaurant/getRestaurants";
import LandingNewsBlock from "@/components/features/dashboard/LandingNewsBlock";
import MostReadTodayCard from "@/components/features/dashboard/MostReadTodayCard";
import TrendingTopicsCard from "@/components/features/dashboard/TrendingTopicsCard";
import LatestPostsSection from "@/components/features/dashboard/LatestPostsSection";
import LandingHeroCarousel from "@/components/features/dashboard/LandingHeroCarousel";
import AdSpace from "@/components/features/admin/ads/AdSpace";
import Link from 'next/link';
import type { ArticleResource } from "@/lib/api-v2/types/ArticleResource";
import type { Restaurant } from "@/lib/api-v2/types/RestaurantResource";

export const dynamic = 'force-dynamic';

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// Helper to safely parse JSON fields that might be strings or arrays
const parseJsonField = (field: any): any[] => {
    if (Array.isArray(field)) return field;
    if (typeof field === 'string') {
        try {
            const parsed = JSON.parse(field);
            if (Array.isArray(parsed)) return parsed;
        } catch (e) {
            return field ? [field] : [];
        }
    }
    return [];
};

// Helper to map Restaurant to ArticleResource for UI components
const mapRestaurantToArticle = (restaurant: Restaurant): ArticleResource => {
    const images = parseJsonField(restaurant.image_url);
    const cuisines = parseJsonField(restaurant.cuisine_type);

    return {
        id: restaurant.id,
        title: restaurant.name,
        slug: undefined, // undefined to fall back to ID routing
        summary: restaurant.description,
        content: restaurant.description,
        image: images[0] || '',
        image_url: images[0] || '',
        category: cuisines[0] || "Restaurant",
        country: restaurant.country,
        // Convert timestamp (seconds) to ISO string
        created_at: restaurant.timestamp ? new Date(restaurant.timestamp * 1000).toISOString() : new Date().toISOString(),
        source: restaurant.city || "HomesPh",
        views_count: Math.floor(restaurant.rating * 100) || 0, // Mock views from rating
        topics: cuisines,
        status: 'published',
        keywords: '',
        original_url: '',
        published_sites: []
    };
};

export default async function RestaurantPage({ searchParams }: Props) {
    const params = await searchParams;
    const topic = Array.isArray(params.topic) ? params.topic[0] : params.topic;
    const country = Array.isArray(params.country) ? params.country[0] : params.country;
    const search = Array.isArray(params.search) ? params.search[0] : params.search;
    const page = Number(params.page) || 1;

    const response = await getRestaurants({
        limit: 30,
        page: page,
        topic: topic,
        country: country,
        search: search,
    });

    const restaurants: Restaurant[] = response.data.data;
    const mappedRestaurants = restaurants.map(mapRestaurantToArticle);

    // Prepare Slides for the Featured Hero Carousel
    // We simulate different "Tabs" of content based on indices
    const heroSlides = [
        {
            id: 'featured',
            label: 'Featured',
            articles: mappedRestaurants.slice(0, 4)
        },
        {
            id: 'new',
            label: 'New Arrivals',
            articles: mappedRestaurants.slice(4, 8)
        },
        {
            id: 'popular',
            label: 'Popular',
            articles: mappedRestaurants.slice(8, 12)
        }
    ].filter(slide => slide.articles.length > 0);

    const topStories = mappedRestaurants.slice(0, 6);
    const communityNewsletter = mappedRestaurants.slice(6, 11);
    const moreUpdates = mappedRestaurants.slice(11, 15);
    const latestPosts = mappedRestaurants.slice(15, 25);

    // Simulate trending based on what we have
    const trending = mappedRestaurants.slice(0, 5);
    const mostRead = mappedRestaurants.slice().sort((a, b) => (b.views_count || 0) - (a.views_count || 0)).slice(0, 5);

    const restaurantCategories = [
        { label: "Fine Dining", count: 4 },
        { label: "Casual Dining", count: 8 },
        { label: "Fast Food", count: 12 },
        { label: "Cafe", count: 5 },
        { label: "Buffet", count: 3 },
        { label: "Bar", count: 15 },
    ];

    return (
        <div className="w-full max-w-[1280px] mx-auto px-4 py-8">
            <header className="mb-0 border-b border-gray-200 dark:border-slate-800 pb-4">
                <h1 className="text-3xl font-bold text-[#111827] dark:text-white">Restaurant Discovery</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Explore the best culinary experiences around the world.</p>
            </header>

            {/* Featured Hero Carousel Tab Section */}
            {heroSlides.length > 0 && (
                <div className="mt-8">
                    <LandingHeroCarousel slides={heroSlides} basePath="/restaurants" />
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-12 mt-12">
                {/* Main Content Column (Left/Center) */}
                <div className="flex-1 min-w-0 space-y-12">

                    {mappedRestaurants.length > 0 ? (
                        <>
                            {/* 1. LATEST (Grid Style - Variant 1) */}
                            <LandingNewsBlock
                                title="Latest Additions"
                                articles={topStories}
                                variant={1}
                                basePath="/restaurants"
                            />

                            {/* 2. FEATURED (Split Style - Variant 2) */}
                            {communityNewsletter.length > 0 && (
                                <LandingNewsBlock
                                    title="Editor's Picks"
                                    articles={communityNewsletter}
                                    variant={2}
                                    basePath="/restaurants"
                                />
                            )}

                            {/* 3. MORE (Variant 1) */}
                            {moreUpdates.length > 0 && (
                                <LandingNewsBlock
                                    title="More Places"
                                    articles={moreUpdates}
                                    variant={1}
                                    basePath="/restaurants"
                                />
                            )}

                            {/* Latest Posts List (Standard List) */}
                            {latestPosts.length > 0 && (
                                <LatestPostsSection
                                    articles={latestPosts}
                                    title="All Restaurants"
                                    viewAllHref={undefined} // Pagination not fully implemented in UI yet
                                    basePath="/restaurants"
                                />
                            )}
                        </>
                    ) : (
                        <div className="bg-white dark:bg-[#1a1d2e] rounded-xl border border-gray-200 dark:border-[#2a2d3e] p-12 text-center text-gray-500 dark:text-gray-400">
                            <p className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
                                No restaurants found
                            </p>
                            <p>Try adjusting your filters.</p>
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
                        title="Popular Places"
                        items={mostRead.map((article) => ({
                            id: article.id || '',
                            title: article.title,
                            imageUrl: article.image || article.image_url || '',
                            views: article.views_count,
                            timeAgo: article.created_at ? new Date(article.created_at).toLocaleDateString() : 'Recently',
                        }))}
                        basePath="/restaurants"
                    />

                    <TrendingTopicsCard
                        title="Cuisines"
                        items={trending.map((article) => ({
                            id: article.id || '',
                            label: article.category || "General",
                        }))}
                        basePath="/restaurants"
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
