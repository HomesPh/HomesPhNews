"use client";

import { useState, useEffect, Suspense } from 'react';
import { cn, decodeHtml } from "@/lib/utils";
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from "@/lib/api-v2";
import { Calendar, Eye, Edit, ChevronLeft, Loader2, ExternalLink } from 'lucide-react';

import { ArticleResource } from "@/lib/api-v2/types/ArticleResource";
import { getAdminArticleById } from "@/lib/api-v2/admin/service/article/getAdminArticleById";
import { publishArticle } from "@/lib/api-v2/admin/service/article/publishArticle";
import { deleteArticle } from "@/lib/api-v2/admin/service/article/deleteArticle";
import { restoreArticle } from "@/lib/api-v2/admin/service/article/restoreArticle";
import { hardDeleteArticle } from "@/lib/api-v2/admin/service/article/hardDeleteArticle";
import { Trash2, RotateCcw, ShieldAlert, Send } from 'lucide-react';
import { sendNewsletter } from "@/lib/api-v2/admin/service/article/sendNewsletter";
import ArticleEditorModal from "@/components/features/admin/articles/ArticleEditorModal";
import CustomizeTitlesModal from "@/components/features/admin/articles/CustomizeTitlesModal";
import StatusBadge from "@/components/features/admin/shared/StatusBadge";
import SendNewsletterModal from "@/components/features/admin/articles/SendNewsletterModal";
import ArticleBreadcrumb from "@/components/features/article/ArticleBreadcrumb";
import ShareButtons from "@/components/shared/ShareButtons";
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
import { getSiteNames } from "@/lib/api-v2/admin/service/sites/getSiteNames";

interface ArticleDetailProps {
    id: string;
    backPath?: string;
}

