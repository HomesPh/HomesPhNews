"use client";

import HeroSection from "@/components/features/dashboard/HeroSection";
import ArticleCard from "@/components/features/dashboard/ArticleCard";
import { ArticleFeedResponse } from "@/lib/api-new/types";
import TrendingTopicsCard from "@/components/features/dashboard/TrendingTopicsCard";
import MostReadTodayCard from "@/components/features/dashboard/MostReadTodayCard";
import AdSpace from "@/components/shared/AdSpace";
import { use } from "react";

type DashboardFeedProps = {
  country: string;
  category: string;
  feed: Promise<ArticleFeedResponse>;
};

export default function DashboardFeed({ country, category, feed }: DashboardFeedProps) {
  const feedData = use(feed);

  // Safely extract with fallbacks for empty responses
  const latest_global = feedData?.latest_global || [];
  const trending = feedData?.trending || [];
  const most_read = feedData?.most_read || [];

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 md:px-[110px] py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {latest_global.length > 0 && (
            <HeroSection
              id={latest_global[0].id || undefined}
              title={latest_global[0].title}
              description={latest_global[0].content}
              category={latest_global[0].category}
              country={latest_global[0].country}
              imageUrl={latest_global[0].image}
              imageAlt="latest global"
              timeAgo={latest_global[0].created_at ? new Date(latest_global[0].created_at).toLocaleDateString() : 'Recently'}
              keywords={latest_global[0].keywords}
              views={latest_global[0].views_count}
              isFeatured={true}
            />
          )}

          <AdSpace width="300x600" height="Leader board Ad" />

          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-[#111827] tracking-tight">
              Latest {country === "Global" ? "Global" : country} News
            </h1>

            {!latest_global.length && (
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

            <div className="space-y-6">
              {latest_global.slice(1).map((article) => (
                <ArticleCard
                  key={article.id}
                  id={article.id || ''}
                  category={article.category}
                  location={article.country}
                  title={article.title}
                  description={article.content}
                  timeAgo={article.created_at ? new Date(article.created_at).toLocaleDateString() : 'Recently'}
                  imageSrc={article.image}
                  views={article.views_count?.toLocaleString() + " views"}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <AdSpace
            className="h-[112px]"
            width="300x600"
            height="Leader board Ad"
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

          <MostReadTodayCard
            items={most_read.slice(0, 5).map((article) => ({
              id: article.id || '',
              title: article.title,
              imageUrl: article.image,
              views: article.views_count,
              timeAgo: article.created_at ? new Date(article.created_at).toLocaleDateString() : 'Recently',
            }))}
          />

          <AdSpace width="300x600" height="Leader board Ad" />
        </div>
      </div>
    </div>
  );
}
