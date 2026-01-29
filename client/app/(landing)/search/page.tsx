import VerticalArticleCard from "@/components/features/dashboard/VerticalArticleCard";
import { getArticlesList, type ArticleResource } from "@/lib/api-v2";
import { Categories, Countries } from "@/app/data";

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function SearchPage({ searchParams }: Props) {
    const params = await searchParams;
    const q = (params.q as string) || (params.search as string) || "";
    const topic = (params.topic as string) || "";
    const country = (params.country as string) || "all";
    const category = (params.category as string) || "all";

    // Fetch articles from API
    const response = await getArticlesList({
        mode: "list",
        search: q || undefined,
        topic: topic || undefined,
        country: country !== "all" ? country : undefined,
        category: category !== "all" ? category : undefined,
        limit: 20
    });

    // Extract articles from the nested structure defined in ArticleListResponse
    const filteredArticles: ArticleResource[] = response.data.data.data || [];

    // Helper lookup for labels
    const getLabel = (list: any[], val: string) =>
        list.find(l => l.id.toLowerCase() === val.toLowerCase() || l.label.toLowerCase() === val.toLowerCase())?.label || val;

    const countryLabel = getLabel(Countries, country);
    const categoryLabel = getLabel(Categories, category);

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
                    {filteredArticles.map((article: ArticleResource) => (
                        <VerticalArticleCard
                            key={article.id}
                            id={article.id}
                            category={article.category}
                            location={article.country}
                            title={article.title}
                            description={article.summary}
                            timeAgo={new Date(article.created_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                            })}
                            views={`${article.views_count || 0} views`}
                            imageSrc={article.image || "/images/placeholder.png"}
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
