"use client";

import { useState, useEffect, Suspense } from 'react';
import { cn, decodeHtml } from "@/lib/utils";
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Calendar, Eye, Edit, XCircle, ChevronLeft, Loader2, ExternalLink } from 'lucide-react';

import { ArticleResource } from "@/lib/api-v2/types/ArticleResource";
import { getAdminArticleById } from "@/lib/api-v2/admin/service/article/getAdminArticleById";
import { publishArticle } from "@/lib/api-v2/admin/service/article/publishArticle";
import { deleteArticle } from "@/lib/api-v2/admin/service/article/deleteArticle";
import { restoreArticle } from "@/lib/api-v2/admin/service/article/restoreArticle";
import { hardDeleteArticle } from "@/lib/api-v2/admin/service/article/hardDeleteArticle";
import { Trash2, RotateCcw, ShieldAlert } from 'lucide-react';
import ArticleEditorModal from "@/components/features/admin/articles/ArticleEditorModal";
import CustomizeTitlesModal from "@/components/features/admin/articles/CustomizeTitlesModal";
import StatusBadge from "@/components/features/admin/shared/StatusBadge";
import ArticleBreadcrumb from "@/components/features/article/ArticleBreadcrumb";
import { Categories, Countries } from "@/app/data";
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { getSiteNames } from "@/lib/api-v2/admin/service/sites/getSiteNames";

/**
 * Article Details Page
 */
