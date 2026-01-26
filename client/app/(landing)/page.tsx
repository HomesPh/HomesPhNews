import HeroSection from "@/components/features/dashboard/HeroSection";
import ArticleCard from "@/components/features/dashboard/ArticleCard";
import { ArticlesFeedResponse, getArticlesList } from "@/lib/api";
import TrendingTopicsCard from "@/components/features/dashboard/TrendingTopicsCard";
import MostReadTodayCard from "@/components/features/dashboard/MostReadTodayCard";
import AdSpace from "@/components/shared/AdSpace";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Dashboard({ searchParams }: Props) {
  const { country: countryParam, category: categoryParam } = await searchParams;

  const country = (Array.isArray(countryParam) ? countryParam[0] : countryParam) || "Global";
  const category = (Array.isArray(categoryParam) ? categoryParam[0] : categoryParam) || "All";

  const response = await getArticlesList({
    mode: "feed",
    country: country !== "Global" ? country : undefined,
    category: category !== "All" ? category : undefined,
  }) as ArticlesFeedResponse;

  // Safely extract with fallbacks for empty responses
  const latest_global = response?.latest_global || [];
  const trending = response?.trending || [];
  const most_read = response?.most_read || [];

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 md:px-[110px] py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {latest_global.length > 0 && (
            <HeroSection
              id={latest_global[0].id}
              title={latest_global[0].title}
              description={latest_global[0].content}
              category={latest_global[0].category}
              country={latest_global[0].country}
              imageUrl={latest_global[0].image_url}
              imageAlt="latest global"
              timeAgo={new Date(latest_global[0].timestamp).toLocaleDateString()}
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
                <p className="font-semibold text-lg text-gray-900 mb-1">No articles found</p>
                <p>Try adjusting your search or filters to find what you're looking for.</p>
              </div>
            )}

            <div className="space-y-6">
              {latest_global.slice(1).map((article) => (
                <ArticleCard
                  key={article.id}
                  id={article.id}
                  category={article.category}
                  location={article.country}
                  title={article.title}
                  description={article.content}
                  timeAgo={new Date(article.timestamp).toLocaleDateString()}
                  imageSrc={article.image_url}
                  views={article.views_count?.toLocaleString() + " views"}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <AdSpace className="h-[112px]" width="300x600" height="Leader board Ad" />

          <TrendingTopicsCard
            items={trending.slice(0, 5).map((article) => ({
              id: article.id,
              label: (article.topics && article.topics.length > 0) ? article.topics[0] : article.title,
            }))}
          />

          <MostReadTodayCard
            items={most_read.slice(0, 5).map((article) => ({
              id: article.id,
              title: article.title,
              imageUrl: article.image_url,
              views: article.views_count,
              timeAgo: new Date(article.timestamp).toLocaleDateString()
            }))}
          />

          <AdSpace width="300x600" height="Leader board Ad" />
        </div>
      </div>
    </div>
  );
}
