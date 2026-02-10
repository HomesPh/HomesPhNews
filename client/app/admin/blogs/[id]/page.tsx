"use client";

import { decodeHtml } from "@/lib/utils";

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Calendar, Eye, User, Trash2 } from 'lucide-react';
import { mockBlogs } from "@/app/admin/users/data";
import { Categories, Countries } from "@/app/data";
import ArticleBreadcrumb from "@/components/features/article/ArticleBreadcrumb";
import StatusBadge from "@/components/features/admin/shared/StatusBadge";


export default function BlogDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const from = searchParams.get('from') || '/admin/blogs';

    const blog = mockBlogs.find(b => b.id === Number(id));

    if (!blog) {
        return (
            <div className="p-20 text-center">
                <h2 className="text-2xl font-bold mb-4">Blog Not Found</h2>
                <button
                    onClick={() => router.push('/admin/blogs')}
                    className="text-[#C10007] hover:underline"
                >
                    Back to Blog Management
                </button>
            </div>
        );
    }

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this blog?')) {
            alert('Blog deleted successfully');
            router.push('/admin/blogs');
        }
    };

    const getCategoryLabel = (cat: string) => Categories.find(c => c.id.toLowerCase() === cat.toLowerCase() || c.label.toLowerCase() === cat.toLowerCase())?.label || cat;
    const getCountryLabel = (country: string) => Countries.find(c => c.id.toLowerCase() === country.toLowerCase() || c.label.toLowerCase() === country.toLowerCase())?.label || country;

    return (
        <div className="min-h-screen bg-[#f9fafb]">
            <div className="max-w-[1400px] mx-auto px-6 py-8">
                {/* Breadcrumb Row */}
                <div className="mb-6">
                    <ArticleBreadcrumb
                        homeLabel="Blog"
                        homeHref={from}
                        category="Details"
                        categoryHref="#"
                    />
                </div>

                <div className="flex gap-8">
                    {/* Main Content Area */}
                    <div className="flex-1 max-w-[800px]">
                        <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-8 shadow-[0px_1px_3px_rgba(0,0,0,0.05)]">
                            <article>
                                {/* Category Badge & Status */}
                                <div className="mb-6 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="px-3 py-1 bg-white border border-[#e5e7eb] rounded-[4px] text-[12px] font-semibold text-[#111827] tracking-[-0.5px] uppercase">
                                            {blog.category}
                                        </span>
                                        <span className="text-[14px] text-[#e5e7eb]">|</span>
                                        <span className="text-[12px] font-semibold text-[#111827] tracking-[-0.5px] uppercase">
                                            {blog.sites[0]}
                                        </span>
                                    </div>
                                    <StatusBadge status={blog.status as any} />
                                </div>

                                {/* Main Headline */}
                                <h1 className="text-[32px] font-bold text-[#111827] leading-[44px] tracking-[-0.5px] mb-4">
                                    {blog.title}
                                </h1>

                                {/* Metadata */}
                                <div className="flex items-center gap-4 mb-6 text-[14px] text-[#6b7280] tracking-[-0.5px]">
                                    <span className="font-medium text-[#111827]">
                                        By {blog.authorName}
                                    </span>
                                    <span className="text-[#e5e7eb]">|</span>
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4" />
                                        <span>{blog.date}</span>
                                    </div>
                                    <span className="text-[#e5e7eb]">|</span>
                                    <div className="flex items-center gap-1.5">
                                        <Eye className="w-4 h-4" />
                                        <span>{blog.views.toLocaleString()} views</span>
                                    </div>
                                </div>

                                {/* Featured Image */}
                                {blog.image && (
                                    <figure className="mb-8">
                                        <div className="w-full aspect-[16/9] overflow-hidden bg-gray-100 rounded-[8px] mb-3">
                                            <img
                                                src={blog.image}
                                                alt={blog.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <figcaption className="text-[13px] text-[#6b7280] italic leading-relaxed">
                                            {blog.title} — {blog.sites[0]}
                                        </figcaption>
                                    </figure>
                                )}

                                {/* Article Body */}
                                <div className="prose prose-lg max-w-none">
                                    {(() => {
                                        const decodedContent = decodeHtml(blog.content);
                                        return (
                                            <div
                                                className="text-[18px] text-[#374151] leading-[32px] tracking-[-0.5px] [&>p]:mb-3 [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:mb-4 [&>h2]:text-xl [&>h2]:font-bold [&>h2]:mb-3 [&>ul]:list-disc [&>ul]:ml-6 [&>ol]:list-decimal [&>ol]:ml-6 [&>li]:mb-1 [&>a]:text-blue-600 [&>a]:underline first-letter:text-[72px] first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:mt-[-5px] first-letter:leading-[0.8] first-letter:text-[#0c0c0c]"
                                                dangerouslySetInnerHTML={{ __html: decodedContent }}
                                            />
                                        );
                                    })()}
                                </div>
                            </article>
                        </div>

                        {/* Topics Section - Matching Article Details style exactly */}
                        <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-8 mt-6 shadow-[0px_1px_3px_rgba(0,0,0,0.05)]">
                            <h3 className="text-[14px] font-semibold text-[#111827] mb-4 tracking-[-0.5px]">Topics:</h3>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1.5 bg-[#f3f4f6] rounded-[4px] text-[12px] text-[#374151] tracking-[-0.5px] font-medium">
                                    {blog.category}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar - Admin Controls */}
                    <aside className="w-[320px] flex-shrink-0 space-y-6">
                        {/* Author Info */}
                        <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-6 shadow-sm">
                            <h3 className="text-[16px] font-semibold text-[#111827] mb-4 tracking-[-0.5px]">
                                Author Profile
                            </h3>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                                    <User className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-[14px] font-bold text-[#111827] tracking-[-0.5px]">{blog.authorName}</div>
                                    <div className="text-[12px] text-[#6b7280] tracking-[-0.5px]">{blog.authorEmail}</div>
                                </div>
                            </div>
                            <button
                                onClick={() => router.push(`/admin/users?search=${encodeURIComponent(blog.authorName)}`)}
                                className="w-full py-2.5 bg-blue-600 text-white rounded-[8px] text-[14px] font-semibold hover:bg-blue-700 transition-all active:scale-95 tracking-[-0.5px] shadow-sm"
                            >
                                View Profile
                            </button>
                        </div>

                        {/* Actions */}
                        <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-6 shadow-sm">
                            <h3 className="text-[16px] font-semibold text-[#111827] mb-4 tracking-[-0.5px]">
                                Quick Actions
                            </h3>
                            <button
                                onClick={handleDelete}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-[#d1d5db] rounded-[8px] text-[14px] font-medium text-[#ef4444] hover:bg-red-50 transition-all active:scale-95 tracking-[-0.5px]"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete Blog
                            </button>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
