"use client";

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search } from 'lucide-react';
import AdminPageHeader from "@/components/features/admin/shared/AdminPageHeader";
import Pagination from "@/components/features/admin/shared/Pagination";
import ArticlesTabs, { ArticleTab } from "@/components/features/admin/articles/ArticlesTabs";
import ArticlesFilters from "@/components/features/admin/articles/ArticlesFilters";
import ArticleListItem from "@/components/features/admin/articles/ArticleListItem";
import { mockBlogs } from "@/app/admin/users/data";
import usePagination from '@/hooks/usePagination';
import useUrlFilters from '@/hooks/useUrlFilters';
import { Countries } from "@/app/data";

const URL_FILTERS_CONFIG = {
    status: { default: 'all' as const, resetValues: ['all'] },
    category: { default: '' as const, resetValues: [''] },
    country: { default: '' as const, resetValues: [''] },
    city: { default: '' as const, resetValues: [''] },
    search: { default: '' as const, resetValues: [''] },
};

export default function BloggerBlogsPage() {
    const router = useRouter();
    const { filters, setFilter, setFilters } = useUrlFilters(URL_FILTERS_CONFIG);
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    // Sync search query with URL
    useEffect(() => {
        const timer = setTimeout(() => {
            setFilter('search', searchQuery);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery, setFilter]);

    const pagination = usePagination();

    const blogs = useMemo(() => {
        return mockBlogs
            .filter(blog => blog.authorName === "Maria Santos") // Only Maria's blogs
            .filter(blog => {
                const query = searchQuery.toLowerCase();
                const matchesSearch = blog.title.toLowerCase().includes(query);
                const matchesTab = filters.status === 'all' || blog.status === filters.status;
                const matchesCategory = !filters.category || blog.category === filters.category;

                return matchesSearch && matchesTab && matchesCategory;
            });
    }, [filters, searchQuery]);

    const counts = useMemo(() => ({
        all: mockBlogs.filter(b => b.authorName === "Maria Santos").length,
        published: mockBlogs.filter(b => b.authorName === "Maria Santos" && b.status === "published").length,
        pending: mockBlogs.filter(b => b.authorName === "Maria Santos" && b.status === "pending").length,
        deleted: 0,
    }), []);

    const availableCategories = useMemo(() => {
        const countsMap: Record<string, number> = {};
        mockBlogs.filter(b => b.authorName === "Maria Santos").forEach(blog => {
            // Respect Search and Country
            const query = searchQuery.toLowerCase();
            const matchesSearch = blog.title.toLowerCase().includes(query);
            const matchesCountry = !filters.country || blog.sites.some(s => s.toLowerCase().includes(filters.country.toLowerCase()));
            const matchesTab = filters.status === 'all' || blog.status === filters.status;

            if (matchesSearch && matchesCountry && matchesTab) {
                countsMap[blog.category] = (countsMap[blog.category] || 0) + 1;
            }
        });
        return Object.entries(countsMap).map(([name, count]) => ({ name, count })).sort((a, b) => a.name.localeCompare(b.name));
    }, [searchQuery, filters.country, filters.status]);

    const availableCountries = useMemo(() => {
        const countsMap: Record<string, number> = {};
        mockBlogs.filter(b => b.authorName === "Maria Santos").forEach(b => {
            // Respect Search and Category
            const query = searchQuery.toLowerCase();
            const matchesSearch = b.title.toLowerCase().includes(query);
            const matchesCategory = !filters.category || b.category === filters.category;
            const matchesTab = filters.status === 'all' || b.status === filters.status;

            if (matchesSearch && matchesCategory && matchesTab) {
                b.sites.forEach(site => {
                    const country = Countries.find(c => site.toLowerCase().includes(c.label.toLowerCase()))?.label || 'Global';
                    countsMap[country] = (countsMap[country] || 0) + 1;
                });
            }
        });
        return Object.entries(countsMap).map(([name, count]) => ({ name, count })).sort((a, b) => a.name.localeCompare(b.name));
    }, [searchQuery, filters.category, filters.status]);

    const filteredBlogs = useMemo(() => {
        return blogs.filter(blog => {
            const matchesCountry = !filters.country || blog.sites.some(s => s.toLowerCase().includes(filters.country.toLowerCase()));
            return matchesCountry;
        });
    }, [blogs, filters.country]);

    const displayedBlogs = filteredBlogs.slice(
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
                    activeTab={filters.status as ArticleTab}
                    setActiveTab={(tab) => setFilter('status', tab)}
                    counts={counts}
                />

                <ArticlesFilters
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    categoryFilter={filters.category}
                    setCategoryFilter={(cat: string) => setFilter('category', cat)}
                    countryFilter={filters.country}
                    cityFilter={filters.city}
                    setFilters={setFilters}
                    availableCategories={availableCategories}
                    availableCountries={availableCountries}
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
