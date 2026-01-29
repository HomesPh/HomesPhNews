"use client";

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, ChevronDown } from 'lucide-react';
import AdminPageHeader from "@/components/features/admin/shared/AdminPageHeader";
import Pagination from "@/components/features/admin/shared/Pagination";
import BlogsList from "@/components/features/admin/blogs/BlogsList";
import { mockBlogs, AdminBlog } from "@/app/admin/users/data";
import { Categories, Countries } from "@/app/data";
import usePagination from '@/hooks/usePagination';

function BlogsPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const authorFilter = searchParams.get('author');

    const [searchQuery, setSearchQuery] = useState(authorFilter || '');
    const [categoryFilter, setCategoryFilter] = useState('All News');
    const [countryFilter, setCountryFilter] = useState('All Countries');

    useEffect(() => {
        if (authorFilter) {
            setSearchQuery(authorFilter);
        }
    }, [authorFilter]);

    const pagination = usePagination();

    const filteredBlogs = useMemo(() => {
        return mockBlogs.filter(blog => {
            const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                blog.authorName.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = categoryFilter === 'All News' || blog.category === categoryFilter;
            const matchesCountry = countryFilter === 'All Countries' || blog.sites.includes(countryFilter);
            return matchesSearch && matchesCategory && matchesCountry;
        });
    }, [searchQuery, categoryFilter, countryFilter]);

    const handleViewBlog = (blogId: number) => {
        const currentPath = window.location.pathname + window.location.search;
        router.push(`/admin/blogs/${blogId}?from=${encodeURIComponent(currentPath)}`);
    };

    const handleDeleteBlog = (blogId: number) => {
        if (confirm('Are you sure you want to delete this blog?')) {
            alert(`Blog ${blogId} deleted!`);
        }
    };

    return (
        <div className="p-8 bg-[#f9fafb] min-h-screen">
            <AdminPageHeader
                title="Blog Management"
                description={authorFilter ? `Showing blogs by ${authorFilter}` : 'View and manage all blogger submissions'}
            />

            <div className="bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden shadow-[0px_1px_3px_rgba(0,0,0,0.05)]">
                {/* Search and Filters */}
                <div className="flex items-center gap-4 p-5 border-b border-[#e5e7eb]">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search blogs..."
                            className="w-full h-[50px] pl-12 pr-4 border border-[#d1d5db] rounded-[8px] text-[16px] text-[#111827] placeholder:text-[#adaebc] focus:outline-none focus:ring-2 focus:ring-[#C10007] focus:border-transparent tracking-[-0.5px] transition-all"
                        />
                    </div>
                    <div className="relative min-w-[200px]">
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="w-full h-[50px] pl-3 pr-10 border border-[#d1d5db] rounded-[8px] text-[15px] font-medium text-[#111827] bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#C10007] focus:border-transparent tracking-[-0.5px] cursor-pointer"
                        >
                            {Categories.map(cat => <option key={cat.id} value={cat.label}>{cat.label}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af] pointer-events-none" />
                    </div>
                    <div className="relative min-w-[200px]">
                        <select
                            value={countryFilter}
                            onChange={(e) => setCountryFilter(e.target.value)}
                            className="w-full h-[50px] pl-3 pr-10 border border-[#d1d5db] rounded-[8px] text-[15px] font-medium text-[#111827] bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#C10007] focus:border-transparent tracking-[-0.5px] cursor-pointer"
                        >
                            {Countries.map(country => <option key={country.id} value={country.label}>{country.label}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af] pointer-events-none" />
                    </div>
                </div>

                <BlogsList
                    blogs={filteredBlogs.slice((pagination.currentPage - 1) * 10, pagination.currentPage * 10)}
                    onView={handleViewBlog}
                    onDelete={handleDeleteBlog}
                />
            </div>

            <div className="mt-8">
                <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={Math.ceil(filteredBlogs.length / 10) || 1}
                    onPageChange={pagination.handlePageChange}
                />
            </div>
        </div>
    );
}

export default function BlogsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BlogsPageContent />
        </Suspense>
    );
}
