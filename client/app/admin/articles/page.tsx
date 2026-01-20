"use client";

import { useState, useMemo } from 'react';
import ArticlesHeader from "@/components/features/admin/articles/ArticlesHeader";
import ArticlesTabs, { ArticleTab } from "@/components/features/admin/articles/ArticlesTabs";
import ArticlesFilters from "@/components/features/admin/articles/ArticlesFilters";
import ArticleListItem from "@/components/features/admin/articles/ArticleListItem";
import Pagination from "@/components/features/admin/shared/Pagination";
import { articlesData, Article } from "@/app/admin/articles/data";
import { cn } from "@/lib/utils";

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import ArticleEditorModal from "@/components/features/admin/articles/ArticleEditorModal";

/**
 * ArticlesPage component for the admin dashboard
 */
export default function ArticlesPage() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Initial state from URL params
    const statusParam = searchParams.get('status') as ArticleTab | null;
    const categoryParam = searchParams.get('category');
    const countryParam = searchParams.get('country');

    const [activeTab, setActiveTabState] = useState<ArticleTab>(statusParam || 'all');
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilterState] = useState(categoryParam || 'All Category');
    const [countryFilter, setCountryFilterState] = useState(countryParam || 'All Countries');
    const [currentPage, setCurrentPage] = useState(1);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Update URL when filters change
    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value && value !== 'all' && value !== 'All Category' && value !== 'All Countries') {
                params.set(name, value);
            } else {
                params.delete(name);
            }
            return params.toString();
        },
        [searchParams]
    );

    const setActiveTab = (tab: ArticleTab) => {
        setActiveTabState(tab);
        const query = createQueryString('status', tab);
        router.push(`${pathname}${query ? `?${query}` : ''}`, { scroll: false });
    };

    const setCategoryFilter = (category: string) => {
        setCategoryFilterState(category);
        const query = createQueryString('category', category);
        router.push(`${pathname}${query ? `?${query}` : ''}`, { scroll: false });
    };

    const setCountryFilter = (country: string) => {
        setCountryFilterState(country);
        const query = createQueryString('country', country);
        router.push(`${pathname}${query ? `?${query}` : ''}`, { scroll: false });
    };

    // Update state if URL changes (e.g. browser back button)
    useEffect(() => {
        if (statusParam) setActiveTabState(statusParam);
        if (categoryParam) setCategoryFilterState(categoryParam);
        if (countryParam) setCountryFilterState(countryParam);
    }, [statusParam, categoryParam, countryParam]);

    // Calculate counts for tabs
    const counts = useMemo(() => ({
        all: articlesData.length,
        published: articlesData.filter(a => a.status === 'published').length,
        pending: articlesData.filter(a => a.status === 'pending').length,
        rejected: articlesData.filter(a => a.status === 'rejected').length,
    }), []);

    // Filter articles based on state
    const filteredArticles = useMemo(() => {
        return articlesData.filter(article => {
            const matchesTab = activeTab === 'all' || article.status === activeTab;
            const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                article.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = categoryFilter === 'All Category' || article.category === categoryFilter;
            const matchesCountry = countryFilter === 'All Countries' || article.location === countryFilter;

            return matchesTab && matchesSearch && matchesCategory && matchesCountry;
        });
    }, [activeTab, searchQuery, categoryFilter, countryFilter]);

    return (
        <div className="p-8 bg-[#f9fafb] min-h-screen">
            <ArticlesHeader onNewArticle={() => setIsCreateModalOpen(true)} />


            <div className="bg-white rounded-[12px] border border-[#e5e7eb] overflow-hidden shadow-[0px_1px_3px_rgba(0,0,0,0.05)]">
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
                    {filteredArticles.length > 0 ? (
                        filteredArticles.map((article) => (
                            <ArticleListItem
                                key={article.id}
                                article={article}
                                onClick={() => router.push(`/admin/articles/${article.id}`)}
                            />
                        ))
                    ) : (
                        <div className="p-20 text-center">
                            <p className="text-[#6b7280] text-[16px]">No articles found matching your criteria.</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                <Pagination
                    currentPage={currentPage}
                    totalPages={10}
                    onPageChange={setCurrentPage}
                />
            </div>

            {/* Create Article Modal */}
            <ArticleEditorModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                mode="create"
            />
        </div>
    );
}