function ArticleDetailsContent() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const from = searchParams.get('from') || '/admin/articles';

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

    const [availableFilters, setAvailableFilters] = useState<{
        categories: string[];
        countries: string[];
    }>({
        categories: [],
        countries: [],
    });

    useEffect(() => {
        const fetchArticle = async () => {
            if (!params.id) return;
            setIsLoading(true);
            try {
                const response = await getAdminArticleById(Array.isArray(params.id) ? params.id[0] : params.id);
                const responseData = response.data as any;
                const articleData = responseData.data ?? responseData;
                console.log('Article API response:', responseData);
                setArticle(articleData as ArticleResource);

                // If filters are present in this response, use them
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
    }, [params.id]);

    useEffect(() => {
        // As a fallback, if filters weren't in the article response, fetch them from the general endpoint
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
        getSiteNames().then(res => setAvailableSites(res.data as unknown as string[])).catch(console.error);
    }, []);

    useEffect(() => {
        if (article) {
            const existingSites = Array.isArray(article.published_sites)
                ? article.published_sites
                : (article.published_sites ? [article.published_sites] : []);
            if (existingSites.length > 0) {
                setPublishToSites(existingSites);
            } else if (availableSites.length > 0) {
                setPublishToSites(availableSites);
            }
        }
    }, [article, availableSites.length]);

    const handlePublishClick = () => {
        if (!article || !params.id) return;
        if (publishToSites.length === 0) {
            alert('Please select at least one site to publish to.');
            return;
        }
        setShowPublishDialog(true);
    };

    const confirmPublish = async () => {
        setIsPublishing(true);
        try {
            const articleId = (Array.isArray(params.id) ? params.id[0] : params.id) || '';
            await publishArticle(articleId, {
                published_sites: publishToSites,
                custom_titles: Object.entries(customTitles).map(([k, v]) => `${k}:${v}`) // Assuming format "site:title" for string[]
            });
            router.push('/admin/articles?status=published');
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to publish article';
            alert(`Error: ${message}`);
        } finally {
            setIsPublishing(false);
            setShowPublishDialog(false);
        }
    };

    const handleDeleteClick = () => {
        if (!article || !params.id) return;
        setShowDeleteDialog(true);
    };

    const confirmDelete = async () => {
        setIsDeleting(true);
        try {
            const articleId = (Array.isArray(params.id) ? params.id[0] : params.id) || '';
            await deleteArticle(articleId);
            router.push('/admin/articles?status=deleted');
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to delete article';
            alert(`Error: ${message}`);
        } finally {
            setIsDeleting(false);
            setShowDeleteDialog(false);
        }
    };

    const handleRestoreClick = () => {
        if (!article || !params.id) return;
        setShowRestoreDialog(true);
    };

    const confirmRestore = async () => {
        setIsRestoring(true);
        try {
            const articleId = (Array.isArray(params.id) ? params.id[0] : params.id) || '';
            await restoreArticle(articleId);
            router.push('/admin/articles');
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to restore article';
            alert(`Error: ${message}`);
        } finally {
            setIsRestoring(false);
            setShowRestoreDialog(false);
        }
    };

    const handleHardDeleteClick = () => {
        if (!article || !params.id) return;
        setShowHardDeleteDialog(true);
    };

    const confirmHardDelete = async () => {
        setIsHardDeleting(true);
        try {
            const articleId = (Array.isArray(params.id) ? params.id[0] : params.id) || '';
            await hardDeleteArticle(articleId);
            router.push('/admin/articles');
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to permanently delete article';
            alert(`Error: ${message}`);
        } finally {
            setIsHardDeleting(false);
            setShowHardDeleteDialog(false);
        }
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
            <button onClick={() => router.push('/admin/articles')} className="text-[#C10007] hover:underline">
                Back to Articles
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f9fafb]">
            <div className="max-w-[1400px] mx-auto px-6 py-8">
                <div className="mb-6">
                    <ArticleBreadcrumb homeLabel="Article" homeHref={from} category="Details" categoryHref="#" />
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
                                            {article.country /* Use country as location fallback */}
                                        </span>
                                    </div>
                                    <StatusBadge status={article.status as any} />
                                </div>

                                <h1 className="text-[32px] font-bold text-[#111827] leading-[44px] tracking-[-0.5px] mb-4">
                                    {article.title}
                                </h1>

                                <div className="flex items-center gap-4 mb-6 text-[14px] text-[#6b7280] tracking-[-0.5px]">
                                    <span className="font-medium text-[#111827]">
                                        By {'HomesPh News' /* Default author */}
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
                                    const decodedContent = content; // Use raw content directly

                                    // Check if content already starts with the feature image to avoid duplication

                                    // This is common in scraper data where the first image in HTML matches the header image
                                    const firstImageMatch = decodedContent.match(/<img[^>]+src=['"]([^'"]+)['"]/);
                                    const isDuplicateImage = firstImageMatch && article.image && (
                                        firstImageMatch[1] === article.image ||
                                        decodeURIComponent(firstImageMatch[1]) === decodeURIComponent(article.image)
                                    );

                                    // If we have content blocks AND they seem to be the primary source, use them
                                    const hasContentBlocks = Array.isArray(article.content_blocks) && article.content_blocks.length > 0;

                                    // Determine if we should show the feature image figure
                                    // We skip it if the content already starts with an image figure (legacy HTML)
                                    // OR if the first block is an image that matches (blocks)
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
                                                            const { type, content, settings } = block;
                                                            // Block specific styles from settings
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
                                                                    {/* 1. TEXT BLOCKS */}
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

                                                                    {/* 2. STANDARD IMAGE BLOCKS */}
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

                                                                    {/* 3. LAYOUT BLOCKS: SIDE IMAGES */}
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

                                                                    {/* 4. LAYOUT BLOCKS: GRIDS */}
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

                                                                    {/* 5. LAYOUT BLOCKS: SPLIT VIEW */}
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

                                                                    {/* 6. DYNAMIC IMAGES */}
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
                                                        dangerouslySetInnerHTML={{ __html: decodedContent }}
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
                                <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-8 shadow-[0px_1px_3px_rgba(0,0,0,0.05)]">
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

                    <aside className="w-[320px] flex-shrink-0 space-y-6">
                        <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-6 shadow-sm">
                            <h3 className="text-[16px] font-semibold text-[#111827] mb-4 tracking-[-0.5px]">Publish to:</h3>
                            <div className="space-y-3 mb-6">
                                {availableSites.map((site) => (
                                    <label key={site} className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={publishToSites.includes(site)}
                                            onChange={() => toggleSite(site)}
                                            className="w-4 h-4 rounded border-[#d1d5db] text-[#C10007] focus:ring-[#C10007] focus:ring-offset-0 cursor-pointer"
                                        />
                                        <span className="text-[14px] text-[#374151] group-hover:text-[#C10007] transition-colors tracking-[-0.5px]">{site}</span>
                                    </label>
                                ))}
                            </div>
                            {article.is_redis && (
                                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-[12px] text-amber-700 leading-relaxed font-medium">
                                    This article is currently in the <strong>Pending Review</strong> queue (Redis cached) and is not yet stored in the main database. Click Publish to finalize and store it.
                                </div>
                            )}
                            <div className="flex gap-3">
                                <button disabled className="flex-1 px-4 py-2.5 border border-[#d1d5db] rounded-[8px] text-[14px] font-medium text-[#374151] bg-gray-100 opacity-50 cursor-not-allowed tracking-[-0.5px]">Customize</button>
                                <button
                                    onClick={handlePublishClick}
                                    disabled={isPublishing || (article.status === 'published' && !article.is_redis)}
                                    className="flex-1 px-4 py-2.5 bg-[#3b82f6] text-white rounded-[8px] text-[14px] font-semibold hover:bg-[#2563eb] transition-all active:scale-95 tracking-[-0.5px] shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isPublishing && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {isPublishing ? 'Publishing...' : (article.status === 'published' && !article.is_redis ? 'Published' : 'Publish')}
                                </button>
                            </div>
                        </div>

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
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-[#6b7280]" fill="none" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2" fill="none" /><circle cx="8" cy="8" r="2" fill="currentColor" /></svg>
                                        <span className="text-[14px] text-[#6b7280] tracking-[-0.5px]">Published Sites</span>
                                    </div>
                                    <span className="text-[18px] font-bold text-[#111827] tracking-[-0.5px]">
                                        {Array.isArray(article.published_sites) ? article.published_sites.length : (article.published_sites ? 1 : 0)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-6 shadow-sm">
                            <h3 className="text-[16px] font-semibold text-[#111827] mb-4 tracking-[-0.5px]">Quick Actions</h3>
                            <div className="space-y-3">
                                <button onClick={() => setIsEditModalOpen(true)} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-[#d1d5db] rounded-[8px] text-[14px] font-medium text-[#374151] hover:bg-gray-50 transition-all active:scale-95 tracking-[-0.5px]">
                                    <Edit className="w-4 h-4" /> Edit Article
                                </button>
                                {article.is_deleted || article.status === 'deleted' ? (
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
                        <AlertDialogAction onClick={confirmPublish} className="bg-[#3b82f6] hover:bg-[#2563eb]">Confirm Publish</AlertDialogAction>
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
        </div>
    );
}

export default function ArticleDetailsPage() {
    return (
        <Suspense fallback={<div className="p-20 text-center text-[#6b7280]">Loading article details...</div>}>
            <ArticleDetailsContent />
        </Suspense>
    );
}
