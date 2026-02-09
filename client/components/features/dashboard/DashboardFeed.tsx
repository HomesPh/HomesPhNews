"use client";

import LandingHeroCarousel from "./LandingHeroCarousel";
import LandingNewsBlock from "./LandingNewsBlock";
import TrendingTopicsCard from "@/components/features/dashboard/TrendingTopicsCard";
import MostReadTodayCard from "@/components/features/dashboard/MostReadTodayCard";
import CategoriesSidebarCard from "./CategoriesSidebarCard";
import LatestPostsSection from "./LatestPostsSection";
import AdSpace from "@/components/features/admin/ads/AdSpace";
import { use } from "react";
import { ArticleResource, FeedResponse } from "@/lib/api-v2";
import { mockSpecialtyContent } from "@/lib/api-v2/mock/mockArticles";

type DashboardFeedProps = {
    country: string;
    category: string;
    feed: Promise<FeedResponse>;
};

export default function DashboardFeed({ country, category, feed }: DashboardFeedProps) {
    const feedData = use(feed);

    // -------------------------------------------------------------------------
    // DATA LOGIC: Dynamic Feed Assembly
    // -------------------------------------------------------------------------
    const realArticles = feedData?.latest_global || [];

    let mainListingSet: ArticleResource[] = [];

    // Filter mock content by country: Match selected country OR show if 'Global'
    const countryFilteredMock = mockSpecialtyContent.filter(a =>
        country === "Global" || a.country === country || a.country === "Global"
    );

    if (category === "All") {
        const seenIds = new Set(realArticles.map(a => a.id));
        const uniqueMock = countryFilteredMock.filter(a => !seenIds.has(a.id));
        mainListingSet = [...realArticles, ...uniqueMock];
    } else if (category === "Articles") {
        mainListingSet = realArticles;
    } else if (category === "Blogs") {
        mainListingSet = countryFilteredMock.filter(a => a.id.includes('mock-blog') || a.id.includes('dummy-blog') || a.category === "Real Estate");
    } else if (category === "Newsletters") {
        mainListingSet = countryFilteredMock.filter(a => a.id.includes('mock-newsletter') || a.id.includes('dummy-newsletter') || a.category === "Business & Economy");
    } else if (category === "Restaurants") {
        mainListingSet = countryFilteredMock.filter(a => a.category === "Restaurant");
    } else {
        // Category views (e.g. Healthcare, Community)
        mainListingSet = realArticles.filter(a => a.category === category);
        if (mainListingSet.length === 0) {
            mainListingSet = countryFilteredMock.filter(a => a.category === category);
        }
    }

    const latest_global = mainListingSet;

    // -------------------------------------------------------------------------
    // DYNAMIC CATEGORY COUNTS
    // -------------------------------------------------------------------------
    const sidebarCategorySet = category === "Articles" ? realArticles : mainListingSet;
    const dynamicCategoryCounts = sidebarCategorySet.reduce((acc, article) => {
        const cat = article.category;
        if (cat) acc[cat] = (acc[cat] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Helper for category matching since some dummy data has specific IDs
    function articleMatchesCategory(article: ArticleResource, cat: string) {
        if (cat === "Blogs") return article.id.includes('mock-blog') || article.category === "Real Estate";
        if (cat === "Newsletters") return article.id.includes('mock-newsletter') || article.category === "Market Insight";
        return article.category === cat;
    }



    // Dummy Data for Sidebar
    const dummyMostRead = [
        mockSpecialtyContent.find(a => a.id === 'mock-blog-1') || mockSpecialtyContent[0],
        mockSpecialtyContent.find(a => a.id === 'mock-newsletter-1') || mockSpecialtyContent[1],
        mockSpecialtyContent.find(a => a.id === 'mock-rest-1') || mockSpecialtyContent[2]
    ].filter(Boolean);

    const dummyTrending = [
        { id: 't1', title: 'Real Estate Investment', topics: ['Investment'] },
        { id: 't2', title: 'Urban Planning', topics: ['Urban Planning'] },
        { id: 't3', title: 'Filipino Cuisine', topics: ['Food'] },
        { id: 't4', title: 'Sustainable Living', topics: ['Sustainability'] },
        { id: 't5', title: 'PropTech', topics: ['Technology'] }
    ];

    // Strictly real for sidebars - no fallbacks to dummy data during assessment
    const trending = feedData?.trending?.length ? feedData.trending : [];
    const most_read = feedData?.most_read?.length ? feedData.most_read : [];

    // Filter for carousel tabs - prioritize REAL data if available
    // Filter for carousel tabs - STRICTLY REAL
    let realEstateCarousel = realArticles.filter(a => a.category === "Real Estate").slice(0, 4);
    let marketInsightCarousel = realArticles.filter(a => a.category === "Market Insight").slice(0, 4);

    /* 
    // ORIGINAL FALLBACK (Commented out)
    if (realEstateCarousel.length === 0 && category === "All") {
        realEstateCarousel = mockSpecialtyContent.filter(a => a.category === "Real Estate").slice(0, 4);
    }
    if (marketInsightCarousel.length === 0 && category === "All") {
        marketInsightCarousel = mockSpecialtyContent.filter(a => a.category === "Market Insight").slice(0, 4);
    }
    */

    const slides = [];

    // 1. Headline News (Global latest)
    const headlineArticles = latest_global.slice(0, 4);
    if (headlineArticles.length > 0) {
        slides.push({
            id: 'news',
            label: 'Headline News',
            articles: headlineArticles
        });
    }

    if (category === "All") {
        const propPulse = realArticles.filter(a => a.category === "Real Estate").slice(0, 4);
        const growthMarkets = realArticles.filter(a => a.category === "Business & Economy").slice(0, 4);

        if (propPulse.length > 0) {
            slides.push({
                id: 'real-estate',
                label: 'Property Pulse',
                articles: propPulse
            });
        }
        if (growthMarkets.length > 0) {
            slides.push({
                id: 'business',
                label: 'Growth & Markets',
                articles: growthMarkets
            });
        }
    } else if (category === "Articles") {
        // ARTICLES VIEW: Only add tabs if REAL articles exist
        const propPulse = realArticles.filter(a => a.category === "Real Estate").slice(0, 4);
        const growthMarkets = realArticles.filter(a => a.category === "Business & Economy").slice(0, 4);

        if (propPulse.length > 0) {
            slides.push({ id: 'real-estate', label: 'Property Pulse', articles: propPulse });
        }
        if (growthMarkets.length > 0) {
            slides.push({ id: 'business', label: 'Growth & Markets', articles: growthMarkets });
        }
    }

    return (
        <div className="w-full max-w-[1280px] mx-auto px-4 py-8">
            {/* Top Hero Carousel - Filtered for empty slides */}
            {slides.length > 0 && (
                <LandingHeroCarousel slides={slides} />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Main Content Column (Left/Center) */}
                <div className="lg:col-span-8">
                    {latest_global.length > 0 ? (
                        <div className="space-y-12">
                            {/* CATEGORY SPECIFIC BLOCKS ON HOME PAGE */}
                            {category === "All" && (
                                <>
                                    {mainListingSet.filter(a => a.category === "Community").length > 0 && (
                                        <LandingNewsBlock
                                            title="Community Spotlight"
                                            articles={mainListingSet.filter(a => a.category === "Community").slice(0, 6)}
                                            variant={1}
                                        />
                                    )}

                                    {mainListingSet.filter(a => a.category === "Labor & Employment").length > 0 && (
                                        <LandingNewsBlock
                                            title="Workforce Watch"
                                            articles={mainListingSet.filter(a => a.category === "Labor & Employment").slice(0, 5)}
                                            variant={2}
                                        />
                                    )}

                                    {mainListingSet.filter(a => a.category === "Healthcare").length > 0 && (
                                        <LandingNewsBlock
                                            title="Health & Wellness"
                                            articles={mainListingSet.filter(a => a.category === "Healthcare").slice(0, 4)}
                                            variant={3}
                                        />
                                    )}

                                    {mainListingSet.filter(a => a.category === "Restaurant").length > 0 && (
                                        <LandingNewsBlock
                                            title="Culinary Corner"
                                            articles={mainListingSet.filter(a => a.category === "Restaurant").slice(0, 6)}
                                            variant={1}
                                        />
                                    )}

                                    {mainListingSet.filter(a => a.category === "Success Stories").length > 0 && (
                                        <LandingNewsBlock
                                            title="OFW Success Stories"
                                            articles={mainListingSet.filter(a => a.category === "Success Stories").slice(0, 6)}
                                            variant={1}
                                        />
                                    )}
                                </>
                            )}

                            {/* CATEGORY SPECIFIC BLOCKS ON CATEGORY PAGES */}
                            {category !== "All" && category !== "Articles" && (
                                <LandingNewsBlock
                                    title={`${category} Highlights`}
                                    articles={latest_global.slice(4, 10)}
                                    variant={1}
                                />
                            )}

                            {/* ARTICLES PAGE (GENERAL LIST) BLOCKS */}
                            {category === "Articles" && (
                                <LandingNewsBlock
                                    title="Headline Roundup"
                                    articles={latest_global.slice(4, 10)}
                                    variant={1}
                                />
                            )}

                            {/* GLOBAL FEED / MORE STORIES AREA */}
                            <LatestPostsSection
                                title="Complete Archive"
                                articles={latest_global.slice(category === "All" ? 4 : 10)}
                                viewAllHref={`/search?country=${country.toLowerCase() === 'global' ? 'all' : country.toLowerCase()}&category=${category.toLowerCase() === 'all' ? 'all' : category.toLowerCase()}`}
                            />
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
                        rotateInterval={10000}
                    />

                    <MostReadTodayCard
                        items={most_read.slice(0, 5).map((article) => ({
                            id: article.id || '',
                            slug: article.slug,
                            title: article.title,
                            imageUrl: article.image_url || article.image || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7', // Fallback image
                            views: article.views_count || 0,
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

                    <CategoriesSidebarCard
                        counts={dynamicCategoryCounts}
                    />




                </aside>
            </div>
        </div>
    );
}
