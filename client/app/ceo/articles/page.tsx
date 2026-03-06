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
import { CheckCircle2, XCircle, Clock, Trash2, Globe, Check, Loader2, X } from "lucide-react";
import { bulkPublishArticles, bulkRejectArticles, getSiteNames } from "@/lib/api-v2";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

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
    city: {
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
    const { filters, setFilter, setFilters } = useUrlFilters(URL_FILTERS_CONFIG);
    const [searchQuery, setSearchQuery] = useState("");
    const pagination = usePagination();

    const [articles, setArticles] = useState<ArticleResource[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [availableFilters, setAvailableFilters] = useState<{
        categories: { name: string; count: number }[];
        countries: { name: string; count: number }[];
    }>({ categories: [], countries: [] });

    const [counts, setCounts] = useState({
        edited: 0,
        published: 0,
        rejected: 0,
    });

    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
    const [sites, setSites] = useState<string[]>([]);
    const [selectedSites, setSelectedSites] = useState<string[]>([]);
    const [isBulkActionLoading, setIsBulkActionLoading] = useState(false);

    useEffect(() => {
        const fetchSites = async () => {
            try {
                const response = await getSiteNames();
                setSites(response.data);
            } catch (error) {
                console.error("Failed to fetch site names:", error);
            }
        };
        fetchSites();
    }, []);

    useEffect(() => {
        setSelectedIds([]);
    }, [filters.status]);

    useEffect(() => {
        const fetchArticles = async () => {
            setIsLoading(true);
            try {
                const apiFilters = {
                    status: filters.status || "edited",
                    category: filters.category === "" ? undefined : filters.category,
                    country: filters.country === "" ? undefined : filters.country,
                    city: filters.city === "" ? undefined : filters.city,
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

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(articles.map(a => a.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectArticle = (id: string, checked: boolean) => {
        if (checked) {
            setSelectedIds(prev => [...prev, id]);
        } else {
            setSelectedIds(prev => prev.filter(a => a !== id));
        }
    };

    const handleBulkReject = async () => {
        if (selectedIds.length === 0) return;
        if (!confirm(`Are you sure you want to reject ${selectedIds.length} articles?`)) return;

        setIsBulkActionLoading(true);
        try {
            await bulkRejectArticles(selectedIds);
            setSelectedIds([]);
            // Refresh counts and list
            const apiFilters = {
                status: filters.status || "edited",
                page: pagination.currentPage,
                per_page: 10,
            } as any;
            const response = await getAdminArticles(apiFilters);
            const { data, status_counts } = response.data;
            setArticles(data ?? []);
            if (status_counts) {
                setCounts({
                    edited: Number(status_counts.edited ?? 0),
                    published: Number(status_counts.published ?? 0),
                    rejected: Number(status_counts.rejected ?? 0),
                });
            }
            alert("Articles rejected successfully.");
        } catch (error) {
            console.error("Bulk reject failed:", error);
            alert("Failed to reject articles.");
        } finally {
            setIsBulkActionLoading(false);
        }
    };

    const handleBulkPublish = async () => {
        if (selectedIds.length === 0 || selectedSites.length === 0) return;

        setIsBulkActionLoading(true);
        try {
            await bulkPublishArticles(selectedIds, selectedSites);
            setIsPublishModalOpen(false);
            setSelectedIds([]);
            setSelectedSites([]);
            // Refresh counts and list
            const apiFilters = {
                status: filters.status || "edited",
                page: pagination.currentPage,
                per_page: 10,
            } as any;
            const response = await getAdminArticles(apiFilters);
            const { data, status_counts } = response.data;
            setArticles(data ?? []);
            if (status_counts) {
                setCounts({
                    edited: Number(status_counts.edited ?? 0),
                    published: Number(status_counts.published ?? 0),
                    rejected: Number(status_counts.rejected ?? 0),
                });
            }
            alert("Articles published successfully.");
        } catch (error) {
            console.error("Bulk publish failed:", error);
            alert("Failed to publish articles.");
        } finally {
            setIsBulkActionLoading(false);
        }
    };

    const activeTab = (filters.status as CEOTab) || "edited";

    return (
        <div className="p-8 bg-[#f9fafb] min-h-screen">
            <AdminPageHeader
                title="Article Review"
                description="Review editor-submitted articles and approve or reject them for publishing"
            />

            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl border border-blue-100 p-5 shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-[#1428AE]" />
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
                                    className={`flex items-center gap-[15px] px-2 pb-3 relative transition-all ${isActive ? "border-b-4 border-[#F4AA1D]" : ""
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
                    cityFilter={filters.city}
                    setFilters={setFilters}
                    availableCategories={availableFilters.categories}
                    availableCountries={availableFilters.countries}
                />

                {/* Bulk Actions Bar */}
                {activeTab === 'edited' && articles.length > 0 && (
                    <div className="bg-white border-b border-[#e5e7eb] px-5 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="select-all"
                                    checked={selectedIds.length === articles.length && articles.length > 0}
                                    onCheckedChange={(checked) => handleSelectAll(!!checked)}
                                />
                                <label htmlFor="select-all" className="text-sm font-bold text-[#4b5563] cursor-pointer tracking-[-0.3px]">
                                    Select All
                                </label>
                            </div>
                            {selectedIds.length > 0 && (
                                <div className="bg-[#eff6ff] text-[#1d4ed8] px-2 py-0.5 rounded-[4px] text-[11px] font-black tracking-widest uppercase">
                                    {selectedIds.length} Selected
                                </div>
                            )}
                        </div>

                        {selectedIds.length > 0 && (
                            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2">
                                <button
                                    onClick={handleBulkReject}
                                    disabled={isBulkActionLoading}
                                    className="h-[36px] px-4 font-bold text-[13px] text-red-600 border border-red-100 rounded-[6px] hover:bg-red-50 transition-all flex items-center gap-2"
                                >
                                    {isBulkActionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                                    REJECT
                                </button>
                                <button
                                    onClick={() => setIsPublishModalOpen(true)}
                                    disabled={isBulkActionLoading}
                                    className="h-[36px] px-4 bg-[#3b82f6] text-white font-bold text-[13px] rounded-[6px] hover:bg-[#2563eb] transition-all shadow-sm flex items-center gap-2 active:scale-95"
                                >
                                    {isBulkActionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                    APPROVE & PUBLISH
                                </button>
                            </div>
                        )}
                    </div>
                )}

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
                                selection={activeTab === 'edited' ? {
                                    isSelected: selectedIds.includes(article.id),
                                    onSelect: (checked) => handleSelectArticle(article.id, !!checked)
                                } : undefined}
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

            {/* Bulk Publish Modal */}
            <Dialog open={isPublishModalOpen} onOpenChange={setIsPublishModalOpen}>
                <DialogContent className="sm:max-w-[600px] p-0 border-none shadow-[0px_25px_50px_0px_rgba(0,0,0,0.25)] rounded-[12px] overflow-hidden force-light">
                    <div className="bg-white flex flex-col w-full animate-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="p-8 pb-0">
                            <div className="relative mb-8">
                                <div>
                                    <h2 className="font-bold text-[28px] leading-[42px] text-[#111827] tracking-[-0.5px]">
                                        Bulk Publish Selection
                                    </h2>
                                    <p className="font-normal text-[16px] leading-[24px] text-[#6b7280] tracking-[-0.5px] mt-2">
                                        Choose target platforms for <strong>{selectedIds.length}</strong> selected articles
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="px-8 pb-8 flex flex-col gap-6">
                            <div className="space-y-4">
                                <label className="block font-bold text-[14px] text-[#111827] tracking-[-0.5px]">
                                    Select Target Publishing Sites
                                </label>
                                <div className="grid grid-cols-1 gap-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                                    {sites.length > 0 ? (
                                        sites.map((siteName) => {
                                            const isSelected = selectedSites.includes(siteName);
                                            return (
                                                <div
                                                    key={siteName}
                                                    onClick={() => {
                                                        setSelectedSites(prev =>
                                                            isSelected ? prev.filter(s => s !== siteName) : [...prev, siteName]
                                                        );
                                                    }}
                                                    className={`flex items-center justify-between p-4 rounded-[8px] border-2 transition-all cursor-pointer ${isSelected
                                                        ? 'border-[#3b82f6] bg-[#eff6ff]'
                                                        : 'border-[#f3f4f6] bg-white hover:border-gray-200'
                                                        }`}
                                                >
                                                    <span className={`text-[15px] font-semibold ${isSelected ? 'text-[#1d4ed8]' : 'text-[#374151]'}`}>
                                                        {siteName}
                                                    </span>
                                                    {isSelected && (
                                                        <div className="bg-[#3b82f6] rounded-full p-1">
                                                            <Check className="w-3 h-3 text-white" />
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="text-center py-12 bg-[#f9fafb] rounded-[10px] border-dashed border-2 border-[#e5e7eb]">
                                            <Loader2 className="w-6 h-6 animate-spin text-[#9ca3af] mx-auto mb-2" />
                                            <p className="text-[14px] text-[#6b7280] font-medium uppercase tracking-wider">Loading available sites...</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="h-[75px] border-t border-[#e5e7eb] px-8 flex items-center justify-end gap-3 bg-[#fdfdfd]">
                            <button
                                onClick={() => setIsPublishModalOpen(false)}
                                className="h-[44px] px-6 font-normal text-[16px] text-[#6b7280] tracking-[-0.5px] hover:text-[#111827] transition-colors rounded-[6px] hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <Button
                                onClick={handleBulkPublish}
                                disabled={selectedSites.length === 0 || isBulkActionLoading}
                                className="h-[44px] px-[25px] bg-[#3b82f6] text-white rounded-[8px] font-semibold text-[16px] tracking-[-0.5px] hover:bg-[#2563eb] transition-all active:scale-95 shadow-sm disabled:opacity-50"
                            >
                                {isBulkActionLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                ) : null}
                                Publish to {selectedSites.length} Sites
                            </Button>
                        </div>
                    </div>
                </DialogContent>

                <style jsx>{`
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 6px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: #f1f1f1;
                        border-radius: 10px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: #d1d5db;
                        border-radius: 10px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: #9ca3af;
                    }
                `}</style>
            </Dialog>
        </div>
    );
}
