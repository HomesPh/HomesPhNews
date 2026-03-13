"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { getAdminArticles, getAdminUser } from "@/lib/api-v2";
import { ArticleResource } from "@/lib/api-v2/types/ArticleResource";
import { UserResource } from "@/lib/api-v2/types/UserResource";
import ArticleListItem from "@/components/features/admin/articles/ArticleListItem";
import ArticlesSkeleton from "@/components/features/admin/articles/ArticlesSkeleton";
import Pagination from "@/components/features/admin/shared/Pagination";
import AdminPageHeader from "@/components/features/admin/shared/AdminPageHeader";
import usePagination from "@/hooks/usePagination";
import useUrlFilters from "@/hooks/useUrlFilters";
import { ChevronLeft, FileText, User, Globe, Clock, XCircle, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ArticlesFilters from "@/components/features/admin/articles/ArticlesFilters";

const URL_FILTERS_CONFIG = {
    status: {
        default: "all" as const,
        resetValues: ["all"],
    },
    category: {
        default: "" as const,
        resetValues: [""],
    },
    country: {
        default: "" as const,
        resetValues: [""],
    },
    city: {
        default: "" as const,
        resetValues: [""],
    },
    province: {
        default: "" as const,
        resetValues: [""],
    },
};

type ProfileTab = "all" | "published" | "edited" | "rejected";

const TABS: { id: ProfileTab; label: string; icon: React.ElementType; color: string }[] = [
    { id: "all", label: "All Articles", icon: LayoutGrid, color: "text-gray-600" },
    { id: "published", label: "Published", icon: Globe, color: "text-blue-600" },
    { id: "edited", label: "Pending Approval", icon: Clock, color: "text-indigo-600" },
    { id: "rejected", label: "Rejected", icon: XCircle, color: "text-red-600" },
];

export default function EditorLogsPage() {
    const { id } = useParams();
    const router = useRouter();
    const pagination = usePagination();
    const { filters, setFilter, setFilters } = useUrlFilters(URL_FILTERS_CONFIG);
    const [searchQuery, setSearchQuery] = useState("");

    const [editor, setEditor] = useState<UserResource | null>(null);
    const [articles, setArticles] = useState<ArticleResource[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUserLoading, setIsUserLoading] = useState(true);
    const [counts, setCounts] = useState({
        all: 0,
        published: 0,
        edited: 0,
        rejected: 0,
    });
    const [availableFilters, setAvailableFilters] = useState<{
        categories: { name: string; count: number }[];
        countries: { name: string; count: number }[];
        provinces: { name: string; count: number }[];
        cities: { name: string; count: number }[];
    }>({ categories: [], countries: [], provinces: [], cities: [] });

    const fetchEditor = useCallback(async () => {
        setIsUserLoading(true);
        try {
            const response = await getAdminUser(id as string);
            setEditor(response.data.data);
        } catch (error) {
            console.error("Failed to fetch editor:", error);
        } finally {
            setIsUserLoading(false);
        }
    }, [id]);

    const fetchCounts = useCallback(async () => {
        try {
            // Fetch status-specific totals to ensure they are scoped to the editor
            const statuses: ProfileTab[] = ["published", "edited", "rejected"];
            const countPromises = statuses.map(s => 
                getAdminArticles({
                    editor_id: id as string,
                    status: s as any,
                    per_page: 1,
                })
            );

            const results = await Promise.all(countPromises);
            const newCounts = { all: 0, published: 0, edited: 0, rejected: 0 };
            
            let totalSum = 0;
            results.forEach((res, index) => {
                const tab = statuses[index] as "published" | "edited" | "rejected";
                const total = Number(res.data.total ?? 0);
                newCounts[tab] = total;
                totalSum += total;
            });

            // "All" is now strictly the sum of visible categories
            newCounts.all = totalSum;

            setCounts(newCounts);
        } catch (error) {
            console.error("Failed to fetch accurate counts:", error);
        }
    }, [id]);

    const fetchArticles = useCallback(async () => {
        setIsLoading(true);
        try {
            let statusParam = filters.status || "all";

            const apiFilters = {
                editor_id: id as string,
                status: statusParam === "all" ? "all" : statusParam,
                category: filters.category === "" ? undefined : filters.category,
                country: filters.country === "" ? undefined : filters.country,
                province: filters.province === "" ? undefined : filters.province,
                city: filters.city === "" ? undefined : filters.city,
                search: searchQuery || undefined,
                page: pagination.currentPage,
                per_page: 10,
            } as any;

            const response = await getAdminArticles(apiFilters);
            const { data, current_page, last_page, status_counts, available_filters } = response.data;

            const filteredData = (data || []).filter((a: ArticleResource) => {
                const status = String(a.status).toLowerCase().replace(/-/g, '_');
                return status !== "being_processed" && !a.is_redis;
            });
            setArticles(filteredData);
            
            pagination.handlePageChange(current_page ?? 1);
            pagination.setTotalPages(last_page ?? 1);

            // Update the current active tab's count
            const activeTabKey = statusParam === "all" ? "all" : statusParam;
            let currentTotal = Number(response.data.total ?? 0);
            
            // For the 'all' tab, we must ensure it only counts visible articles (excludes being_processed)
            if (activeTabKey === "all" && status_counts) {
                currentTotal = Number(status_counts.published ?? 0) + 
                               Number(status_counts.edited ?? 0) + 
                               Number(status_counts.rejected ?? 0);
            } else if (filteredData.length === 0 && current_page === 1) {
                // If it's filtered to empty on first page, assume 0 for UI consistency
                currentTotal = 0;
            }

            setCounts(prev => ({
                ...prev,
                [activeTabKey]: currentTotal
            }));

            if (available_filters) {
                setAvailableFilters(available_filters);
            }
        } catch (error) {
            console.error("Failed to fetch editor articles:", error);
        } finally {
            setIsLoading(false);
        }
    }, [id, pagination.currentPage, filters, searchQuery]);

    useEffect(() => {
        fetchEditor();
        fetchCounts();
    }, [id, fetchEditor, fetchCounts]);

    useEffect(() => {
        const timer = setTimeout(fetchArticles, 300);
        return () => clearTimeout(timer);
    }, [fetchArticles]);

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-[#f9fafb] min-h-screen">
            <div className="mb-6">
                <Button
                    variant="ghost"
                    onClick={() => router.push('/ceo/editors')}
                    className="flex items-center gap-2 text-gray-600 hover:text-[#1428AE] transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back to Editors
                </Button>
            </div>

            <AdminPageHeader
                title="Editor Activity Logs"
                description="View all articles handled and edited by this team member"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-2xl border border-[#e5e7eb] p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-[#1428AE]">
                            <User className="w-6 h-6" />
                        </div>
                        <div>
                            {isUserLoading ? (
                                <Skeleton className="h-5 w-24" />
                            ) : (
                                <h3 className="text-lg font-bold text-[#111827]">{editor?.name}</h3>
                            )}
                            <p className="text-xs text-gray-500 truncate max-w-[150px]">{editor?.email}</p>
                            {!isUserLoading && editor?.created_at && (
                                <p className="text-[11px] text-gray-400 mt-2 font-medium bg-gray-50 px-2 py-0.5 rounded inline-block">
                                    Joined {new Date(editor.created_at).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Published Count */}
                <div className="bg-white rounded-xl border border-blue-50 p-5 shadow-sm flex flex-col items-start gap-3 hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <Globe className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                        <p className="text-[13px] font-bold text-[#111827] tracking-[-0.5px]">Published Count</p>
                        <p className="text-[24px] font-black text-[#111827] tracking-[-1px] leading-none">{counts.published}</p>
                    </div>
                </div>

                {/* Pending Approval Count */}
                <div className="bg-white rounded-xl border border-indigo-50 p-5 shadow-sm flex flex-col items-start gap-3 hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                        <p className="text-[13px] font-bold text-[#111827] tracking-[-0.5px]">Pending Approval</p>
                        <p className="text-[24px] font-black text-[#111827] tracking-[-1px] leading-none">{counts.edited}</p>
                    </div>
                </div>

                {/* Rejected Count */}
                <div className="bg-white rounded-xl border border-red-50 p-5 shadow-sm flex flex-col items-start gap-3 hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                        <XCircle className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="flex-1">
                        <p className="text-[13px] font-bold text-[#111827] tracking-[-0.5px]">Rejected Count</p>
                        <p className="text-[24px] font-black text-[#111827] tracking-[-1px] leading-none">{counts.rejected}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden shadow-[0px_1px_3px_rgba(0,0,0,0.05)]">
                <div className="border-b border-[#e5e7eb] pt-5 px-0">
                    <div className="flex gap-8 px-5 overflow-x-auto no-scrollbar">
                        {TABS.map((tab) => {
                            const isActive = filters.status === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        setFilter("status", tab.id);
                                        pagination.handlePageChange(1);
                                    }}
                                    className={`flex items-center gap-[15px] px-2 pb-3 relative transition-all flex-shrink-0 ${isActive ? "border-b-4 border-[#F4AA1D]" : ""
                                        }`}
                                >
                                    <span
                                        className={`text-[16px] tracking-[-0.5px] ${isActive
                                            ? "text-[#1428AE] font-semibold"
                                            : "text-[#4b5563] font-medium"
                                            }`}
                                    >
                                        {tab.label}
                                    </span>
                                    <span
                                        className={`inline-flex items-center justify-center min-w-[25px] h-[25px] px-2 rounded-full text-[14px] tracking-[-0.5px] transition-colors ${isActive
                                            ? "bg-[#1428AE] text-white font-semibold"
                                            : "bg-[#e5e7eb] text-[#4b5563] font-medium"
                                            }`}
                                    >
                                        {counts[tab.id as keyof typeof counts] ?? 0}
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
                    provinceFilter={filters.province}
                    cityFilter={filters.city}
                    setFilters={setFilters}
                    availableCategories={availableFilters.categories}
                    availableCountries={availableFilters.countries}
                    availableProvinces={availableFilters.provinces}
                    availableCities={availableFilters.cities}
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
                        <div className="p-20 text-center bg-[#f9fafb]">
                            <p className="text-[#6b7280] text-[16px] font-medium uppercase tracking-widest bg-white border border-[#e5e7eb] inline-block px-8 py-3 rounded-xl shadow-sm">
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
