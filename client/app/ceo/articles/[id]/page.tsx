"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/api-v2";
import { cn, decodeHtml } from "@/lib/utils";
import {
    Calendar,
    Eye,
    Loader2,
    ExternalLink,
    CheckCircle2,
    XCircle,
    ChevronLeft,
    Clock,
} from "lucide-react";

import { ArticleResource } from "@/lib/api-v2/types/ArticleResource";
import { getAdminArticleById } from "@/lib/api-v2/admin/service/article/getAdminArticleById";
import { publishArticle } from "@/lib/api-v2/admin/service/article/publishArticle";
import { updateArticle } from "@/lib/api-v2/admin/service/article/updateArticle";
import { getSiteNames } from "@/lib/api-v2/admin/service/sites/getSiteNames";
import StatusBadge from "@/components/features/admin/shared/StatusBadge";
import ArticleBreadcrumb from "@/components/features/article/ArticleBreadcrumb";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function CEOArticleDetailContent() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const from = searchParams.get("from") || "/ceo/articles";
    const { user } = useAuth();

    const id = Array.isArray(params.id) ? params.id[0] : (params.id as string);

    const [article, setArticle] = useState<ArticleResource | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [availableSites, setAvailableSites] = useState<string[]>([]);
    const [publishToSites, setPublishToSites] = useState<string[]>([]);

    const [showApproveDialog, setShowApproveDialog] = useState(false);
    const [showRejectDialog, setShowRejectDialog] = useState(false);
    const [isApproving, setIsApproving] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);

    useEffect(() => {
        const fetchArticle = async () => {
            if (!id) return;
            setIsLoading(true);
            try {
                const response = await getAdminArticleById(id);
                const responseData = response.data as any;
                const articleData = responseData.data ?? responseData;
                setArticle(articleData as ArticleResource);
            } catch (e) {
                console.error("Failed to fetch article", e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchArticle();
    }, [id]);

    useEffect(() => {
        getSiteNames()
            .then((res) => {
                const sites = res.data as unknown as string[];
                setAvailableSites(sites);
                setPublishToSites(sites);
            })
            .catch(console.error);
    }, []);

    useEffect(() => {
        if (article) {
            const existingSites = Array.isArray(article.published_sites)
                ? article.published_sites
                : article.published_sites
                    ? [article.published_sites]
                    : [];
            if (existingSites.length > 0) {
                setPublishToSites(existingSites);
            } else if (availableSites.length > 0) {
                setPublishToSites(availableSites);
            }
        }
    }, [article, availableSites]);

    const toggleSite = (site: string) => {
        setPublishToSites((prev) =>
            prev.includes(site) ? prev.filter((s) => s !== site) : [...prev, site]
        );
    };

    const handleApprove = async () => {
        if (!article || !id) return;
        if (publishToSites.length === 0) {
            alert("Please select at least one site to publish to.");
            return;
        }
        setIsApproving(true);
        try {
            await publishArticle(id, {
                published_sites: publishToSites,
            } as any);
            alert("Article approved and published successfully!");
            router.push("/ceo/articles?status=published");
        } catch (error: any) {
            const message = error.response?.data?.message || "Failed to approve article";
            alert(`Error: ${message}`);
        } finally {
            setIsApproving(false);
            setShowApproveDialog(false);
        }
    };

    const handleReject = async () => {
        if (!article || !id) return;
        setIsRejecting(true);
        try {
            await updateArticle(id, {
                status: "rejected",
            });
            alert("Article has been rejected.");
            router.push("/ceo/articles?status=rejected");
        } catch (error: any) {
            const message = error.response?.data?.message || "Failed to reject article";
            alert(`Error: ${message}`);
        } finally {
            setIsRejecting(false);
            setShowRejectDialog(false);
        }
    };

    if (isLoading)
        return (
            <div className="p-20 text-center text-[#6b7280]">Loading article details...</div>
        );
    if (!article)
        return (
            <div className="p-20 text-center">
                <h2 className="text-2xl font-bold mb-4">Article Not Found</h2>
                <button
                    onClick={() => router.push("/ceo/articles")}
                    className="text-[#C10007] hover:underline"
                >
                    Back to Articles
                </button>
            </div>
        );

    const isEdited = article.status === "edited";
    const isPublished = article.status === "published";
    const isRejected = article.status === "rejected";

    const content = article.content || article.summary || "";
    const hasContentBlocks =
        Array.isArray(article.content_blocks) && article.content_blocks.length > 0;

    return (
        <div className="min-h-screen bg-[#f9fafb]">
            <div className="max-w-[1400px] mx-auto px-6 py-8">
                <div className="mb-6 flex items-center justify-between">
                    <ArticleBreadcrumb
                        homeLabel="Article Review"
                        homeHref={from}
                        category="Details"
                        categoryHref="#"
                    />
                    <button
                        onClick={() => router.push(from)}
                        className="flex items-center gap-2 text-[14px] text-[#6b7280] hover:text-[#111827] font-medium transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back to List
                    </button>
                </div>

                <div className="flex gap-8">
                    <div className="flex-1 max-w-[800px]">
                        <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-8 shadow-[0px_1px_3px_rgba(0,0,0,0.05)] mb-8">
                            <article>
                                <div className="mb-6 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="px-3 py-1 bg-white border border-[#e5e7eb] rounded-[4px] text-[12px] font-semibold text-[#111827] tracking-[-0.5px] uppercase">
                                            {article.category}
                                        </span>
                                        <span className="text-[14px] text-[#e5e7eb]">|</span>
                                        <span className="text-[12px] font-semibold text-[#111827] tracking-[-0.5px] uppercase">
                                            {article.country}
                                        </span>
                                    </div>
                                    <StatusBadge status={article.status as any} />
                                </div>

                                <h1 className="text-[32px] font-bold text-[#111827] leading-[44px] tracking-[-0.5px] mb-4">
                                    {article.title}
                                </h1>

                                <div className="flex items-center gap-4 mb-6 text-[14px] text-[#6b7280] tracking-[-0.5px]">
                                    <span className="font-medium text-[#111827]">
                                        By {article.author || "HOMESPH NEWS"}
                                    </span>
                                    <span className="text-[#e5e7eb]">|</span>
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4" />
                                        <span>
                                            {new Date(article.created_at || "").toLocaleDateString(
                                                "en-US",
                                                { year: "numeric", month: "long", day: "numeric" }
                                            )}
                                        </span>
                                    </div>
                                </div>

                                {article.image && (
                                    <figure className="mb-8">
                                        <img
                                            src={article.image}
                                            alt={article.title}
                                            className="w-full aspect-[16/9] object-cover rounded-[8px]"
                                        />
                                    </figure>
                                )}

                                <div className="prose prose-lg max-w-none">
                                    {hasContentBlocks ? (
                                        <div className="space-y-6">
                                            {article.content_blocks?.map((block: any, idx: number) => (
                                                <div key={idx} className="mb-4">
                                                    {block.type === 'text' && (
                                                        <div dangerouslySetInnerHTML={{ __html: block.content?.text || block.content }} />
                                                    )}
                                                    {block.type === 'image' && (
                                                        <img src={block.content?.src || block.image} className="w-full rounded-lg" />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div dangerouslySetInnerHTML={{ __html: content }} />
                                    )}
                                </div>
                            </article>
                        </div>
                    </div>

                    <aside className="w-[320px] flex-shrink-0 space-y-6">
                        <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-6 shadow-sm sticky top-8">
                            <h3 className="text-[16px] font-semibold text-[#111827] mb-2 tracking-[-0.5px]">
                                CEO Review Panel
                            </h3>
                            <p className="text-[13px] text-[#6b7280] mb-5 leading-relaxed">
                                Review this article and decide whether to publish it or reject it back to the editor.
                            </p>

                            {isEdited && (
                                <>
                                    <h4 className="text-[13px] font-semibold text-[#374151] mb-3 tracking-[-0.5px]">
                                        Select websites for publication:
                                    </h4>
                                    <div className="space-y-2 mb-6">
                                        {availableSites.map((site) => (
                                            <label key={site} className="flex items-center gap-3 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    checked={publishToSites.includes(site)}
                                                    onChange={() => toggleSite(site)}
                                                    className="w-4 h-4 rounded border-[#d1d5db] text-[#C10007] focus:ring-[#C10007]"
                                                />
                                                <span className="text-[13px] text-[#374151] group-hover:text-[#C10007] transition-colors">
                                                    {site}
                                                </span>
                                            </label>
                                        ))}
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <button
                                            onClick={() => setShowApproveDialog(true)}
                                            disabled={isApproving}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-[8px] text-[14px] font-semibold hover:bg-emerald-700 transition-all active:scale-95 shadow-sm disabled:opacity-50"
                                        >
                                            {isApproving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                            Approve & Publish
                                        </button>
                                        <button
                                            onClick={() => setShowRejectDialog(true)}
                                            disabled={isRejecting}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-red-200 text-red-600 rounded-[8px] text-[14px] font-semibold hover:bg-red-50 transition-all active:scale-95 disabled:opacity-50"
                                        >
                                            {isRejecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                                            Reject Article
                                        </button>
                                    </div>
                                </>
                            )}

                            {!isEdited && (
                                <div className={cn(
                                    "p-4 rounded-lg flex items-start gap-3",
                                    isPublished ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-red-50 text-red-700 border border-red-100"
                                )}>
                                    {isPublished ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <XCircle className="w-5 h-5 flex-shrink-0" />}
                                    <div>
                                        <p className="text-[13px] font-bold mb-1">Article {isPublished ? 'Published' : 'Rejected'}</p>
                                        <p className="text-[12px] opacity-90 leading-relaxed"> This article has already been {isPublished ? 'approved and published' : 'rejected'}.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </aside>
                </div>
            </div>

            {/* Dialogs */}
            <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-emerald-600">Confirm Publication</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to approve and publish this article to {publishToSites.length} site(s)? This action will make the article live.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleApprove} className="bg-emerald-600 hover:bg-emerald-700">Confirm & Publish</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-red-600">Confirm Rejection</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to reject this article? It will be sent back to the editor with a rejected status.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleReject} className="bg-red-600 hover:bg-red-700">Confirm Rejection</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

export default function CEOArticleDetailPage() {
    return (
        <Suspense fallback={<div className="p-20 text-center text-[#6b7280]">Loading article details...</div>}>
            <CEOArticleDetailContent />
        </Suspense>
    );
}
