import { Suspense } from "react";

import VerticalArticleCard from "@/components/features/dashboard/VerticalArticleCard";

import { getArticlesList, type ArticleResource } from "@/lib/api-v2";
import { Categories, Countries } from "@/app/data";
import { mockSpecialtyContent } from "@/lib/api-v2/mock/mockArticles";
import ArchivePagination from "@/components/features/dashboard/ArchivePagination";
import { SearchSkeleton } from "@/components/features/dashboard/DashboardSkeletons";

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function SearchPage({ searchParams }: Props) {
    const params = await searchParams;
    const q = (params.q as string) || (params.search as string) || "";
    const topic = (params.topic as string) || "";
    const country = (params.country as string) || "all";
    const category = (params.category as string) || "all";

    const page = Number(params.page) || 1;
    const perPage = 20;

    // Fetch articles from API
    const response = await getArticlesList({
        mode: "list",
        search: q || undefined,
        topic: topic || undefined,
        country: country !== "all" ? country : undefined,
        category: (category !== "all" && category.toLowerCase() !== "articles") ? category : undefined, // Treat 'articles' as all
        limit: perPage,
        page: page
    });

    // Extract real articles
    const realArticles: ArticleResource[] = response.data?.data || [];
    const totalPages = response.data?.last_page || 1;

    // Mixed content strategy: if category is 'all' or specialty, mix in mock content for page 1
    let filteredArticles = realArticles;
    if (page === 1 && (category === "all" || category.toLowerCase() === "articles" || ["blogs", "newsletters", "restaurants", "restaurant"].includes(category.toLowerCase()))) {
        const seenIds = new Set(realArticles.map(a => a.id));
        const uniqueMock = mockSpecialtyContent.filter(a => {
            const matchesCategory = category === "all" ||
                (category.toLowerCase() === "blogs" && (a.id.includes('blog') || a.category === "Real Estate")) ||
                (category.toLowerCase() === "newsletters" && (a.id.includes('newsletter') || a.category === "Business & Economy")) ||
                ((category.toLowerCase() === "restaurants" || category.toLowerCase() === "restaurant") && a.category === "Restaurant");

            const matchesCountry = country === "all" || a.country === country || a.country === "Global";

            const matchesSearch = !q ||
                a.title.toLowerCase().includes(q.toLowerCase()) ||
                a.summary.toLowerCase().includes(q.toLowerCase());

            return !seenIds.has(a.id) && matchesCategory && matchesCountry && matchesSearch;
        });
        filteredArticles = [...realArticles, ...uniqueMock];
    }

    // Helper lookup for labels
    const getLabel = (list: any[], val: string) =>
        list.find(l => l.id.toLowerCase() === val.toLowerCase() || l.label.toLowerCase() === val.toLowerCase())?.label || val;

    const countryLabel = getLabel(Countries, country);
    const categoryLabel = getLabel(Categories, category);

    const heading = q ? `Search Results for "${q}"` : topic ? `Topic: ${topic}` : "Complete Archive";
    const hasFilters = (country !== "all" && country !== "global") || (category !== "all" && category !== "global");

    let filterText = hasFilters
        ? ` in ${country !== "all" && country !== "global" ? countryLabel : ""} ${category !== "all" && category !== "global" ? categoryLabel : ""}`.replace("  ", " ")
        : (category === "all" || category === "global" ? " Across All Categories" : "");

    return (
        <div className="w-full max-w-[1280px] mx-auto px-4 py-12 space-y-8">
            <h1 className="text-[32px] font-bold text-[#111827] dark:text-white tracking-tight">
                {heading}{filterText}
            </h1>

            {filteredArticles.length > 0 ? (
                <Suspense fallback={<SearchSkeleton />}>
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
                                content={article.content}
                            />
                        ))}
                    </div>

                    <ArchivePagination
                        currentPage={page}
                        totalPages={totalPages}
                    />
                </Suspense>
            ) : (
                <div className="bg-white dark:bg-[#1a1d2e] rounded-xl border border-gray-200 dark:border-[#2a2d3e] p-12 text-center text-gray-500 dark:text-gray-400">
                    <p className="font-semibold text-xl text-gray-900 dark:text-white mb-2">No results found</p>
                    <p>We couldn't find any articles matching your search criteria.</p>
                </div>
            )}
        </div>
    );
}
