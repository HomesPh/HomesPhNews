"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Calendar, Eye, Edit, XCircle, ChevronLeft, Loader2, ExternalLink } from 'lucide-react';
import { ArticleResource } from "@/lib/api-v2/types/ArticleResource";
import { getAdminArticleById } from "@/lib/api-v2/admin/service/article/getAdminArticleById";
import { publishArticle } from "@/lib/api-v2/admin/service/article/publishArticle";
import { deleteArticle } from "@/lib/api-v2/admin/service/article/deleteArticle";
import { restoreArticle } from "@/lib/api-v2/admin/service/article/restoreArticle";
import { Trash2, RotateCcw } from 'lucide-react';
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
export default function ArticleDetailsPage() {
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
    const [customTitles, setCustomTitles] = useState<Record<string, string>>({});
    const [showPublishDialog, setShowPublishDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showRestoreDialog, setShowRestoreDialog] = useState(false);
    const [availableSites, setAvailableSites] = useState<string[]>([]);
    const [publishToSites, setPublishToSites] = useState<string[]>([]);

    useEffect(() => {
        const fetchArticle = async () => {
            if (!params.id) return;
            setIsLoading(true);
            try {
                const response = await getAdminArticleById(Array.isArray(params.id) ? params.id[0] : params.id);
                // Handle both response structures: { data: article } or article directly
                const articleData = response.data.data ?? response.data;
                console.log('Article API response:', response.data);
                setArticle(articleData as ArticleResource);
            } catch (e) {
                console.error("Failed to fetch article", e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchArticle();
    }, [params.id]);

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

                                <div className="prose prose-lg max-w-none prose-p:text-[#374151] prose-p:leading-[28px] prose-p:tracking-[-0.5px]">
                                    {(() => {
                                        const content = article.content || article.summary || '';
                                        const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim());
                                        return paragraphs.map((para, idx) => {
                                            const trimmed = para.trim();
                                            if (!trimmed) return null;
                                            if (idx === 0) {
                                                const firstChar = trimmed.charAt(0);
                                                const restOfText = trimmed.slice(1);
                                                return (
                                                    <p key={idx} className="text-[19px] leading-[32px] text-[#0c0c0c] mb-6 font-normal">
                                                        <span className="float-left text-[72px] leading-[64px] mr-2 mt-1 font-bold text-[#0c0c0c]">{firstChar}</span>
                                                        {restOfText}
                                                    </p>
                                                );
                                            }
                                            return <p key={idx} className="text-[18px] text-[#374151] leading-[32px] tracking-[-0.5px] mb-6">{trimmed}</p>;
                                        });
                                    })()}
                                </div>
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
                            <div className="flex gap-3">
                                <button disabled className="flex-1 px-4 py-2.5 border border-[#d1d5db] rounded-[8px] text-[14px] font-medium text-[#374151] bg-gray-100 opacity-50 cursor-not-allowed tracking-[-0.5px]">Customize</button>
                                <button
                                    onClick={handlePublishClick}
                                    disabled={isPublishing || article.status === 'published'}
                                    className="flex-1 px-4 py-2.5 bg-[#3b82f6] text-white rounded-[8px] text-[14px] font-semibold hover:bg-[#2563eb] transition-all active:scale-95 tracking-[-0.5px] shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isPublishing && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {isPublishing ? 'Publishing...' : (article.status === 'published' ? 'Published' : 'Publish')}
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
                                    <button
                                        onClick={handleRestoreClick}
                                        disabled={isRestoring}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-emerald-200 bg-emerald-50 rounded-[8px] text-[14px] font-medium text-emerald-700 hover:bg-emerald-100 transition-all active:scale-95 tracking-[-0.5px] disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isRestoring ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
                                        {isRestoring ? 'Restoring...' : 'Restore Article'}
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleDeleteClick}
                                        disabled={isDeleting}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-[#d1d5db] rounded-[8px] text-[14px] font-medium text-[#ef4444] hover:bg-red-50 transition-all active:scale-95 tracking-[-0.5px] disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                        {isDeleting ? 'Deleting...' : 'Delete Article'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            <ArticleEditorModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} mode="edit" initialData={article} />
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
        </div>
    );
}
