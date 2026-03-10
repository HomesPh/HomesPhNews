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
import { CheckCircle2, XCircle, Clock, Trash2, Globe, Check, Loader2, X, LayoutGrid, FileText } from "lucide-react";
import { bulkPublishArticles, bulkRejectArticles, getSiteNames } from "@/lib/api-v2";
import { bulkUnpublishArticles } from "@/lib/api-v2/admin/service/article/bulkUnpublishArticles";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import ArticleEditorModal from "@/components/features/admin/articles/ArticleEditorModal";

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
};

type CEOTab = "all" | "edited" | "published_articles" | "pending_review" | "rejected";

const TABS: { id: CEOTab; label: string; icon: React.ElementType; color: string }[] = [
    { id: "all", label: "All Articles", icon: LayoutGrid, color: "text-gray-600" },
    { id: "published_articles", label: "Published articles", icon: Globe, color: "text-blue-600" },
    { id: "pending_review", label: "Pending Review", icon: FileText, color: "text-amber-600" },
    { id: "edited", label: "Pending Approval", icon: Clock, color: "text-indigo-600" },
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
        all: 0,
        published: 0,
        pending: 0,
        edited: 0,
        rejected: 0,
    });

    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
    const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);
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
                let statusParam = filters.status || "all";
                if (statusParam === "pending_review") statusParam = "pending review";
                if (statusParam === "published_articles") statusParam = "published";

                const apiFilters = {
                    status: statusParam,
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

                // Hide being_processed (Redis) and deleted articles from CEO view
                const filteredData = (data ?? []).filter(
                    (a: ArticleResource) => !a.is_redis && a.status !== "being_processed" && a.status !== "deleted"
                );
                setArticles(filteredData);

                pagination.handlePageChange(current_page ?? 1);
                pagination.setTotalPages(last_page ?? 1);

                if (status_counts) {
                    // Adjust 'all' count to exclude being_processed if it's currently inclusive
                    const rawAll = Number(status_counts.all ?? 0);
                    const beingProcessedCount = Number(status_counts.being_processed ?? 0);
                    const deletedCount = Number(status_counts.deleted ?? 0);

                    setCounts({
                        all: rawAll - beingProcessedCount - deletedCount,
                        published: Number(status_counts.published ?? 0),
                        pending: Number(status_counts.pending ?? 0),
                        edited: Number(status_counts.edited ?? 0),
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
            let statusParam = filters.status || "all";
            if (statusParam === "pending_review") statusParam = "pending review";
            if (statusParam === "published_articles") statusParam = "published";

            const apiFilters = {
                status: statusParam,
                page: pagination.currentPage,
                per_page: 10,
            } as any;
            const response = await getAdminArticles(apiFilters);
            const { data, status_counts } = response.data;

            const filteredData = (data ?? []).filter(
                (a: ArticleResource) => !a.is_redis && a.status !== "being_processed" && a.status !== "deleted"
            );
            setArticles(filteredData);

            if (status_counts) {
                const rawAll = Number(status_counts.all ?? 0);
                const beingProcessedCount = Number(status_counts.being_processed ?? 0);
                const deletedCount = Number(status_counts.deleted ?? 0);

                setCounts({
                    all: rawAll - beingProcessedCount - deletedCount,
                    published: Number(status_counts.published ?? 0),
                    pending: Number(status_counts.pending ?? 0),
                    edited: Number(status_counts.edited ?? 0),
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

    const handleBulkUnpublish = async () => {
        if (selectedIds.length === 0) return;
        if (!confirm(`Are you sure you want to unpublish ${selectedIds.length} articles? They will be moved back to Pending Review.`)) return;

        setIsBulkActionLoading(true);
        try {
            await bulkUnpublishArticles(selectedIds);
            setSelectedIds([]);
            // Refresh counts and list
            let statusParam = filters.status || "all";
            if (statusParam === "pending_review") statusParam = "pending review";
            if (statusParam === "published_articles") statusParam = "published";

            const apiFilters = {
                status: statusParam,
                page: pagination.currentPage,
                per_page: 10,
            } as any;
            const response = await getAdminArticles(apiFilters);
            const { data, status_counts } = response.data;

            const filteredData = (data ?? []).filter(
                (a: ArticleResource) => !a.is_redis && a.status !== "being_processed" && a.status !== "deleted"
            );
            setArticles(filteredData);

            if (status_counts) {
                const rawAll = Number(status_counts.all ?? 0);
                const beingProcessedCount = Number(status_counts.being_processed ?? 0);
                const deletedCount = Number(status_counts.deleted ?? 0);

                setCounts({
                    all: rawAll - beingProcessedCount - deletedCount,
                    published: Number(status_counts.published ?? 0),
                    pending: Number(status_counts.pending ?? 0),
                    edited: Number(status_counts.edited ?? 0),
                    rejected: Number(status_counts.rejected ?? 0),
                });
            }
            alert("Articles unpublished successfully.");
        } catch (error) {
            console.error("Bulk unpublish failed:", error);
            alert("Failed to unpublish articles.");
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
            let statusParam = filters.status || "all";
            if (statusParam === "pending_review") statusParam = "pending review";
            if (statusParam === "published_articles") statusParam = "published";

            const apiFilters = {
                status: statusParam,
                page: pagination.currentPage,
                per_page: 10,
            } as any;
            const response = await getAdminArticles(apiFilters);
            const { data, status_counts } = response.data;

            const filteredData = (data ?? []).filter(
                (a: ArticleResource) => !a.is_redis && a.status !== "being_processed" && a.status !== "deleted"
            );
            setArticles(filteredData);

            if (status_counts) {
                const rawAll = Number(status_counts.all ?? 0);
                const beingProcessedCount = Number(status_counts.being_processed ?? 0);
                const deletedCount = Number(status_counts.deleted ?? 0);

                setCounts({
                    all: rawAll - beingProcessedCount - deletedCount,
                    published: Number(status_counts.published ?? 0),
                    pending: Number(status_counts.pending ?? 0),
                    edited: Number(status_counts.edited ?? 0),
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

    const activeTab = (filters.status as CEOTab) || "all";

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-[#f9fafb] min-h-screen">
            <AdminPageHeader
                title="Article Review"
                description="Review editor-submitted articles and approve or reject them for publishing"
                actionLabel="Add Article"
                onAction={() => setIsEditorModalOpen(true)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
                {/* 1. All Articles */}
                <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex flex-col items-start gap-3 hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
                        <LayoutGrid className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                        <p className="text-[13px] font-bold text-[#111827] tracking-[-0.5px]">All Articles</p>
                        <p className="text-[10px] text-[#9ca3af] font-medium leading-[13px] mt-0.5 mb-2">Total overview of all content managed in the system.</p>
                        <p className="text-[24px] font-black text-[#111827] tracking-[-1px] leading-none">{counts.all}</p>
                    </div>
                </div>

                {/* 2. Published Articles */}
                <div className="bg-white rounded-xl border border-blue-50 p-5 shadow-sm flex flex-col items-start gap-3 hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <Globe className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                        <p className="text-[13px] font-bold text-[#111827] tracking-[-0.5px]">Published Articles</p>
                        <p className="text-[10px] text-[#9ca3af] font-medium leading-[13px] mt-0.5 mb-2">Articles that are currently live and accessible to the public on partnered sites.</p>
                        <p className="text-[24px] font-black text-[#111827] tracking-[-1px] leading-none">{counts.published}</p>
                    </div>
                </div>

                {/* 3. Pending Review */}
                <div className="bg-white rounded-xl border border-amber-50 p-5 shadow-sm flex flex-col items-start gap-3 hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="flex-1">
                        <p className="text-[13px] font-bold text-[#111827] tracking-[-0.5px]">Pending Review</p>
                        <p className="text-[10px] text-[#9ca3af] font-medium leading-[13px] mt-0.5 mb-2">Articles in the queue awaiting final verification before they can be published.</p>
                        <p className="text-[24px] font-black text-[#111827] tracking-[-1px] leading-none">{counts.pending}</p>
                    </div>
                </div>

                {/* 4. Pending Approval */}
                <div className="bg-white rounded-xl border border-indigo-50 p-5 shadow-sm flex flex-col items-start gap-3 hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                        <p className="text-[13px] font-bold text-[#111827] tracking-[-0.5px]">Pending Approval</p>
                        <p className="text-[10px] text-[#9ca3af] font-medium leading-[13px] mt-0.5 mb-2">Content edited and submitted for initial management review and confirmation.</p>
                        <p className="text-[24px] font-black text-[#111827] tracking-[-1px] leading-none">{counts.edited}</p>
                    </div>
                </div>

                {/* 5. Rejected */}
                <div className="bg-white rounded-xl border border-red-50 p-5 shadow-sm flex flex-col items-start gap-3 hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                        <XCircle className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="flex-1">
                        <p className="text-[13px] font-bold text-[#111827] tracking-[-0.5px]">Rejected</p>
                        <p className="text-[10px] text-[#9ca3af] font-medium leading-[13px] mt-0.5 mb-2">Content that did not meet editorial standards and was declined for publication.</p>
                        <p className="text-[24px] font-black text-[#111827] tracking-[-1px] leading-none">{counts.rejected}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden shadow-[0px_1px_3px_rgba(0,0,0,0.05)]">
                <div className="border-b border-[#e5e7eb] pt-3 sm:pt-5 px-0">
                    <div className="flex gap-6 sm:gap-8 px-4 sm:px-5 overflow-x-auto no-scrollbar">
                        {TABS.map((tab, index) => {
                            const isActive = activeTab === tab.id;
                            let statusKey: keyof typeof counts = "all";
                            if (tab.id === "pending_review") statusKey = "pending";
                            else if (tab.id === "published_articles") statusKey = "published";
                            else if (tab.id === "all" || tab.id === "edited" || tab.id === "rejected") statusKey = tab.id;

                            return (
                                <button
                                    key={`${tab.id}-${index}`}
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
                                        {counts[statusKey] ?? 0}
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
                {(activeTab === 'edited' || activeTab === 'pending_review' || activeTab === 'published_articles') && articles.length > 0 && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-5 py-3 border-b border-[#e5e7eb] bg-[#f9fafb]">
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
                            <div className="flex flex-wrap items-center gap-2 animate-in fade-in slide-in-from-right-2">
                                {activeTab === 'published_articles' ? (
                                    <button
                                        onClick={handleBulkUnpublish}
                                        disabled={isBulkActionLoading}
                                        className="w-full sm:w-auto flex items-center justify-center gap-2 h-9 px-4 rounded-lg text-[12px] sm:text-[13px] font-bold bg-amber-500 text-white hover:bg-amber-600 transition-all shadow-sm active:scale-95"
                                    >
                                        {isBulkActionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                                        GROUP UNPUBLISH
                                    </button>
                                ) : (
                                    <>
                                        {activeTab !== 'pending_review' && (
                                            <button
                                                onClick={handleBulkReject}
                                                disabled={isBulkActionLoading}
                                                className="flex-1 sm:flex-none h-9 px-3 sm:px-4 font-bold text-[12px] sm:text-[13px] text-red-600 border border-red-100 rounded-lg hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                                            >
                                                {isBulkActionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                                                REJECT
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setIsPublishModalOpen(true)}
                                            disabled={isBulkActionLoading}
                                            className="flex-1 sm:flex-none h-9 px-3 sm:px-4 bg-[#1428AE] text-white font-bold text-[12px] sm:text-[13px] rounded-lg hover:bg-[#000785] transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95"
                                        >
                                            {isBulkActionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                            GROUP PUBLISH
                                        </button>
                                    </>
                                )}
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
                                selection={(activeTab === 'edited' || activeTab === 'pending_review' || activeTab === 'published_articles') ? {
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
                            <div className="flex items-center gap-4 mb-3">
                                <div className="bg-[#3b82f6]/10 p-2 rounded-full">
                                    <CheckCircle2 className="w-6 h-6 text-[#3b82f6]" />
                                </div>
                                <DialogTitle className="text-[24px] font-bold text-[#1e293b] tracking-tight">Group Publish Articles</DialogTitle>
                            </div>
                            <DialogDescription className="text-[#64748b] text-[15px]">
                                You have selected <span className="font-bold text-[#3b82f6]">{selectedIds.length}</span> articles. Please select the partner sites where you want to publish them.
                            </DialogDescription>
                        </div>

                        {/* Content */}
                        <div className="p-8 max-h-[400px] overflow-y-auto custom-scrollbar">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-[14px] font-black text-[#64748b] uppercase tracking-[1px]">Partner Sites</h3>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setSelectedSites(sites)}
                                            className="text-[12px] font-bold text-[#3b82f6] hover:underline"
                                        >
                                            Select All
                                        </button>
                                        <span className="text-gray-300">|</span>
                                        <button
                                            onClick={() => setSelectedSites([])}
                                            className="text-[12px] font-bold text-[#64748b] hover:underline"
                                        >
                                            Clear
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
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
                                                    className={`flex items-center justify-between p-4 rounded-[12px] border-2 transition-all cursor-pointer ${isSelected
                                                        ? 'border-[#3b82f6] bg-[#eff6ff] shadow-sm'
                                                        : 'border-[#f1f5f9] bg-white hover:border-gray-200'
                                                        }`}
                                                >
                                                    <span className={`text-[15px] font-semibold ${isSelected ? 'text-[#1d4ed8]' : 'text-[#334155]'}`}>
                                                        {siteName}
                                                    </span>
                                                    {isSelected && (
                                                        <div className="bg-[#3b82f6] rounded-full p-1 shadow-sm">
                                                            <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="col-span-2 text-center py-12 bg-[#f8fafc] rounded-[16px] border-2 border-dashed border-[#e2e8f0]">
                                            <Loader2 className="w-6 h-6 animate-spin text-[#94a3b8] mx-auto mb-2" />
                                            <p className="text-[14px] text-[#64748b] font-medium uppercase tracking-wider">Loading available sites...</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-8 py-6 border-t border-[#e2e8f0] flex items-center justify-end gap-3 bg-[#f8fafc]">
                            <button
                                onClick={() => setIsPublishModalOpen(false)}
                                className="h-[44px] px-6 font-semibold text-[15px] text-[#64748b] hover:text-[#1e293b] transition-colors"
                            >
                                Cancel
                            </button>
                            <Button
                                onClick={handleBulkPublish}
                                disabled={selectedSites.length === 0 || isBulkActionLoading}
                                className="h-[44px] px-8 bg-[#3b82f6] text-white rounded-[10px] font-bold text-[15px] hover:bg-[#2563eb] transition-all active:scale-95 shadow-lg shadow-blue-500/20 disabled:opacity-50"
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

            <ArticleEditorModal
                mode="create"
                isOpen={isEditorModalOpen}
                onClose={() => setIsEditorModalOpen(false)}
                availableCategories={availableFilters.categories}
                availableCountries={availableFilters.countries}
            />
        </div>
    );
}

