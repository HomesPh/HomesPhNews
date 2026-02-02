import { getArticlesFeed } from "@/lib/api-v2/public/services/article/getArticlesFeed";
import LandingNewsBlock from "@/components/features/dashboard/LandingNewsBlock";
import MostReadTodayCard from "@/components/features/dashboard/MostReadTodayCard";
import TrendingTopicsCard from "@/components/features/dashboard/TrendingTopicsCard";
import LatestPostsSection from "@/components/features/dashboard/LatestPostsSection";
import LandingHeroCarousel from "@/components/features/dashboard/LandingHeroCarousel";
import AdSpace from "@/components/shared/AdSpace";
import Link from 'next/link';
import type { ArticleResource } from "@/lib/api-v2/types/ArticleResource";

export const dynamic = 'force-dynamic';

export default async function RestaurantPage() {
    const feedData = await getArticlesFeed({
        category: "Restaurant",
        limit: 30, // Increased limit to feed carousel + blocks
    });

    let articles = feedData.latest_global || [];
    const trending = feedData.trending || [];
    const mostRead = feedData.most_read || [];

    // --- DUMMY DATA FOR VISUAL VERIFICATION ---
    if (articles.length === 0) {
        articles = [
            {
                id: 'dummy-rest-1',
                title: 'Global Palate: Filipino Cuisine Takes Center Stage in Major Capitals',
                summary: 'From New York to London, Filipino chefs are redefining fine dining with elevated takes on classic dishes like Adobo and Sinigang.',
                content: `
                    <p>Filipino cuisine is finally having its global moment. For years considered the "next big thing," it has now firmly arrived, with Filipino-owned restaurants opening in major culinary capitals around the world.</p>
                    <h3>The Rise of Pinoy Flavors</h3>
                    <p>Chefs are elevating traditional dishes like adobo, sinigang, and kare-kare, presenting them with modern techniques while staying true to their roots. In cities like Los Angeles/London, long queues are common outside establishments serving sizzling sisig and halo-halo.</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                    <h3>Global Recognition</h3>
                    <p>Critics are taking notice. several Filipino restaurants have recently received Michelin stars or Bib Gourmand mentions, validating the complexity and deliciousness of the cuisine.</p>
                `,
                image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80', // Chef/Food
                category: "Restaurant",
                country: "United Kingdom",
                status: "published",
                views_count: 1250,
                topics: ["Filipino Food", "Global Dining", "Chefs"],
                keywords: "filipino, restaurant, pinoy, food",
                source: "HomesTV",
                original_url: "#",
                created_at: "2026-01-28T09:00:00.000Z",
                published_sites: ""
            },
            {
                id: 'dummy-rest-2',
                title: 'Metro Manila Fine Dining: A Renaissance of Local Ingredients',
                summary: 'A new wave of chefs is championing endemic ingredients, transforming the local dining landscape.',
                content: `
                    <p>Manila is no longer just a stopover; it is a destination for food lovers. The city's fine dining scene has exploded in recent years, driven by a new generation of chefs returning home from stints in top kitchens abroad.</p>
                    <h3>Local Ingredients, World-Class Technique</h3>
                    <p>These restaurants are highlighting local ingredients—from Bukidnon wagyu to Davao chocolate—showcasing the biodiversity of the Philippines.</p>
                `,
                image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80', // Restaurant Interior
                category: "Restaurant",
                country: "Philippines",
                status: "published",
                views_count: 980,
                topics: ["Fine Dining", "Manila", "Luxury"],
                keywords: "manila, dining, luxury",
                source: "HomesTV",
                original_url: "#",
                created_at: "2026-01-27T14:30:00.000Z",
                published_sites: ""
            },
            {
                id: 'dummy-rest-3',
                title: 'Sustainable Sourcing: Island Resorts Lean into Farm-to-Table',
                summary: 'Resorts in Boracay and Palawan are establishing their own organic farms to ensure quality and sustainability.',
                content: `
                    <p>Sustainability is more than a buzzword for restaurants in the Philippines' top island destinations. With the ocean as their backyard, chefs are acutely aware of the need to protect marine resources.</p>
                    <h3>Farm to Table, Ocean to Plate</h3>
                    <p>Many establishments now work directly with local fisherfolk to ensure fair trade and sustainable catch methods. This not only helps the environment but ensures the freshest possible ingredients for diners.</p>
                `,
                image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80', // Fresh Food/Vegetables
                category: "Restaurant",
                country: "Philippines",
                status: "published",
                views_count: 850,
                topics: ["Sustainability", "Seafood", "Island Life"],
                keywords: "sustainable, seafood, boracay, palawan",
                source: "HomesTV",
                original_url: "#",
                created_at: "2026-01-26T11:15:00.000Z",
                published_sites: ""
            },
            {
                id: 'dummy-rest-4',
                title: 'Street Food Elevated: Reimagining Isaw and Balut for the Global Palate',
                summary: 'How humble street food staples are finding their way onto tasting menus.',
                content: `
                    <p>Street food is the heart of Filipino food culture. Now, it's getting a gourmet makeover. From wagyu isaw to foie gras balut, chefs are reimagining humble snacks for upscale palates.</p>
                `,
                image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80', // Plated Food
                category: "Restaurant",
                country: "Philippines",
                status: "published",
                views_count: 1500,
                topics: ["Street Food", "Innovation", "Culture"],
                keywords: "street food, gourmet, manila",
                source: "HomesTV",
                original_url: "#",
                created_at: "2026-01-25T16:45:00.000Z",
                published_sites: ""
            },
            {
                id: 'dummy-rest-5',
                title: 'Jollibee Foods Corp Accelerates European Expansion Strategy',
                summary: 'The fast-food giant considers new markets in Eastern Europe as Chickenjoy conquers the UK and Italy.',
                content: `
                    <p>Jollibee Foods Corporation shows no signs of slowing down. The fast-food giant has announced ambitious plans to expand its footprint in Europe, bringing Chickenjoy to more cities across the continent.</p>
                `,
                image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80', // Cafe/Fast Food vibe
                category: "Restaurant",
                country: "Italy",
                status: "published",
                views_count: 3000,
                topics: ["Fast Food", "Business", "Expansion"],
                keywords: "jollibee, business, food",
                source: "HomesTV",
                original_url: "#",
                created_at: "2024-01-24T08:20:00.000Z",
                published_sites: ""
            },
            {
                id: 'dummy-rest-6',
                title: 'Coffee Culture: The Third Wave Experience in Cebu',
                summary: 'Local roasters in Cebu are putting Philippine coffee beans on the map, offering world-class brews in instagram-mable spaces.',
                content: `
                    <p>Cebu is known for lechon and beaches, but a quiet revolution is brewing—literally. A new wave of independent coffee shops is taking over the city.</p>
                `,
                image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80', // Coffee shop
                category: "Restaurant",
                country: "Philippines",
                status: "published",
                views_count: 2200,
                topics: ["Coffee", "Cafe", "Cebu"],
                keywords: "coffee, cebu, cafe",
                source: "HomesTV",
                original_url: "#",
                created_at: "2026-01-23T15:00:00.000Z",
                published_sites: ""
            }
        ];

        // Fill the rest with generated items to maintain volume for layout
        const moreDummyArticles: ArticleResource[] = Array.from({ length: 25 }).map((_, i) => ({
            id: `dummy-fill-${i}`,
            title: `Culinary Discovery ${i + 6}: Exploring Regional Filipino Flavors`,
            summary: "A deep dive into the diverse regional cuisines of the Philippines...",
            content: `
                <p>The Philippines has over 7,000 islands, and almost as many variations of adobo. Regional cuisine is a treasure trove of flavors waiting to be discovered.</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                <h3>Highlighting Region ${i + 1}</h3>
                <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
            `,
            image: i % 2 === 0
                ? 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80'
                : 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80',
            category: "Restaurant",
            country: "Qatar",
            status: "published",
            views_count: 100 + i * 5,
            topics: ["Food", "Regional"],
            keywords: "food, regional",
            source: "HomesTV",
            original_url: "#",
            created_at: "2026-01-20T07:00:00.000Z",
            published_sites: ""
        }));

        articles = [...articles, ...moreDummyArticles];
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
            <header className="mb-0 border-b border-gray-200 pb-4">
                <h1 className="text-3xl font-bold text-[#111827]">Restaurant News</h1>
                <p className="text-gray-500 mt-2">Latest updates, reviews, and trends from the culinary world.</p>
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
                            <LatestPostsSection articles={latestPosts} />
                        </>
                    ) : (
                        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">
                            <p className="font-semibold text-lg text-gray-900 mb-1">
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
                        <div className="flex flex-col divide-y divide-gray-100">
                            {restaurantCategories.map((cat, idx) => (
                                <Link
                                    key={idx}
                                    href={`/restaurants?topic=${encodeURIComponent(cat.label)}`}
                                    className="flex items-center justify-between py-3 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-[#cc0000] transition-colors text-left"
                                >
                                    <span>{cat.label}</span>
                                    <span className="text-gray-300">({cat.count})</span>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* Newsletter Section */}
                    <section className="bg-gray-50 p-6 border border-gray-100">
                        <h3 className="text-[14px] font-black uppercase tracking-widest mb-4">Newsletter</h3>
                        <p className="text-[10px] font-medium text-gray-500 mb-4 leading-relaxed">
                            Subscribe to our restaurant industry updates.
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
