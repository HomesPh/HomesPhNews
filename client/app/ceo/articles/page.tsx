"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAdminArticles } from "@/lib/api-v2/admin/service/article/getAdminArticles";
import { ArticleResource } from "@/lib/api-v2/types/ArticleResource";
import ArticleListItem from "@/components/features/admin/articles/ArticleListItem";
import ArticlesFilters from "@/components/features/admin/articles/ArticlesFilters";
import ArticlesSkeleton from "@/components/features/admin/articles/ArticlesSkeleton";
import Pagination from "@/components/features/admin/shared/Pagination";
import AdminPageHeader from "@/components/features/admin/shared/AdminPageHeader";
import usePagination from "@/hooks/usePagination";
import useUrlFilters from "@/hooks/useUrlFilters";
import { CheckCircle2, XCircle, Clock } from "lucide-react";

const URL_FILTERS_CONFIG = {
    status: {
        default: "edited" as const,
        resetValues: ["edited"],
    },
    category: {
        default: "" as const,
        resetValues: [""],
    },
    country: {
        default: "" as const,
        resetValues: [""],
    },
};

type CEOTab = "edited" | "published" | "rejected";

const TABS: { id: CEOTab; label: string; icon: React.ElementType; color: string }[] = [
    { id: "edited", label: "Pending Approval", icon: Clock, color: "text-indigo-600" },
    { id: "published", label: "Approved", icon: CheckCircle2, color: "text-emerald-600" },
    { id: "rejected", label: "Rejected", icon: XCircle, color: "text-red-600" },
];

export default function CEOArticlesPage() {
    const router = useRouter();
    const { filters, setFilter } = useUrlFilters(URL_FILTERS_CONFIG);
    const [searchQuery, setSearchQuery] = useState("");
    const pagination = usePagination();

    const [articles, setArticles] = useState<ArticleResource[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [availableFilters, setAvailableFilters] = useState<{
        categories: string[];
        countries: string[];
    }>({ categories: [], countries: [] });

    const [counts, setCounts] = useState({
        edited: 0,
        published: 0,
        rejected: 0,
    });

    useEffect(() => {
        const fetchArticles = async () => {
            setIsLoading(true);
            try {
                const apiFilters = {
                    status: filters.status || "edited",
                    category: filters.category === "" ? undefined : filters.category,
                    country: filters.country === "" ? undefined : filters.country,
                    search: searchQuery || undefined,
                    page: pagination.currentPage,
                    per_page: 10,
                } as any;

                const response = await getAdminArticles(apiFilters);
                const { data, current_page, last_page, status_counts, available_filters } =
                    response.data;

                const visibleArticles = (data ?? []).filter(
                    (a: ArticleResource) => !a.is_redis && a.status !== "being_processed"
                );
                setArticles(visibleArticles);

                pagination.handlePageChange(current_page ?? 1);
                pagination.setTotalPages(last_page ?? 1);

                if (status_counts) {
                    setCounts({
                        edited: Number(status_counts.edited ?? 0),
                        published: Number(status_counts.published ?? 0),
                        rejected: Number(status_counts.rejected ?? 0),
                    });
                }

                if (available_filters) {
                    setAvailableFilters(available_filters);
                }
            } catch (error) {
                console.error("Failed to fetch articles:", error);
            } finally {
                setIsLoading(false);
            }
        };

        const timer = setTimeout(fetchArticles, 300);
        return () => clearTimeout(timer);
    }, [filters, searchQuery, pagination.currentPage]);

    const activeTab = (filters.status as CEOTab) || "edited";

    return (
        <div className="p-8 bg-[#f9fafb] min-h-screen">
            <AdminPageHeader
                title="Article Review"
                description="Review editor-submitted articles and approve or reject them for publishing"
            />

            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl border border-indigo-100 p-5 shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <p className="text-[12px] text-[#6b7280] font-medium tracking-[-0.5px]">Pending Approval</p>
                        <p className="text-[24px] font-bold text-[#111827] tracking-[-1px]">{counts.edited}</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-emerald-100 p-5 shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-[12px] text-[#6b7280] font-medium tracking-[-0.5px]">Approved</p>
                        <p className="text-[24px] font-bold text-[#111827] tracking-[-1px]">{counts.published}</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-red-100 p-5 shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                        <XCircle className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                        <p className="text-[12px] text-[#6b7280] font-medium tracking-[-0.5px]">Rejected</p>
                        <p className="text-[24px] font-bold text-[#111827] tracking-[-1px]">{counts.rejected}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden shadow-[0px_1px_3px_rgba(0,0,0,0.05)]">
                <div className="border-b border-[#e5e7eb] pt-5 px-0">
                    <div className="flex gap-8 px-5">
                        {TABS.map((tab) => {
                            const isActive = activeTab === tab.id;
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        setFilter("status", tab.id);
                                        pagination.handlePageChange(1);
                                    }}
                                    className={`flex items-center gap-[15px] px-2 pb-3 relative transition-all ${isActive ? "border-b-4 border-[#C10007]" : ""
                                        }`}
                                >
                                    <span
                                        className={`text-[16px] tracking-[-0.5px] ${isActive
                                                ? "text-[#C10007] font-semibold"
                                                : "text-[#4b5563] font-medium"
                                            }`}
                                    >
                                        {tab.label}
                                    </span>
                                    <span
                                        className={`inline-flex items-center justify-center min-w-[25px] h-[25px] px-2 rounded-full text-[14px] tracking-[-0.5px] transition-colors ${isActive
                                                ? "bg-[#C10007] text-white font-semibold"
                                                : "bg-[#e5e7eb] text-[#4b5563] font-medium"
                                            }`}
                                    >
                                        {counts[tab.id] ?? 0}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <ArticlesFilters
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    categoryFilter={filters.category}
                    setCategoryFilter={(cat) => setFilter("category", cat)}
                    countryFilter={filters.country}
                    setCountryFilter={(country) => setFilter("country", country)}
                    availableCategories={availableFilters.categories}
                    availableCountries={availableFilters.countries}
                />

                <div className="flex flex-col">
                    {isLoading ? (
                        <ArticlesSkeleton />
                    ) : articles.length > 0 ? (
                        articles.map((article) => (
                            <ArticleListItem
                                key={article.id}
                                article={article}
                                onClick={() => {
                                    router.push(`/ceo/articles/${article.id}`);
                                }}
                            />
                        ))
                    ) : (
                        <div className="p-20 text-center">
                            <p className="text-[#6b7280] text-[16px] font-medium">
                                No articles found.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-8">
                <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={pagination.handlePageChange}
                />
            </div>
        </div>
    );
}
