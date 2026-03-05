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
import useUrlFilters from '@/hooks/useUrlFilters';
import ArticlesFilters from '@/components/features/admin/articles/ArticlesFilters';

const URL_FILTERS_CONFIG = {
    category: {
        default: '' as const,
        resetValues: [''],
    },
    country: {
        default: '' as const,
        resetValues: [''],
    },
    city: {
        default: '' as const,
        resetValues: [''],
    },
    search: {
        default: '' as const,
        resetValues: [''],
    },
};

function BlogsPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const authorFilter = searchParams.get('author');

    const { filters, setFilter, setFilters } = useUrlFilters(URL_FILTERS_CONFIG);
    const [searchQuery, setSearchQuery] = useState(authorFilter || filters.search || '');

    // Sync search query with URL
    useEffect(() => {
        const timer = setTimeout(() => {
            setFilter('search', searchQuery);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery, setFilter]);

    useEffect(() => {
        if (authorFilter && searchQuery !== authorFilter) {
            setSearchQuery(authorFilter);
        }
    }, [authorFilter]);

    const pagination = usePagination();

    const filteredBlogs = useMemo(() => {
        return mockBlogs.filter(blog => {
            const query = searchQuery.toLowerCase();
            const matchesSearch = blog.title.toLowerCase().includes(query) ||
                blog.authorName.toLowerCase().includes(query);

            const matchesCategory = !filters.category || blog.category === filters.category;
            // mockBlogs uses 'sites' array. For simulation, check if any site includes the country filter
            const matchesCountry = !filters.country || blog.sites.some(s => s.toLowerCase().includes(filters.country.toLowerCase()));

            // City filter is dummy for now, so it won't actually filter the mock data unless we simulate that too
            const matchesCity = !filters.city || true;

            return matchesSearch && matchesCategory && matchesCountry && matchesCity;
        });
    }, [searchQuery, filters]);

    const handleViewBlog = (blogId: number) => {
        const currentPath = window.location.pathname + window.location.search;
        router.push(`/admin/blogs/${blogId}?from=${encodeURIComponent(currentPath)}`);
    };

    const handleDeleteBlog = (blogId: number) => {
        if (confirm('Are you sure you want to delete this blog?')) {
            alert(`Blog ${blogId} deleted!`);
        }
    };

    const availableCategories = useMemo(() => {
        const counts: Record<string, number> = {};
        mockBlogs.forEach(b => {
            // Respect Search and Country
            const query = searchQuery.toLowerCase();
            const matchesSearch = b.title.toLowerCase().includes(query) || b.authorName.toLowerCase().includes(query);
            const matchesCountry = !filters.country || b.sites.some(s => s.toLowerCase().includes(filters.country.toLowerCase()));
            if (matchesSearch && matchesCountry) {
                counts[b.category] = (counts[b.category] || 0) + 1;
            }
        });
        return Object.entries(counts).map(([name, count]) => ({ name, count })).sort((a, b) => a.name.localeCompare(b.name));
    }, [searchQuery, filters.country]);

    const availableCountries = useMemo(() => {
        const counts: Record<string, number> = {};
        mockBlogs.forEach(b => {
            // Respect Search and Category
            const query = searchQuery.toLowerCase();
            const matchesSearch = b.title.toLowerCase().includes(query) || b.authorName.toLowerCase().includes(query);
            const matchesCategory = !filters.category || b.category === filters.category;

            if (matchesSearch && matchesCategory) {
                b.sites.forEach(site => {
                    const country = Countries.find(c => site.toLowerCase().includes(c.label.toLowerCase()))?.label || 'Global';
                    counts[country] = (counts[country] || 0) + 1;
                });
            }
        });
        return Object.entries(counts).map(([name, count]) => ({ name, count })).sort((a, b) => a.name.localeCompare(b.name));
    }, [searchQuery, filters.category]);

    return (
        <div className="p-8 bg-[#f9fafb] min-h-screen">
            <AdminPageHeader
                title="Blog Management"
                description={authorFilter ? `Showing blogs by ${authorFilter}` : 'View and manage all blogger submissions'}
            />

            <div className="bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden shadow-[0px_1px_3px_rgba(0,0,0,0.05)]">
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

import { SearchSkeleton } from '@/components/features/dashboard/DashboardSkeletons';

export default function BlogsPage() {
    return (
        <Suspense fallback={<div className="p-8 bg-[#f9fafb] min-h-screen"><SearchSkeleton /></div>}>
            <BlogsPageContent />
        </Suspense>
    );
}
