"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Calendar, Eye, Edit, XCircle, ChevronLeft } from 'lucide-react';
import { Article } from "@/app/admin/articles/data";
import { getAdminArticle } from "@/lib/api/admin/articles";
import ArticleEditorModal from "@/components/features/admin/articles/ArticleEditorModal";
import CustomizeTitlesModal from "@/components/features/admin/articles/CustomizeTitlesModal";

/**
 * Article Details Page matching Create Sign In Page design
 */
export default function ArticleDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);

    const [article, setArticle] = useState<Article | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchArticle = async () => {
            if (!params.id) return;
            setIsLoading(true);
            try {
                // Ensure ID is passed as string
                const fetched = await getAdminArticle(Array.isArray(params.id) ? params.id[0] : params.id);
                setArticle(fetched);
            } catch (e) {
                console.error("Failed to fetch article", e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchArticle();
    }, [params.id]);


    const [publishToSites, setPublishToSites] = useState({
        filipinoHomes: true,
        rentPh: true,
        homesPh: true,
        bayanihan: false,
        mainPortal: true,
    });

    if (isLoading) {
        return (
            <div className="p-20 text-center text-[#6b7280]">
                Loading article details...
            </div>
        );
    }

    if (!article) {
        return (
            <div className="p-20 text-center">
                <h2 className="text-2xl font-bold mb-4">Article Not Found</h2>
                <button
                    onClick={() => router.push('/admin/articles')}
                    className="text-[#C10007] hover:underline"
                >
                    Back to Articles
                </button>
            </div>
        );
    }

    const toggleSite = (site: keyof typeof publishToSites) => {
        setPublishToSites(prev => ({ ...prev, [site]: !prev[site] }));
    };

    return (
        <div className="p-8 bg-[#f9fafb] min-h-screen">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-6">
                <button
                    onClick={() => router.push('/admin/articles')}
                    className="text-[14px] text-[#6b7280] hover:text-[#C10007] transition-colors tracking-[-0.5px] flex items-center gap-1 group"
                >
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Articles
                </button>
                <span className="text-[14px] text-[#6b7280]">/</span>
                <span className="text-[14px] text-[#111827] tracking-[-0.5px]">Details</span>
            </div>

            <div className="flex gap-6">
                {/* Main Content */}
                <div className="flex-1">
                    <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-8 shadow-sm">
                        {/* Category and Location */}
                        <div className="flex items-center gap-2 mb-4">
                            <span className="px-3 py-1 bg-white border border-[#e5e7eb] rounded-[4px] text-[12px] font-semibold text-[#111827] tracking-[-0.5px] uppercase">
                                {article.category}
                            </span>
                            <span className="text-[14px] text-[#111827]">|</span>
                            <span className="text-[12px] font-semibold text-[#111827] tracking-[-0.5px] uppercase">
                                {article.location}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-[32px] font-bold text-[#111827] leading-[44px] tracking-[-0.5px] mb-3">
                            {article.title}
                        </h1>

                        {/* Description */}
                        <p className="text-[16px] text-[#6b7280] leading-[24px] tracking-[-0.5px] mb-6">
                            {article.description}
                        </p>

                        {/* Metadata */}
                        <div className="flex items-center gap-4 mb-6 text-[14px] text-[#6b7280] tracking-[-0.5px]">
                            <span>By {article.author || 'Author'}</span>
                            <div className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4" />
                                <span>{article.date}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Eye className="w-4 h-4" />
                                <span>{article.views}</span>
                            </div>
                        </div>

                        {/* Article Image */}
                        <div className="w-full aspect-video rounded-[8px] overflow-hidden mb-6 relative border border-[#e5e7eb]">
                            <img
                                src={article.image}
                                alt={article.title}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Article Body */}
                        <div className="space-y-4 text-[16px] text-[#374151] leading-[28px] tracking-[-0.5px]">
                            <p>
                                The city-state has integrated AI platform that manages traffic, energy, and public services with unprecedented efficiency.
                            </p>
                            <p>
                                Singapore has launched the world's most advanced AI-powered urban management system, representing a quantum leap in smart city technology. The comprehensive platform integrates traffic management, energy distribution, waste collection, and emergency services into a single, intelligent network.
                            </p>
                            <p>
                                Prime Minister Lee Hsien Yang unveiled the system at a ceremony in Marina Bay, describing it as "the future of urban living." The AI system processes data from millions of sensors throughout the city, making real-time decisions to optimize urban operations.
                            </p>
                        </div>

                        {/* Topics */}
                        <div className="mt-8 pt-6 border-t border-[#e5e7eb]">
                            <p className="text-[14px] font-semibold text-[#111827] mb-3 tracking-[-0.5px]">Topics:</p>
                            <div className="flex flex-wrap gap-2">
                                {article.tags?.map((topic, idx) => (
                                    <span
                                        key={idx}
                                        className="px-3 py-1.5 bg-[#f3f4f6] rounded-[4px] text-[12px] text-[#374151] tracking-[-0.5px]"
                                    >
                                        {topic}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="w-[320px] space-y-6">
                    {/* Publish Section */}
                    <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-6 shadow-sm">
                        <h3 className="text-[16px] font-semibold text-[#111827] mb-4 tracking-[-0.5px]">
                            Publish to:
                        </h3>

                        <div className="space-y-3 mb-6">
                            {[
                                { id: 'filipinoHomes', label: 'FilipinoHomes' },
                                { id: 'rentPh', label: 'Rent.ph' },
                                { id: 'homesPh', label: 'Homes' },
                                { id: 'bayanihan', label: 'Bayanihan' },
                                { id: 'mainPortal', label: 'Main News Portal' },
                            ].map((site) => (
                                <label key={site.id} className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={publishToSites[site.id as keyof typeof publishToSites]}
                                        onChange={() => toggleSite(site.id as keyof typeof publishToSites)}
                                        className="w-4 h-4 rounded border-[#d1d5db] text-[#C10007] focus:ring-[#C10007] focus:ring-offset-0 cursor-pointer"
                                    />
                                    <span className="text-[14px] text-[#374151] group-hover:text-[#C10007] transition-colors tracking-[-0.5px]">{site.label}</span>
                                </label>
                            ))}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsCustomizeModalOpen(true)}
                                className="flex-1 px-4 py-2.5 border border-[#d1d5db] rounded-[8px] text-[14px] font-medium text-[#374151] hover:bg-gray-50 transition-all active:scale-95 tracking-[-0.5px]">
                                Customize
                            </button>
                            <button className="flex-1 px-4 py-2.5 bg-[#3b82f6] text-white rounded-[8px] text-[14px] font-semibold hover:bg-[#2563eb] transition-all active:scale-95 tracking-[-0.5px] shadow-sm">
                                Publish
                            </button>
                        </div>
                    </div>

                    {/* Article Statistics */}
                    <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-6 shadow-sm">
                        <h3 className="text-[16px] font-semibold text-[#111827] mb-4 tracking-[-0.5px]">
                            Article Statistics
                        </h3>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Eye className="w-4 h-4 text-[#6b7280]" />
                                    <span className="text-[14px] text-[#6b7280] tracking-[-0.5px]">Total Views</span>
                                </div>
                                <span className="text-[18px] font-bold text-[#111827] tracking-[-0.5px]">{article.views}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-[#6b7280]" fill="none" viewBox="0 0 16 16">
                                        <rect width="16" height="16" fill="none" />
                                        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
                                        <circle cx="8" cy="8" r="2" fill="currentColor" />
                                    </svg>
                                    <span className="text-[14px] text-[#6b7280] tracking-[-0.5px]">Published Sites</span>
                                </div>
                                <span className="text-[18px] font-bold text-[#111827] tracking-[-0.5px]">{article.sites?.length || 0}</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-6 shadow-sm">
                        <h3 className="text-[16px] font-semibold text-[#111827] mb-4 tracking-[-0.5px]">
                            Quick Actions
                        </h3>

                        <div className="space-y-3">
                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-[#d1d5db] rounded-[8px] text-[14px] font-medium text-[#374151] hover:bg-gray-50 transition-all active:scale-95 tracking-[-0.5px]"
                            >
                                <Edit className="w-4 h-4" />
                                Edit Article
                            </button>

                            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-[#d1d5db] rounded-[8px] text-[14px] font-medium text-[#ef4444] hover:bg-red-50 transition-all active:scale-95 tracking-[-0.5px]">
                                <XCircle className="w-4 h-4" />
                                Reject Article
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Editor Modal */}
            <ArticleEditorModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                mode="edit"
                initialData={article}
            />

            {/* Customize Titles Modal */}
            <CustomizeTitlesModal
                isOpen={isCustomizeModalOpen}
                onClose={() => setIsCustomizeModalOpen(false)}
                publishTo={publishToSites}
                originalTitle={article.title}
            />
        </div>
    );
}
