"use client";

import { useState, useEffect } from 'react';
import { decodeHtml } from "@/lib/utils";
import { useParams, useRouter } from 'next/navigation';
import { Calendar, Eye, Clock, Building2 } from 'lucide-react';

import { ArticleResource } from "@/lib/api-v2/types/ArticleResource";
import { getAdminArticleById } from "@/lib/api-v2/admin/service/article/getAdminArticleById";
import StatusBadge from "@/components/features/admin/shared/StatusBadge";
import ArticleBreadcrumb from "@/components/features/article/ArticleBreadcrumb";

/**
 * Subscriber Article Details - View only mode
 */
export default function SubscriberArticleDetailsPage() {
    const params = useParams();
    const router = useRouter();

    const [article, setArticle] = useState<ArticleResource | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchArticle = async () => {
            if (!params.id) return;
            setIsLoading(true);
            try {
                const response = await getAdminArticleById(Array.isArray(params.id) ? params.id[0] : params.id);
                const articleData = response.data.data ?? response.data;
                setArticle(articleData as ArticleResource);
            } catch (e) {
                console.error("Failed to fetch article", e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchArticle();
    }, [params.id]);

    if (isLoading) return <div className="p-20 text-center text-[#6b7280]">Loading article...</div>;
    if (!article) return (
        <div className="p-20 text-center">
            <h2 className="text-2xl font-bold mb-4">Article Not Found</h2>
            <button onClick={() => router.push('/subscriber/articles')} className="text-[#C10007] hover:underline">
                Back to Articles
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f9fafb]">
            <div className="max-w-[1400px] mx-auto px-6 py-8">
                <div className="mb-6">
                    <ArticleBreadcrumb homeLabel="Article" homeHref="/subscriber/articles" category="Details" categoryHref="#" />
                </div>

                <div className="flex gap-8">
                    <div className="flex-1 max-w-[900px]">
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

                                <div className="w-full aspect-[16/9] overflow-hidden bg-gray-100 rounded-[8px] mb-8">
                                    <img
                                        src={article.image || 'https://placehold.co/1200x675/e5e7eb/666666?text=No+Image+Available'}
                                        alt={article.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="prose prose-lg max-w-none prose-p:text-[#374151] prose-p:leading-[28px] prose-p:tracking-[-0.5px]">
                                    <div
                                        className="text-[18px] text-[#374151] leading-[32px] tracking-[-0.5px] [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:mb-4 [&>h2]:text-xl [&>h2]:font-bold [&>h2]:mb-3 [&>ul]:list-disc [&>ul]:ml-6 [&>ol]:list-decimal [&>ol]:ml-6 [&>li]:mb-1 [&>a]:text-blue-600 [&>a]:underline first-letter:text-[72px] first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:mt-[-5px] first-letter:leading-[0.8] first-letter:text-[#0c0c0c]"
                                        dangerouslySetInnerHTML={{ __html: decodeHtml(article.content || article.summary || '') }}
                                    />
                                </div>
                            </article>
                        </div>
                    </div>

                    <aside className="w-[320px] flex-shrink-0 space-y-6">
                        <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-6 shadow-sm">
                            <h3 className="text-[16px] font-semibold text-[#111827] mb-4 tracking-[-0.5px]">Details</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-[#6b7280]" />
                                        <span className="text-[14px] text-[#6b7280]">Read time</span>
                                    </div>
                                    <span className="text-[14px] font-bold text-[#111827]">~{article.read_time || '5 min'}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Building2 className="w-4 h-4 text-[#6b7280]" />
                                        <span className="text-[14px] text-[#6b7280]">Source</span>
                                    </div>
                                    <span className="text-[14px] font-bold text-[#111827] truncate max-w-[120px]">
                                        {article.source || 'HomesPh News'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {article.topics && article.topics.length > 0 && (
                            <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-6 shadow-sm">
                                <h3 className="text-[16px] font-semibold text-[#111827] mb-4 tracking-[-0.5px]">Topics</h3>
                                <div className="flex flex-wrap gap-2">
                                    {article.topics.map((topic, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-gray-100 rounded text-[12px] font-medium text-gray-700">
                                            {topic}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </aside>
                </div>
            </div>
        </div>
    );
}
