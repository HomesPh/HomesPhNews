"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/api-v2";
import { cn, decodeHtml, formatParagraphs } from "@/lib/utils";
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
            <div className="p-8 sm:p-20 text-center">
                <h2 className="text-xl sm:text-2xl font-bold mb-4">Article Not Found</h2>
                <button
                    onClick={() => router.push("/ceo/articles")}
                    className="text-[#1428AE] hover:underline"
                >
                    Back to Articles
                </button>
            </div>
        );

    const isEdited = article.status === "edited";
    const isPending = article.status === "pending" || article.status === "pending review";
    const isPublished = article.status === "published";
    const isRejected = article.status === "rejected";

    const content = article.content || article.summary || "";
    const hasContentBlocks =
        Array.isArray(article.content_blocks) && article.content_blocks.length > 0;

    return (
        <div className="min-h-screen bg-[#f9fafb]">
            <div className="w-full px-4 py-6 sm:px-8 sm:py-8">
                <div className="flex flex-row items-center justify-between mb-6 gap-2">
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

                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1 min-w-0 order-2 lg:order-1">
                        <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-4 sm:p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.05)] mb-8">
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

                                <h1 className="text-2xl sm:text-[32px] font-bold text-[#111827] leading-tight sm:leading-[44px] tracking-tight sm:tracking-[-0.5px] mb-4">
                                    {article.title}
                                </h1>

                                <div className="flex flex-wrap items-center gap-4 mb-6 text-[14px] text-[#6b7280] tracking-[-0.5px]">
                                    <span className="font-medium text-[#111827]">
                                        By {article.author || "HOMESPH NEWS"}
                                    </span>
                                    {article.editor_first_name && (
                                        <>
                                            <span className="text-[#e5e7eb]">|</span>
                                            <span className="font-semibold text-[#1428AE]">
                                                Edited by {article.editor_first_name} {article.editor_last_name}
                                            </span>
                                        </>
                                    )}
                                    <span className="text-[#e5e7eb]">|</span>
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4" />
                                        <span>
                                            {new Date(article.published_at || article.created_at || "").toLocaleDateString(
                                                "en-US",
                                                { year: "numeric", month: "long", day: "numeric" }
                                            )}
                                        </span>
                                    </div>
                                </div>

                                {(() => {
                                    const content = article.content || article.summary || '';
                                    const decodedContent = content; // Use raw content directly

                                    // Check if content already starts with the feature image to avoid duplication
                                    const firstImageMatch = decodedContent.match(/<img[^>]+src=['"]([^'"]+)['"]/);
                                    const isDuplicateImage = firstImageMatch && article.image && (
                                        firstImageMatch[1] === article.image ||
                                        decodeURIComponent(firstImageMatch[1]) === decodeURIComponent(article.image)
                                    );

                                    const hasContentBlocks = Array.isArray(article.content_blocks) && article.content_blocks.length > 0;
                                    const shouldShowFeatureImage = article.image && !isDuplicateImage;

                                    return (
                                        <>
                                            {/* Feature Image - only if not redundant */}
                                            {shouldShowFeatureImage && (
                                                <figure className="mb-8">
                                                    <div className="w-full aspect-[16/9] overflow-hidden bg-gray-100 rounded-[8px] mb-3">
                                                        <img
                                                            src={article.image || 'https://placehold.co/1200x675/e5e7eb/666666?text=No+Image+Available'}
                                                            alt={article.title}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => { e.currentTarget.src = 'https://placehold.co/1200x675/e5e7eb/666666?text=No+Image+Available'; }}
                                                        />
                                                    </div>
                                                    <figcaption className="text-[13px] text-[#6b7280] italic leading-relaxed">
                                                        {article.title} — {article.country}
                                                    </figcaption>
                                                </figure>
                                            )}

                                            {/* Main Content Area */}
                                            <div className="prose prose-lg max-w-none prose-p:text-[#374151] prose-p:leading-[28px] prose-p:tracking-[-0.5px]">
                                                {hasContentBlocks ? (
                                                    <div className="space-y-6">
                                                        {article.content_blocks?.map((block: any, idx: number) => {
                                                            const { type, content: blockContent, settings } = block;
                                                            const blockStyle = {
                                                                textAlign: settings?.textAlign || 'left',
                                                                fontSize: settings?.fontSize || '18px',
                                                                color: settings?.color || 'inherit',
                                                                fontWeight: settings?.fontWeight || 'normal',
                                                                fontStyle: settings?.isItalic ? 'italic' : 'normal',
                                                                textDecoration: settings?.isUnderline ? 'underline' : 'none',
                                                            } as React.CSSProperties;

                                                            return (
                                                                <div key={block.id || idx} className="mb-8">
                                                                    {type === 'text' && (
                                                                        <div
                                                                            style={blockStyle}
                                                                            className={cn(
                                                                                "whitespace-pre-wrap text-[18px] text-[#374151] leading-[32px] tracking-[-0.5px] [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:mb-4 [&>h2]:text-xl [&>h2]:font-bold [&>h2]:mb-3 [&_p]:min-h-[1.5em]",
                                                                                settings?.listType === 'bullet' && "list-disc ml-6",
                                                                                settings?.listType === 'number' && "list-decimal ml-6"
                                                                            )}
                                                                            dangerouslySetInnerHTML={{ __html: formatParagraphs(blockContent?.text || blockContent || '') }}
                                                                        />
                                                                    )}
                                                                    {(type === 'image' || type === 'centered-image') && (
                                                                        <figure className={cn("my-8", type === 'centered-image' && "max-w-[80%] mx-auto text-center")}>
                                                                            <img src={blockContent?.src || block.image} alt={blockContent?.caption || block.caption || ""} className="w-full rounded-xl shadow-sm border border-gray-100" />
                                                                            {(blockContent?.caption || block.caption) && (
                                                                                <figcaption className="text-sm text-center text-gray-400 mt-3 italic">{blockContent?.caption || block.caption}</figcaption>
                                                                            )}
                                                                        </figure>
                                                                    )}
                                                                    {(type === 'left-image' || type === 'right-image') && (
                                                                        <div className={cn("my-10 flex gap-8 items-start flex-col md:flex-row", type === 'right-image' && "md:flex-row-reverse")}>
                                                                            <div className="w-full md:w-[200px] shrink-0">
                                                                                <img src={blockContent?.image || blockContent?.src || block.image} alt="" className="w-full aspect-square object-cover rounded-xl shadow-sm" />
                                                                                {(blockContent?.caption || block.caption) && (
                                                                                    <p className="text-[11px] text-gray-400 mt-2 italic text-center leading-tight">{blockContent?.caption || block.caption}</p>
                                                                                )}
                                                                            </div>
                                                                            <div style={blockStyle} className="flex-1 text-[18px] text-[#374151] leading-[32px]" dangerouslySetInnerHTML={{ __html: formatParagraphs(decodeHtml(blockContent?.text || blockContent || '')) }} />
                                                                        </div>
                                                                    )}
                                                                    {type === 'grid' && (
                                                                        <div className={cn(
                                                                            "my-8 grid gap-4",
                                                                            (blockContent?.images?.length === 3) ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2"
                                                                        )}>
                                                                            {blockContent?.images?.map((img: string, i: number) => (
                                                                                <img key={i} src={img} className="w-full aspect-square object-cover rounded-xl shadow-sm" />
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                    {type === 'dynamic-images' && (
                                                                        <div className="my-8 space-y-4">
                                                                            {blockContent?.images?.map((img: string, i: number) => (
                                                                                <img key={i} src={img} className="w-full rounded-xl shadow-sm" />
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                ) : (
                                                    <div
                                                        className="whitespace-pre-wrap text-[18px] text-[#374151] leading-[32px] tracking-[-0.5px] [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:mb-4 [&>h2]:text-xl [&>h2]:font-bold [&>h2]:mb-3 [&>ul]:list-disc [&>ul]:ml-6 [&>ol]:list-decimal [&>ol]:ml-6 [&>li]:mb-1 [&>a]:text-blue-600 [&>a]:underline first-letter:text-[72px] first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:mt-[-5px] first-letter:leading-[0.8] first-letter:text-[#0c0c0c] [&_p]:min-h-[1.5em]"
                                                        dangerouslySetInnerHTML={{ __html: formatParagraphs(decodedContent) }}
                                                    />
                                                )}
                                            </div>
                                        </>
                                    );
                                })()}
                            </article>
                        </div>

                        {/* Topics Container */}
                        {(() => {
                            const topics = article.topics || [];
                            if (topics.length === 0 && !article.original_url) return null;

                            return (
                                <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.05)]">
                                    {topics.length > 0 && (
                                        <>
                                            <h3 className="text-[14px] font-semibold text-[#111827] mb-4 tracking-[-0.5px]">Topics:</h3>
                                            <div className="flex flex-wrap gap-2 mb-6">
                                                {topics.map((topic, idx) => (
                                                    <span key={idx} className="px-3 py-1.5 bg-[#f3f4f6] rounded-[4px] text-[12px] text-[#374151] tracking-[-0.5px] font-medium">
                                                        {topic}
                                                    </span>
                                                ))}
                                            </div>
                                        </>
                                    )}

                                    {article.original_url && (
                                        <div className={topics.length > 0 ? "pt-6 border-t border-[#e5e7eb]" : ""}>
                                            <h3 className="text-[14px] font-semibold text-[#111827] mb-3 tracking-[-0.5px]">Source:</h3>
                                            <a
                                                href={article.original_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-[13px] text-[#3b82f6] hover:underline break-all"
                                            >
                                                <ExternalLink className="w-3.5 h-3.5" />
                                                {article.original_url.length > 60 ? article.original_url.substring(0, 60) + "..." : article.original_url}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            );
                        })()}
                    </div>

                    <aside className="w-full lg:w-[320px] flex-shrink-0 space-y-6 order-1 lg:order-2">
                        <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-5 sm:p-6 shadow-sm lg:sticky lg:top-8">
                            <h3 className="text-[16px] font-semibold text-[#111827] mb-2 tracking-[-0.5px]">
                                CEO Review Panel
                            </h3>
                            <p className="text-[13px] text-[#6b7280] mb-5 leading-relaxed">
                                Review this article and decide whether to publish it or reject it back to the editor.
                            </p>

                            {(isEdited || isPending) && (
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
                                                    className="w-4 h-4 rounded border-[#d1d5db] text-[#1428AE] focus:ring-[#1428AE]"
                                                />
                                                <span className="text-[13px] text-[#374151] group-hover:text-[#1428AE] transition-colors">
                                                    {site}
                                                </span>
                                            </label>
                                        ))}
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <button
                                            onClick={() => setShowApproveDialog(true)}
                                            disabled={isApproving}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#1428AE] text-white rounded-[8px] text-[14px] font-semibold hover:bg-[#000785] transition-all active:scale-95 shadow-sm disabled:opacity-50"
                                        >
                                            {isApproving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                            Publish Article
                                        </button>
                                        {isEdited && (
                                            <button
                                                onClick={() => setShowRejectDialog(true)}
                                                disabled={isRejecting}
                                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-red-200 text-red-600 rounded-[8px] text-[14px] font-semibold hover:bg-red-50 transition-all active:scale-95 disabled:opacity-50"
                                            >
                                                {isRejecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                                                Reject Article
                                            </button>
                                        )}
                                    </div>
                                </>
                            )}

                            {(!isEdited && !isPending) && (
                                <div className={cn(
                                    "p-4 rounded-lg flex items-start gap-3",
                                    isPublished ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                                        isRejected ? "bg-red-50 text-red-700 border border-red-100" :
                                            "bg-amber-50 text-amber-700 border border-amber-100"
                                )}>
                                    {isPublished ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> :
                                        isRejected ? <XCircle className="w-5 h-5 flex-shrink-0" /> :
                                            <Clock className="w-5 h-5 flex-shrink-0 text-amber-600" />}
                                    <div>
                                        <p className="text-[13px] font-bold mb-1">
                                            {isPublished ? 'Article Published' :
                                                isRejected ? 'Article Rejected' :
                                                    'State Unknown'}
                                        </p>
                                        <p className="text-[12px] opacity-90 leading-relaxed">
                                            {isPublished ? 'This article has already been approved and published.' :
                                                isRejected ? 'This article has been rejected and sent back to the editor.' :
                                                    'This article is in an unknown or unexpected state.'}
                                        </p>
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
        <Suspense fallback={<div className="p-8 sm:p-20 text-center text-[#6b7280]">Loading article details...</div>}>
            <CEOArticleDetailContent />
        </Suspense>
    );
}
