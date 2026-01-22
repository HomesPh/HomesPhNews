import VerticalArticleCard from "@/components/features/dashboard/VerticalArticleCard";
import { articles } from "../data";
import { Categories, Countries } from "@/app/data";

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function SearchPage({ searchParams }: Props) {
    const params = await searchParams;
    const q = (params.q as string) || "";
    const topic = (params.topic as string) || "";
    const country = (params.country as string) || "all";
    const category = (params.category as string) || "all";

    // Helper lookup for labels
    const getLabel = (list: any[], val: string) =>
        list.find(l => l.id.toLowerCase() === val.toLowerCase() || l.label.toLowerCase() === val.toLowerCase())?.label || val;

    const countryLabel = getLabel(Countries, country);
    const categoryLabel = getLabel(Categories, category);

    // Filter Logic
    const query = (q || topic).toLowerCase();
    const filteredArticles = articles.filter((article) => {
        const matchesQuery = !query || (
            article.title.toLowerCase().includes(query) ||
            article.description.toLowerCase().includes(query) ||
            article.category.toLowerCase().includes(query) ||
            article.location.toLowerCase().includes(query) ||
            (article.subtitle && article.subtitle.toLowerCase().includes(query)) ||
            (article.topics && article.topics.some(t => t.toLowerCase().includes(query)))
        );

        const matchesCountry = country === "all" ||
            article.location.toLowerCase() === country.toLowerCase() ||
            article.location.toLowerCase() === countryLabel.toLowerCase();

        const matchesCategory = category === "all" ||
            article.category.toLowerCase() === category.toLowerCase() ||
            article.category.toLowerCase() === categoryLabel.toLowerCase();

        return matchesQuery && matchesCountry && matchesCategory;
    });

    const heading = q ? `Search Results for "${q}"` : topic ? `Topic: ${topic}` : "All Articles";
    const filterText = (country !== "all" || category !== "all")
        ? ` in ${country !== "all" ? countryLabel : ""} ${category !== "all" ? categoryLabel : ""}`.replace("  ", " ")
        : "";

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
            <h1 className="text-[32px] font-bold text-[#111827] tracking-tight">
                {heading}{filterText}
            </h1>

            {filteredArticles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                    {filteredArticles.map((article) => (
                        <VerticalArticleCard
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
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">
                    <p className="font-semibold text-xl text-gray-900 mb-2">No results found</p>
                    <p>We couldn't find any articles matching your search criteria.</p>
                </div>
            )}
        </div>
    );
}
