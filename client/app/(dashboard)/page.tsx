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
    <div className="w-full grid grid-cols-3 gap-4 gap-x-12">
      {/* main - takes 2 columns */}
      <div className="col-span-2">
        <HeroSection
          title="AI Revolution: How Machine Learning is Transforming Healthcare in North America"
          description="Canadian researchers develop groundbreaking AI system that can detect early signs of cancer with 86% accuracy, potentially saving thousands of lives annually."
          category="Technology"
          country="Canada"
          imageUrl="/healthcare.jpg"
          imageAlt="AI Healthcare Technology"
          timeAgo="12 mins ago"
          isFeatured={true}
        />

        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Latest Global News</h1>

          {articles.map((article, index) => (
            <ArticleCard key={index} {...article} />
          ))}
        </div>
      </div>

      {/* aside */}
      <div className="col-span-1 flex flex-col gap-4">
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