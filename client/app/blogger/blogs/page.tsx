"use client";

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search } from 'lucide-react';
import AdminPageHeader from "@/components/features/admin/shared/AdminPageHeader";
import Pagination from "@/components/features/admin/shared/Pagination";
import ArticlesTabs, { ArticleTab } from "@/components/features/admin/articles/ArticlesTabs";
import ArticlesFilters from "@/components/features/admin/articles/ArticlesFilters";
import ArticleListItem from "@/components/features/admin/articles/ArticleListItem";
import { mockBlogs } from "@/app/admin/users/data";
import usePagination from '@/hooks/usePagination';

export default function BloggerBlogsPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<ArticleTab>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All Category');
    const [countryFilter, setCountryFilter] = useState('All Countries');

    const pagination = usePagination();

    // Mapping mockBlogs to a structure ArticleListItem expects if necessary
    // or just using them if compatible. Let's check ArticleResource.
    const blogs = useMemo(() => {
        return mockBlogs
            .filter(blog => blog.authorName === "Maria Santos") // Only Maria's blogs
            .filter(blog => {
                const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesTab = activeTab === 'all' || blog.status === activeTab;
                const matchesCategory = categoryFilter === 'All Category' || blog.category === categoryFilter;
                // mockBlogs doesn't have country, but for the UI we'll simulate
                return matchesSearch && matchesTab && matchesCategory;
            });
    }, [activeTab, searchQuery, categoryFilter]);

    const counts = useMemo(() => ({
        all: mockBlogs.filter(b => b.authorName === "Maria Santos").length,
        published: mockBlogs.filter(b => b.authorName === "Maria Santos" && b.status === "published").length,
        pending: mockBlogs.filter(b => b.authorName === "Maria Santos" && b.status === "pending").length,
        deleted: 0,
    }), []);

    const displayedBlogs = blogs.slice(
        (pagination.currentPage - 1) * 10,
        pagination.currentPage * 10
    );

    return (
        <div className="p-8 bg-[#f9fafb] min-h-screen">
            <AdminPageHeader
                title="My Blogs"
                description="Manage your stories and check their distribution status"
                actionLabel="Create New Blog"
                onAction={() => router.push('/blogger/blogs/create')}
                actionIcon={Plus}
            />

            <div className="bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden shadow-[0px_1px_3px_rgba(0,0,0,0.05)]">
                <ArticlesTabs
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    counts={counts}
                />

                <ArticlesFilters
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    categoryFilter={categoryFilter}
                    setCategoryFilter={setCategoryFilter}
                    countryFilter={countryFilter}
                    setCountryFilter={setCountryFilter}
                />

                <div className="flex flex-col">
                    {displayedBlogs.length > 0 ? (
                        displayedBlogs.map((blog) => (
                            <ArticleListItem
                                key={blog.id}
                                article={{
                                    ...blog,
                                    // Map AdminBlog to ArticleResource fields if needed
                                    featured_image: blog.image,
                                    summary: blog.description,
                                    created_at: blog.date,
                                    slug: blog.title.toLowerCase().replace(/ /g, '-'),
                                    author: { name: blog.authorName }
                                } as any}
                                onClick={() => router.push(`/blogger/blogs/${blog.id}/edit`)}
                            />
                        ))
                    ) : (
                        <div className="p-20 text-center">
                            <p className="text-[#6b7280] text-[16px]">No blogs found matching your criteria.</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-8">
                <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={Math.ceil(blogs.length / 10) || 1}
                    onPageChange={pagination.handlePageChange}
                />
            </div>
        </div>
    );
}
