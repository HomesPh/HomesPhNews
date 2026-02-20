"use client";

import { useState, useEffect } from 'react';
import { cn, decodeHtml, formatViews, calculateReadTime, sanitizeImageUrl } from "@/lib/utils";
import { useParams, useRouter } from 'next/navigation';
import { Calendar, Eye, Clock, Building2, Globe, CheckCircle2, BookOpen, ArrowLeft, ExternalLink } from 'lucide-react';
import { ArticleResource } from "@/lib/api-v2/types/ArticleResource";
import AXIOS_INSTANCE_ADMIN from "@/lib/api-v2/admin/axios-instance";

export default function SubscriberArticleDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const articleId = Array.isArray(params.id) ? params.id[0] : params.id;

    const [article, setArticle] = useState<ArticleResource | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [siteName, setSiteName] = useState('');
    const [siteUrl, setSiteUrl] = useState('');
    const [isOnSite, setIsOnSite] = useState(false);

    useEffect(() => {
        try {
            const prefs = JSON.parse(localStorage.getItem('user_preferences') || '{}');
            setSiteName(prefs.customization?.siteName || '');
            setSiteUrl(prefs.customization?.siteUrl || '');
        } catch { }

        if (articleId) {
            const stored = JSON.parse(localStorage.getItem('subscriber_site_articles') || '[]');
            setIsOnSite((stored as string[]).includes(articleId));
        }
    }, [articleId]);

    useEffect(() => {
        const fetchArticle = async () => {
            if (!articleId) return;
            setIsLoading(true);
            try {
                const response = await AXIOS_INSTANCE_ADMIN.get<ArticleResource>(`/v1/subscriber/articles/${articleId}`);
                // Handle both direct and wrapped response
                const data = (response.data as any)?.data ?? response.data;
                setArticle(data as ArticleResource);
            } catch (e) {
                console.error("Failed to fetch article", e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchArticle();
    }, [articleId]);

    const handleToggleSite = () => {
        if (!articleId) return;
        const stored: string[] = JSON.parse(localStorage.getItem('subscriber_site_articles') || '[]');
        const updated = isOnSite ? stored.filter(id => id !== articleId) : [...stored, articleId];
        localStorage.setItem('subscriber_site_articles', JSON.stringify(updated));
        setIsOnSite(!isOnSite);
    };

    if (isLoading) return (
        <div className="p-20 text-center text-[#6b7280]">
            <div className="inline-block w-8 h-8 border-4 border-[#e5e7eb] border-t-[#C10007] rounded-full animate-spin mb-4" />
            <p>Loading article...</p>
        </div>
    );

    if (!article) return (
        <div className="p-20 text-center">
            <h2 className="text-2xl font-bold mb-4">Article Not Found</h2>
            <button onClick={() => router.push('/subscriber/articles')} className="text-[#C10007] hover:underline">
                ← Back to Articles
            </button>
        </div>
    );

    // ── Image logic (same as admin: skip featured image if content already has it) ──
    const rawImage = article.image_url || article.image || '';
    const imageUrl = sanitizeImageUrl(rawImage);
    const dateStr = article.date || article.created_at || '';
    const content = article.content || article.summary || '';
    const hasContentBlocks = Array.isArray(article.content_blocks) && article.content_blocks.length > 0;

    const firstImageMatch = content.match(/<img[^>]+src=['"]([^'"]+)['"]/);
    const isDuplicateImage = firstImageMatch && rawImage && (
        firstImageMatch[1] === rawImage ||
        decodeURIComponent(firstImageMatch[1]) === decodeURIComponent(rawImage)
    );
    const shouldShowFeatureImage = imageUrl && !isDuplicateImage;

    const topics: string[] = article.topics || [];

    return (
        <div className="min-h-screen bg-[#f9fafb]">
            <div className="max-w-[1400px] mx-auto px-6 py-8">
                {/* Back link */}
                <button
                    onClick={() => router.push('/subscriber/articles')}
                    className="flex items-center gap-2 text-[14px] text-[#6b7280] hover:text-[#111827] transition-colors mb-6"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Article Library
                </button>

                <div className="flex gap-8">
                    {/* ── Main Content ── */}
                    <div className="flex-1 max-w-[800px]">
                        {/* Article card */}
                        <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-8 shadow-[0px_1px_3px_rgba(0,0,0,0.05)] mb-8">
                            <article>
                                {/* Category + Country + Status */}
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
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 border border-green-200 text-green-700 text-[12px] font-semibold rounded-full">
                                        <CheckCircle2 className="w-3.5 h-3.5" />Available
                                    </span>
                                </div>

                                {/* Title */}
                                <h1 className="text-[32px] font-bold text-[#111827] leading-[44px] tracking-[-0.5px] mb-4">
                                    {article.title}
                                </h1>

                                {/* Meta */}
                                <div className="flex items-center gap-4 mb-6 text-[14px] text-[#6b7280] tracking-[-0.5px]">
                                    <span className="font-medium text-[#111827]">
                                        By {article.source || 'HomesPh News'}
                                    </span>
                                    <span className="text-[#e5e7eb]">|</span>
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4" />
                                        <span>{dateStr ? new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Unknown date'}</span>
                                    </div>
                                    <span className="text-[#e5e7eb]">|</span>
                                    <div className="flex items-center gap-1.5">
                                        <Eye className="w-4 h-4" />
                                        <span>{formatViews(article.views_count || 0)} views</span>
                                    </div>
                                </div>

                                {/* Feature image + content — same duplicate-detection logic as admin */}
                                {(() => {
                                    return (
                                        <>
                                            {/* Featured image — only shown if NOT already in content */}
                                            {shouldShowFeatureImage && (
                                                <figure className="mb-8">
                                                    <div className="w-full aspect-[16/9] overflow-hidden bg-gray-100 rounded-[8px] mb-3">
                                                        <img
                                                            src={imageUrl}
                                                            alt={article.title}
                                                            className="w-full h-full object-cover"
                                                            style={{ objectPosition: `${article.image_position_x ?? 50}% ${article.image_position ?? 0}%` }}
                                                            onError={(e) => { e.currentTarget.src = 'https://placehold.co/1200x675/e5e7eb/666666?text=No+Image'; }}
                                                        />
                                                    </div>
                                                    <figcaption className="text-[13px] text-[#6b7280] italic leading-relaxed">
                                                        {article.title} — {article.country}
                                                    </figcaption>
                                                </figure>
                                            )}

                                            {/* Main content area */}
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
                                                                            dangerouslySetInnerHTML={{ __html: blockContent?.text || blockContent || '' }}
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
                                                                            <div style={blockStyle} className="flex-1 text-[18px] text-[#374151] leading-[32px]" dangerouslySetInnerHTML={{ __html: decodeHtml(blockContent?.text || blockContent || '') }} />
                                                                        </div>
                                                                    )}
                                                                    {type === 'grid' && (
                                                                        <div className={cn("my-8 grid gap-4", (blockContent?.images?.length === 3) ? "grid-cols-3" : "grid-cols-2")}>
                                                                            {blockContent?.images?.map((img: string, i: number) => (
                                                                                <img key={i} src={img} className="w-full aspect-square object-cover rounded-xl shadow-sm" />
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

                        {/* ── Topics + Source card (below article, same as admin) ── */}
                        {(topics.length > 0 || article.original_url) && (
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
                                            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                                            {article.original_url.length > 80 ? article.original_url.substring(0, 80) + '...' : article.original_url}
                                        </a>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* ── Sidebar ── */}
                    <aside className="w-[320px] flex-shrink-0 space-y-6">
                        {/* Publish to Site */}
                        <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-6 shadow-sm">
                            <h3 className="text-[16px] font-bold text-[#111827] mb-1 tracking-[-0.5px]">
                                Publish to Site
                            </h3>
                            <p className="text-[13px] text-[#6b7280] mb-5">
                                {siteName
                                    ? <>Control whether this article appears on <strong>{siteName}</strong>.</>
                                    : 'Add this article to your subscriber site.'}
                            </p>

                            <button
                                onClick={handleToggleSite}
                                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-[8px] text-[14px] font-semibold transition-all border-2
                                    ${isOnSite
                                        ? 'bg-green-50 border-green-300 text-green-700 hover:bg-red-50 hover:border-red-300 hover:text-red-600'
                                        : 'bg-[#C10007] border-[#C10007] text-white hover:bg-[#a50006]'
                                    }`}
                            >
                                {isOnSite
                                    ? <><CheckCircle2 className="w-4 h-4" /> Published to Site</>
                                    : <><BookOpen className="w-4 h-4" /> Add to My Site</>
                                }
                            </button>

                            {isOnSite && siteName && siteUrl && (
                                <a href={siteUrl} target="_blank" rel="noopener noreferrer"
                                    className="mt-3 flex items-center justify-center gap-1.5 text-[13px] text-blue-600 hover:underline">
                                    <Globe className="w-3.5 h-3.5" />View on {siteName}<ExternalLink className="w-3 h-3" />
                                </a>
                            )}
                            {isOnSite && (
                                <p className="mt-3 text-center text-[12px] text-[#6b7280]">Click again to remove from your site.</p>
                            )}
                        </div>

                        {/* Article Statistics */}
                        <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-6 shadow-sm">
                            <h3 className="text-[16px] font-semibold text-[#111827] mb-4 tracking-[-0.5px]">Article Statistics</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Eye className="w-4 h-4 text-[#6b7280]" />
                                        <span className="text-[14px] text-[#6b7280]">Total Views</span>
                                    </div>
                                    <span className="text-[18px] font-bold text-[#111827]">{formatViews(article.views_count || 0)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-[#6b7280]" />
                                        <span className="text-[14px] text-[#6b7280]">Read Time</span>
                                    </div>
                                    <span className="text-[14px] font-bold text-[#111827]">{calculateReadTime(content)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Building2 className="w-4 h-4 text-[#6b7280]" />
                                        <span className="text-[14px] text-[#6b7280]">Source</span>
                                    </div>
                                    <span className="text-[14px] font-bold text-[#111827] truncate max-w-[130px]">{article.source || 'HomesPh News'}</span>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
