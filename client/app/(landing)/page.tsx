import HeroSection from "@/components/features/dashboard/HeroSection";
import ArticleCard from "@/components/features/dashboard/ArticleCard";
import { getLandingPageArticles } from "@/lib/api";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import TrendingTopicsCard from "@/components/features/dashboard/TrendingTopicsCard";
import MostReadTodayCard from "@/components/features/dashboard/MostReadTodayCard";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Dashboard({ searchParams }: Props) {
  const { country: countryParam, category: categoryParam } = await searchParams;

  const country = (Array.isArray(countryParam) ? countryParam[0] : countryParam) || "Global";
  const category = (Array.isArray(categoryParam) ? categoryParam[0] : categoryParam) || "All";

  const { latest_global, trending, most_read } = await getLandingPageArticles({
    country,
    category,
  });

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* main - takes 2 columns on lg */}
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
            isFeatured={true}
          />
        )}

        <div className="space-y-6">
          <h1 className="text-2xl font-bold">Latest Global News</h1>

          {latest_global.map((article) => (
            <ArticleCard
              key={article.id}
              id={article.id}
              category={article.category}
              location={article.country}
              title={article.title}
              // description={article.content.split('\n')[0].substring(0, 150) + "..."} // TODO: there's something wrong with the API today.
              timeAgo={new Date(article.timestamp).toLocaleDateString()}
              imageSrc={article.image_url}
            />
          ))}
        </div>
      </div>

      {/* aside */}
      <div className="flex flex-col gap-6">
        <TrendingTopicsCard
          items={trending.slice(0, 5).map((article) => ({
            id: article.id,
            label: article.title,
          }))}
        />
        <MostReadTodayCard
          items={most_read.slice(0, 5).map((article) => ({
            id: article.id,
            title: article.title,
            imageUrl: article.image_url,
            views: 0
          }))}
        />
      </div>
    </div>
  );
}
