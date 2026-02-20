import { Suspense } from "react";

import VerticalArticleCard from "@/components/features/dashboard/VerticalArticleCard";

import { getArticlesList, type ArticleResource } from "@/lib/api-v2";
import { formatViews } from "@/lib/utils";
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

    let realArticles: ArticleResource[] = [];
    let totalPages = 1;

    // Handle Restaurant specialized category
    if (category.toLowerCase() === "restaurant" || category.toLowerCase() === "restaurants") {
        const { getRestaurants } = await import("@/lib/api-v2");
        const response = await getRestaurants({
            page: page,
            per_page: perPage,
            country: country !== "all" ? country : undefined,
            search: q || undefined,
        });

        realArticles = response.data.map((r: any) => ({
            id: r.id,
            slug: r.id, // Restaurants use ID in URL usually
            article_id: r.id,
            title: r.name,
            summary: r.description || r.clickbait_hook || "",
            content: r.description || "",
            category: "Restaurant",
            country: r.country || "Philippines",
            status: r.status || "published",
            created_at: r.timestamp ? new Date(r.timestamp * 1000).toISOString() : new Date().toISOString(),
            views_count: r.views_count || 0,
            image_url: r.image_url,
            image: r.image_url,
            location: r.city || r.country,
            keywords: "",
            source: "Restaurant Guide",
            original_url: r.google_maps_url || "",
            is_deleted: false,
            is_redis: false
        } as ArticleResource));
        totalPages = response.last_page || 1;
    } else {
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
        realArticles = response.data?.data || [];
        totalPages = response.data?.last_page || 1;
    }

    // Mixed content strategy: if category is 'all' or specialty, mix in mock content for page 1
    let filteredArticles = realArticles;
    // ... rest of the code for mock mixing if needed, but for restaurants we now have real data!
    if (page === 1 && (category === "all" || category.toLowerCase() === "articles")) {
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
                                slug={article.slug}
                                category={article.category}
                                location={article.country}
                                title={article.title}
                                description={article.summary}
                                timeAgo={new Date(article.created_at).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                                views={formatViews(article.views_count || 0)}
                                imageSrc={article.image || "/images/placeholder.png"}
                                imagePosition={article.image_position}
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
