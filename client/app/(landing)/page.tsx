import ArticleCard from "@/components/features/dashboard/ArticleCard";
import HeroSection from "@/components/features/dashboard/HeroSection";
import { articles } from "./data";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import TrendingTopicsCard from "@/components/features/dashboard/TrendingTopicsCard";
import MostReadTodayCard from "@/components/features/dashboard/MostReadTodayCard";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Dashboard({ searchParams }: Props) {
  const { country, category } = await searchParams;

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* main - takes 2 columns on lg */}
      <div className="lg:col-span-2 space-y-8">
        <HeroSection
          id="detect-cancer-ai"
          title="AI Revolution: How Machine Learning is Transforming Healthcare in North America"
          description="Canadian researchers develop groundbreaking AI system that can detect early signs of cancer with 86% accuracy, potentially saving thousands of lives annually."
          category="Technology"
          country="Canada"
          imageUrl="/healthcare.jpg"
          imageAlt="AI Healthcare Technology"
          timeAgo="12 mins ago"
          isFeatured={true}
        />

        <div className="space-y-6">
          <h1 className="text-2xl font-bold">Latest Global News</h1>

          {articles.map((article, index) => (
            <ArticleCard
              key={article.id}
              id={article.id}
              category={article.category}
              location={article.location}
              title={article.title}
              description={article.description}
              timeAgo={article.timeAgo}
              views={article.views}
              imageSrc={article.imageSrc}
            />
          ))}
        </div>
      </div>

      {/* aside */}
      <div className="flex flex-col gap-6">
        <TrendingTopicsCard
          items={[
            { id: 1, label: "GPT-5 Launch" },
            { id: 2, label: "Quantum Computing" },
            { id: 3, label: "AI Ethics Debate" },
            { id: 4, label: "Robotics Revolution" },
            { id: 5, label: "Neural Interfaces" },
          ]}
        />
        <MostReadTodayCard
          items={[
            {
              id: 1,
              title: "How AI is Changing Education Forever",
              views: 24000,
              imageUrl: "/healthcare.jpg"
            },
            {
              id: 2,
              title: "Blockchain meets AI: The Future of Finance",
              views: 19800,
              imageUrl: "/healthcare.jpg"
            }
          ]}
        />
      </div>
    </div>
  );
}