export default function ArticleDetail({ id, backPath }: ArticleDetailProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useAuth();

    // Determine the base path and labels based on the user's role and the current root
    const isAdmin = user?.roles?.includes('admin') || user?.roles?.includes('super-admin');
    const isEditor = user?.roles?.includes('editor') && !isAdmin;

    // Use the provided backPath or default to the appropriate articles list
    const defaultBackPath = isEditor ? '/editor/articles' : '/admin/articles';
    const from = backPath || searchParams.get('from') || defaultBackPath;

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);
    const [article, setArticle] = useState<ArticleResource | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPublishing, setIsPublishing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isRestoring, setIsRestoring] = useState(false);
    const [isHardDeleting, setIsHardDeleting] = useState(false);
    const [customTitles, setCustomTitles] = useState<Record<string, string>>({});
    const [showPublishDialog, setShowPublishDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showRestoreDialog, setShowRestoreDialog] = useState(false);
    const [showHardDeleteDialog, setShowHardDeleteDialog] = useState(false);
    const [availableSites, setAvailableSites] = useState<string[]>([]);
    const [publishToSites, setPublishToSites] = useState<string[]>([]);
    const [isNewsletterModalOpen, setIsNewsletterModalOpen] = useState(false);

    const [availableFilters, setAvailableFilters] = useState<{
        categories: { name: string; count: number }[];
        countries: { name: string; count: number }[];
    }>({
        categories: [],
        countries: [],
    });

    useEffect(() => {
        const fetchArticle = async () => {
            if (!id) return;
            setIsLoading(true);
            try {
                const response = await getAdminArticleById(id);
                const responseData = response.data as any;
                const articleData = responseData.data ?? responseData;

                // If editor tries to access a deleted article, redirect them
                if (isEditor && (articleData.status === 'deleted' || articleData.is_deleted)) {
                    router.push(from);
                    return;
                }

                setArticle(articleData as ArticleResource);

                if (responseData.available_filters) {
                    setAvailableFilters(responseData.available_filters);
                }
            } catch (e) {
                console.error("Failed to fetch article", e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchArticle();
    }, [id, isEditor, router, from]);

    useEffect(() => {
        const fetchFilters = async () => {
            if (availableFilters.categories.length === 0) {
                try {
                    const { getAdminArticles } = await import("@/lib/api-v2/admin/service/article/getAdminArticles");
                    const res = await getAdminArticles({ per_page: 1 });
                    if (res.data.available_filters) {
                        setAvailableFilters(res.data.available_filters);
                    }
                } catch (e) {
                    console.error("Failed to fetch filters in details page", e);
                }
            }
        };
        fetchFilters();
    }, [availableFilters.categories.length]);

    useEffect(() => {
        getSiteNames().then(res => {
            setAvailableSites(res.data as unknown as string[]);
        }).catch(console.error);
    }, []);

    useEffect(() => {
        if (article) {
            const existingSites = Array.isArray(article.published_sites)
                ? article.published_sites
                : (article.published_sites ? [article.published_sites] : []);

            if (isEditor) {
                setPublishToSites(["Main News Portal"]);
            } else if (existingSites.length > 0) {
                setPublishToSites(existingSites);
            } else if (availableSites.length > 0) {
                setPublishToSites(availableSites);
            }
        }
    }, [article, isEditor, availableSites.length]);

    const handlePublishClick = () => {
        if (!article || !id) return;
        if (publishToSites.length === 0) {
            alert('Please select at least one site to publish to.');
            return;
        }
        setShowPublishDialog(true);
    };

    const confirmPublish = async () => {
        setIsPublishing(true);
        try {
            await publishArticle(id, {
                published_sites: publishToSites,
                custom_titles: Object.entries(customTitles).map(([k, v]) => `${k}:${v}`)
            });
            router.push(`${defaultBackPath}?status=published`);
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to publish article';
            alert(`Error: ${message}`);
        } finally {
            setIsPublishing(false);
            setShowPublishDialog(false);
        }
    };

    const handleDeleteClick = () => {
        if (!article || !id) return;
        setShowDeleteDialog(true);
    };

    const confirmDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteArticle(id);
            router.push(`${defaultBackPath}?status=deleted`);
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to delete article';
            alert(`Error: ${message}`);
        } finally {
            setIsDeleting(false);
            setShowDeleteDialog(false);
        }
    };

    const handleRestoreClick = () => {
        if (!article || !id) return;
        setShowRestoreDialog(true);
    };

    const confirmRestore = async () => {
        setIsRestoring(true);
        try {
            await restoreArticle(id);
            router.push(defaultBackPath);
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to restore article';
            alert(`Error: ${message}`);
        } finally {
            setIsRestoring(false);
            setShowRestoreDialog(false);
        }
    };

    const handleHardDeleteClick = () => {
        if (!article || !id) return;
        setShowHardDeleteDialog(true);
    };

    const confirmHardDelete = async () => {
        setIsHardDeleting(true);
        try {
            await hardDeleteArticle(id);
            router.push(defaultBackPath);
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to permanently delete article';
            alert(`Error: ${message}`);
        } finally {
            setIsHardDeleting(false);
            setShowHardDeleteDialog(false);
        }
    };

    const handleSendNewsletter = () => {
        setIsNewsletterModalOpen(true);
    };

    const handleCustomTitlesUpdate = (titles: Record<string, string>) => {
        setCustomTitles(titles);
    };

    const toggleSite = (site: string) => {
        if (publishToSites.includes(site)) {
            setPublishToSites(prev => prev.filter(s => s !== site));
        } else {
            setPublishToSites(prev => [...prev, site]);
        }
    };

    if (isLoading) return <div className="p-20 text-center text-[#6b7280]">Loading article details...</div>;
    if (!article) return (
        <div className="p-20 text-center">
            <h2 className="text-2xl font-bold mb-4">Article Not Found</h2>
            <button onClick={() => router.push(from)} className="text-[#1428AE] hover:underline">
                Back to Articles
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f9fafb]">
            <div className="w-full px-8 py-8">
                <div className="flex items-center justify-between mb-6">
                    <ArticleBreadcrumb homeLabel="Article" homeHref={from} category="Details" categoryHref="#" />
                    <button
                        onClick={() => router.push(from)}
                        className="flex items-center gap-2 text-[14px] text-[#6b7280] hover:text-[#111827] font-medium transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back to List
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1 min-w-0">
                        <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.05)] mb-8">
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
                                    <StatusBadge status={(article.is_redis ? 'being_processed' : article.status) as any} />
                                </div>

                                <h1 className="text-[32px] font-bold text-[#111827] leading-[44px] tracking-[-0.5px] mb-4">
                                    {article.title}
                                </h1>

                                <div className="flex items-center gap-4 mb-6 text-[14px] text-[#6b7280] tracking-[-0.5px]">
                                    <span className="font-medium text-[#111827]">
                                        By {article.author || 'HOMESPH NEWS'}
                                    </span>
                                    <span className="text-[#e5e7eb]">|</span>
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4" />
                                        <span>{new Date(article.created_at || '').toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}</span>
                                    </div>
                                    <span className="text-[#e5e7eb]">|</span>
                                    <div className="flex items-center gap-1.5">
                                        <Eye className="w-4 h-4" />
                                        <span>{article.views_count || '0'} views</span>
                                    </div>
                                </div>

                                {(() => {
                                    const content = article.content || article.summary || '';
                                    const firstImageMatch = content.match(/<img[^>]+src=['"]([^'"]+)['"]/);
                                    const isDuplicateImage = firstImageMatch && article.image && (
                                        firstImageMatch[1] === article.image ||
                                        decodeURIComponent(firstImageMatch[1]) === decodeURIComponent(article.image)
                                    );

                                    const hasContentBlocks = Array.isArray(article.content_blocks) && article.content_blocks.length > 0;
                                    const shouldShowFeatureImage = article.image && !isDuplicateImage;

                                    return (
                                        <>
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

                                            <div className="prose prose-lg max-w-none prose-p:text-[#374151] prose-p:leading-[28px] prose-p:tracking-[-0.5px]">
                                                {hasContentBlocks ? (
                                                    <div className="space-y-6">
                                                        {article.content_blocks?.map((block: any, idx: number) => {
                                                            const { type, content, settings } = block;
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
                                                                            dangerouslySetInnerHTML={{ __html: content?.text || content || '' }}

                                                                        />
                                                                    )}

                                                                    {(type === 'image' || type === 'centered-image') && (
                                                                        <figure className={cn("my-8", type === 'centered-image' && "max-w-[80%;] mx-auto text-center")}>
                                                                            <img
                                                                                src={content?.src || block.image}
                                                                                alt={content?.caption || block.caption || ""}
                                                                                className="w-full rounded-xl shadow-sm border border-gray-100"
                                                                            />
                                                                            {(content?.caption || block.caption) && (
                                                                                <figcaption className="text-sm text-center text-gray-400 mt-3 italic">
                                                                                    {content?.caption || block.caption}
                                                                                </figcaption>
                                                                            )}
                                                                        </figure>
                                                                    )}

                                                                    {(type === 'left-image' || type === 'right-image') && (
                                                                        <div className={cn(
                                                                            "my-10 flex gap-8 items-start flex-col md:flex-row",
                                                                            type === 'right-image' && "md:flex-row-reverse"
                                                                        )}>
                                                                            <div className="w-full md:w-[200px] shrink-0">
                                                                                <img
                                                                                    src={content?.image || content?.src || block.image}
                                                                                    alt=""
                                                                                    className="w-full aspect-square object-cover rounded-xl shadow-sm"
                                                                                />
                                                                                {(content?.caption || block.caption) && (
                                                                                    <p className="text-[11px] text-gray-400 mt-2 italic text-center leading-tight">
                                                                                        {content?.caption || block.caption}
                                                                                    </p>
                                                                                )}
                                                                            </div>
                                                                            <div
                                                                                style={blockStyle}
                                                                                className="flex-1 text-[18px] text-[#374151] leading-[32px]"
                                                                                dangerouslySetInnerHTML={{ __html: decodeHtml(content?.text || content || '') }}
                                                                            />
                                                                        </div>
                                                                    )}

                                                                    {type === 'grid' && (
                                                                        <div className={cn(
                                                                            "my-8 grid gap-4",
                                                                            (content?.images?.length === 3) ? "grid-cols-3" : "grid-cols-2"
                                                                        )}>
                                                                            {content?.images?.map((img: string, i: number) => (
                                                                                <img
                                                                                    key={i}
                                                                                    src={img}
                                                                                    className="w-full aspect-square object-cover rounded-xl shadow-sm"
                                                                                />
                                                                            ))}
                                                                        </div>
                                                                    )}

                                                                    {(type === 'split-left' || type === 'split-right') && (
                                                                        <div className={cn(
                                                                            "my-10 flex flex-col md:flex-row bg-[#f9fafb] rounded-2xl overflow-hidden min-h-[400px]",
                                                                            type === 'split-right' && "md:flex-row-reverse"
                                                                        )}>
                                                                            <div className="flex-1 min-h-[300px]">
                                                                                <img
                                                                                    src={content?.image || block.image}
                                                                                    className="w-full h-full object-cover"
                                                                                />
                                                                            </div>
                                                                            <div
                                                                                style={blockStyle}
                                                                                className="flex-1 p-8 md:p-12 flex items-center text-[20px] text-[#111827] leading-[1.4] font-medium"
                                                                                dangerouslySetInnerHTML={{ __html: decodeHtml(content?.text || content || '') }}
                                                                            />
                                                                        </div>
                                                                    )}

                                                                    {type === 'dynamic-images' && (
                                                                        <div className="my-8 space-y-4">
                                                                            {content?.images?.map((img: string, i: number) => (
                                                                                <img
                                                                                    key={i}
                                                                                    src={img}
                                                                                    className="w-full rounded-xl shadow-sm"
                                                                                />
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
                                                        dangerouslySetInnerHTML={{ __html: content }}
                                                    />
                                                )}
                                            </div>
                                        </>
                                    );
                                })()}
                            </article>
                        </div>

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

                    <aside className="w-full lg:w-[320px] shrink-0 space-y-6">
                        {!isEditor && (
                            <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-6 shadow-sm">
                                <h3 className="text-[16px] font-semibold text-[#111827] mb-4 tracking-[-0.5px]">Publish to:</h3>
                                <div className="space-y-3 mb-6">
                                    {availableSites.map((site) => (
                                        <label key={site} className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={publishToSites.includes(site)}
                                                onChange={() => toggleSite(site)}
                                                disabled={isEditor && site !== "Main News Portal"}
                                                className="w-4 h-4 rounded border-[#d1d5db] text-[#F4AA1D] focus:ring-[#F4AA1D] focus:ring-offset-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                            />
                                            <span className={`text-[14px] ${isEditor && site !== "Main News Portal" ? 'text-gray-400' : 'text-[#374151] group-hover:text-[#1428AE]'} transition-colors tracking-[-0.5px]`}>{site}</span>

                                        </label>
                                    ))}
                                </div>
                                {article.is_redis && (
                                    <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-[12px] text-amber-700 leading-relaxed font-medium">
                                        This article is <strong>Being Processed</strong> (in Redis only) and is not yet in the database. Move it to DB from the Being Processed tab, or click Publish here to save and publish in one step.
                                    </div>
                                )}
                                <div className="flex gap-3">
                                    <button disabled className="flex-1 px-4 py-2.5 border border-[#d1d5db] rounded-[8px] text-[14px] font-medium text-[#374151] bg-gray-100 opacity-50 cursor-not-allowed tracking-[-0.5px]">Customize</button>
                                    <button
                                        onClick={handlePublishClick}
                                        disabled={isPublishing || (article.status === 'published' && !article.is_redis)}
                                        className="flex-1 px-4 py-2.5 bg-[#1428AE] text-white rounded-[8px] text-[14px] font-semibold hover:bg-[#000785] transition-all active:scale-95 tracking-[-0.5px] shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isPublishing && <Loader2 className="w-4 h-4 animate-spin" />}
                                        {isPublishing ? 'Publishing...' : (article.status === 'published' && !article.is_redis ? 'Published' : 'Publish')}
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-6 shadow-sm">
                            <h3 className="text-[16px] font-semibold text-[#111827] mb-4 tracking-[-0.5px]">Article Statistics</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Eye className="w-4 h-4 text-[#6b7280]" />
                                        <span className="text-[14px] text-[#6b7280] tracking-[-0.5px]">Total Views</span>
                                    </div>
                                    <span className="text-[18px] font-bold text-[#111827] tracking-[-0.5px]">{article.views_count || 0}</span>
                                </div>
                                {!isEditor && (
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-[#6b7280]" fill="none" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2" fill="none" /><circle cx="8" cy="8" r="2" fill="currentColor" /></svg>
                                            <span className="text-[14px] text-[#6b7280] tracking-[-0.5px]">Published Sites</span>
                                        </div>
                                        <span className="text-[18px] font-bold text-[#111827] tracking-[-0.5px]">
                                            {Array.isArray(article.published_sites) ? article.published_sites.length : (article.published_sites ? 1 : 0)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {article.status === 'published' && (
                            <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-6 shadow-sm">
                                <h3 className="text-[16px] font-semibold text-[#111827] mb-4 tracking-[-0.5px]">Share Article</h3>
                                <div className="flex items-center gap-4 mb-4">
                                    <button
                                        onClick={() => {
                                            const url = window.location.origin + '/article/' + (article.slug || article.id);
                                            window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(article.title + " " + url)}`, '_blank');
                                        }}
                                        className="size-[18px] cursor-pointer hover:opacity-80 transition-opacity"
                                        title="Share on WhatsApp"
                                    >
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-[#25D366]">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-4.821 8.366A10.066 10.066 0 0 1 8.19 21.99l-.213-.113-4.142 1.086 1.106-4.038-.125-.199a9.957 9.957 0 0 1-1.522-5.304c0-5.513 4.486-10 10-10 2.668 0 5.176 1.037 7.058 2.92a9.92 9.92 0 0 1 2.922 7.06c0 5.513-4.486 10-10 10m8.472-18.472A11.916 11.916 0 0 0 12.651 1.25c-6.605 0-11.977 5.372-11.977 11.977a11.905 11.905 0 0 0 1.617 6.007l-1.717 6.273 6.42-1.684a11.902 11.902 0 0 0 5.657 1.427h.005c6.605 0 11.977-5.372 11.977-11.977a11.915 11.915 0 0 0-3.511-8.47" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => {
                                            const url = window.location.origin + '/article/' + (article.slug || article.id);
                                            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400');
                                        }}
                                        className="size-[18px] cursor-pointer hover:opacity-80 transition-opacity"
                                        title="Share on Facebook"
                                    >
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-[#1877F2]">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => {
                                            const url = window.location.origin + '/article/' + (article.slug || article.id);
                                            window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400');
                                        }}
                                        className="size-[18px] cursor-pointer hover:opacity-80 transition-opacity"
                                        title="Share on LinkedIn"
                                    >
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-[#0077B5]">
                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                        </svg>
                                    </button>
                                </div>
                                <p className="text-[12px] text-[#6b7280] leading-relaxed">
                                    This article is published. You can share the public link with your network.
                                </p>
                            </div>
                        )}

                        <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-6 shadow-sm">
                            <h3 className="text-[16px] font-semibold text-[#111827] mb-4 tracking-[-0.5px]">Quick Actions</h3>
                            <div className="space-y-3">
                                <button
                                    onClick={() => window.open(`/article/${article.slug || article.id}`, '_blank')}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-[#d1d5db] bg-gray-50 rounded-[8px] text-[14px] font-medium text-[#111827] hover:bg-gray-100 transition-all active:scale-95 tracking-[-0.5px]"
                                >
                                    <Eye className="w-4 h-4" /> Preview
                                </button>
                                <button onClick={() => setIsEditModalOpen(true)} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-[#d1d5db] rounded-[8px] text-[14px] font-medium text-[#374151] hover:bg-gray-50 transition-all active:scale-95 tracking-[-0.5px]">
                                    <Edit className="w-4 h-4" /> Edit Article
                                </button>
                                {article.status === 'published' && !article.is_deleted && !isEditor && (
                                    <button
                                        onClick={handleSendNewsletter}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-[#1428AE] text-[#1428AE] rounded-[8px] text-[14px] font-medium hover:bg-blue-50 transition-all active:scale-95 tracking-[-0.5px]"
                                    >
                                        <Send className="w-4 h-4" />
                                        Send to Subscribers
                                    </button>
                                )}
                                {!isEditor && (
                                    article.is_deleted || article.status === 'deleted' ? (
                                        <div className="space-y-3">
                                            <button
                                                onClick={handleRestoreClick}
                                                disabled={isRestoring}
                                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-emerald-200 bg-emerald-50 rounded-[8px] text-[14px] font-medium text-emerald-700 hover:bg-emerald-100 transition-all active:scale-95 tracking-[-0.5px] disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isRestoring ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
                                                {isRestoring ? 'Restoring...' : 'Restore Article'}
                                            </button>
                                            <button
                                                onClick={handleHardDeleteClick}
                                                disabled={isHardDeleting}
                                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-red-200 bg-red-50 rounded-[8px] text-[14px] font-medium text-red-700 hover:bg-red-100 transition-all active:scale-95 tracking-[-0.5px] disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isHardDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldAlert className="w-4 h-4" />}
                                                {isHardDeleting ? 'Deleting...' : 'Permanent Delete'}
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <button
                                                onClick={handleDeleteClick}
                                                disabled={isDeleting}
                                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-[#d1d5db] rounded-[8px] text-[14px] font-medium text-[#ef4444] hover:bg-red-50 transition-all active:scale-95 tracking-[-0.5px] disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                                {isDeleting ? 'Deleting...' : 'Delete Article'}
                                            </button>
                                            <button
                                                onClick={handleHardDeleteClick}
                                                disabled={isHardDeleting}
                                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-red-100 rounded-[8px] text-[14px] font-medium text-red-600 hover:bg-red-50 transition-all active:scale-95 tracking-[-0.5px] disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isHardDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldAlert className="w-4 h-4" />}
                                                {isHardDeleting ? 'Deleting...' : 'Permanent Delete'}
                                            </button>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            <ArticleEditorModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                mode="edit"
                initialData={article}
                availableCategories={availableFilters.categories}
                availableCountries={availableFilters.countries}
            />
            <CustomizeTitlesModal isOpen={isCustomizeModalOpen} onClose={() => setIsCustomizeModalOpen(false)} publishTo={publishToSites} originalTitle={article.title} onSave={handleCustomTitlesUpdate} />

            <AlertDialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Ready to Publish?</AlertDialogTitle>
                        <AlertDialogDescription>This article will be published to <strong>{publishToSites.length}</strong> selected sites. Are you sure you want to continue?</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmPublish} className="bg-[#1428AE] hover:bg-[#000785]">Confirm Publish</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-red-600">Move to Trash</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to <strong>trash</strong> this article? It will be moved to the Deleted tab and won't be visible to users, but you can restore it later.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">Confirm Trash</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-emerald-600">Restore Article</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to <strong>restore</strong> this article? It will be moved back to its previous status and will be visible again if it was published.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmRestore} className="bg-emerald-600 hover:bg-emerald-700">Confirm Restore</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={showHardDeleteDialog} onOpenChange={setShowHardDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-red-600 flex items-center gap-2">
                            <ShieldAlert className="w-5 h-5" />
                            Permanent Deletion
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This action <strong>CANNOT BE UNDONE</strong>. This will permanently delete the article from the database and Redis. All associated data will be lost forever.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmHardDelete} className="bg-red-600 hover:bg-red-700 text-white border-none">
                            Yes, Delete Forever
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            {article && (
                <SendNewsletterModal
                    isOpen={isNewsletterModalOpen}
                    onClose={() => setIsNewsletterModalOpen(false)}
                    articles={[{
                        id: article.id,
                        title: article.title,
                        category: article.category,
                        country: article.country
                    }]}
                />
            )}
        </div>
    );
}
