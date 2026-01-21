import HeroSection from "@/components/features/dashboard/HeroSection";
import ArticleCard from "@/components/features/dashboard/ArticleCard";
import TrendingTopicsCard from "@/components/features/dashboard/TrendingTopicsCard";
import MostReadTodayCard from "@/components/features/dashboard/MostReadTodayCard";
import AdSpace from "@/components/shared/AdSpace";
import { articles, trendingTopics } from "./data";
import { Categories, Countries } from "@/app/data";

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function HomePage({ searchParams }: Props) {
    const params = await searchParams;
    const country = (params.country as string) || "all";
    const category = (params.category as string) || "all";
    const q = (params.q as string) || "";

    // Helper lookup for labels
    const getLabel = (list: any[], val: string) =>
        list.find(l => l.id.toLowerCase() === val.toLowerCase() || l.label.toLowerCase() === val.toLowerCase())?.label || val;

    const countryLabel = getLabel(Countries, country);
    const categoryLabel = getLabel(Categories, category);

    // Filtering Logic
    const filtered = articles.filter((a) => {
        const matchesCountry = country === "all" || a.location.toLowerCase() === countryLabel.toLowerCase() || a.location.toLowerCase() === country.toLowerCase();
        const matchesCategory = category === "all" || a.category.toLowerCase() === categoryLabel.toLowerCase() || a.category.toLowerCase() === category.toLowerCase();
        const matchesSearch = !q || [a.title, a.description, a.subtitle, ...(a.topics || [])].some(t => t?.toLowerCase().includes(q.toLowerCase()));
        return matchesCountry && matchesCategory && matchesSearch;
    });

    // Data for rendering
    const featured = filtered[0];
    const list = filtered.slice(1);
    const mostRead = [...articles]
        .sort((a, b) => parseInt(b.views) - parseInt(a.views))
        .slice(0, 4)
        .map(a => ({
            id: a.id,
            title: a.title,
            views: parseInt(a.views),
            imageUrl: a.imageSrc
        }));

    return (
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-[110px] py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {featured && (
                        <HeroSection
                            id={featured.id}
                            title={featured.title}
                            description={featured.description}
                            category={featured.category}
                            country={featured.location}
                            imageUrl={featured.imageSrc}
                            timeAgo={featured.timeAgo}
                            isFeatured={true}
                        />
                    )}

                    <AdSpace width="300x600" height="Leader board Ad" />

                    <div className="space-y-6">
                        <h1 className="text-2xl font-bold text-[#111827] tracking-tight">
                            Latest {country === "all" ? "Global" : countryLabel} News
                        </h1>

                        {!filtered.length && (
                            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">
                                <p className="font-semibold text-lg text-gray-900 mb-1">No articles found</p>
                                <p>Try adjusting your search or filters to find what you're looking for.</p>
                            </div>
                        )}

                        <div className="space-y-6">
                            {list.map((article) => (
                                <ArticleCard
                                    key={article.id}
                                    id={article.id}
                                    category={article.category}
                                    location={article.location}
                                    title={article.title}
                                    description={article.subtitle || article.description}
                                    timeAgo={article.timeAgo}
                                    views={article.views}
                                    imageSrc={article.imageSrc}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <AdSpace className="h-[112px]" width="300x600" height="Leader board Ad" />
                    <TrendingTopicsCard items={trendingTopics} />
                    <MostReadTodayCard items={mostRead} />
                    <AdSpace width="300x600" height="Leader board Ad" />
                </div>
            </div>
        </div>
    );
}
