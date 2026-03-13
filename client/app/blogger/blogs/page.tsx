"use client";

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search } from 'lucide-react';
import AdminPageHeader from "@/components/features/admin/shared/AdminPageHeader";
import Pagination from "@/components/features/admin/shared/Pagination";
import ArticlesFilters from "@/components/features/admin/articles/ArticlesFilters";
import BlogsList from "@/components/features/admin/blogs/BlogsList";
import { mockBlogs } from "@/app/admin/users/data";
import usePagination from '@/hooks/usePagination';
import useUrlFilters from '@/hooks/useUrlFilters';
import { Countries } from "@/app/data";

const URL_FILTERS_CONFIG = {
    category: { default: '' as const, resetValues: [''] },
    country: { default: '' as const, resetValues: [''] },
    city: { default: '' as const, resetValues: [''] },
    province: { default: '' as const, resetValues: [''] },
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

    const filteredBlogs = useMemo(() => {
        return mockBlogs
            .filter(blog => blog.authorName === "Maria Santos") // Only Maria's blogs
            .filter(blog => {
                const query = searchQuery.toLowerCase();
                const matchesSearch = blog.title.toLowerCase().includes(query);
                const matchesCategory = !filters.category || blog.category === filters.category;
                const matchesCountry = !filters.country || blog.sites.some(s => s.toLowerCase().includes(filters.country.toLowerCase()));

                return matchesSearch && matchesCategory && matchesCountry;
            });
    }, [searchQuery, filters]);

    const handleViewBlog = (blogId: number) => {
        router.push(`/blogger/blogs/${blogId}/edit`);
    };

    const handleDeleteBlog = (blogId: number) => {
        if (confirm('Are you sure you want to delete this blog?')) {
            alert(`Blog ${blogId} deleted!`);
        }
    };

    const availableCategories = useMemo(() => {
        const countsMap: Record<string, number> = {};
        mockBlogs.filter(b => b.authorName === "Maria Santos").forEach(blog => {
            const query = searchQuery.toLowerCase();
            const matchesSearch = blog.title.toLowerCase().includes(query);
            const matchesCountry = !filters.country || blog.sites.some(s => s.toLowerCase().includes(filters.country.toLowerCase()));

            if (matchesSearch && matchesCountry) {
                countsMap[blog.category] = (countsMap[blog.category] || 0) + 1;
            }
        });
        return Object.entries(countsMap).map(([name, count]) => ({ name, count })).sort((a, b) => a.name.localeCompare(b.name));
    }, [searchQuery, filters.country]);

    const availableCountries = useMemo(() => {
        const countsMap: Record<string, number> = {};
        mockBlogs.filter(b => b.authorName === "Maria Santos").forEach(b => {
            const query = searchQuery.toLowerCase();
            const matchesSearch = b.title.toLowerCase().includes(query);
            const matchesCategory = !filters.category || b.category === filters.category;

            if (matchesSearch && matchesCategory) {
                b.sites.forEach(site => {
                    const country = Countries.find(c => site.toLowerCase().includes(c.label.toLowerCase()))?.label || 'Global';
                    countsMap[country] = (countsMap[country] || 0) + 1;
                });
            }
        });
        return Object.entries(countsMap).map(([name, count]) => ({ name, count })).sort((a, b) => a.name.localeCompare(b.name));
    }, [searchQuery, filters.category]);

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
                <ArticlesFilters
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    categoryFilter={filters.category}
                    setCategoryFilter={(cat: string) => setFilter('category', cat)}
                    countryFilter={filters.country}
                    provinceFilter={filters.province}
                    cityFilter={filters.city}
                    setFilters={setFilters}
                    availableCategories={availableCategories}
                    availableCountries={availableCountries}
                />

                <BlogsList
                    blogs={filteredBlogs.slice((pagination.currentPage - 1) * 5, pagination.currentPage * 5)}
                    onView={handleViewBlog}
                    onDelete={handleDeleteBlog}
                />
            </div>

            <div className="mt-8">
                <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={Math.ceil(filteredBlogs.length / 5) || 1}
                    onPageChange={pagination.handlePageChange}
                />
            </div>
        </div>
    );
}
