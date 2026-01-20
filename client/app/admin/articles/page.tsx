"use client";

import { useState, useMemo } from 'react';
import ArticlesHeader from "@/components/features/admin/articles/ArticlesHeader";
import ArticlesTabs, { ArticleTab } from "@/components/features/admin/articles/ArticlesTabs";
import ArticlesFilters from "@/components/features/admin/articles/ArticlesFilters";
import ArticleListItem from "@/components/features/admin/articles/ArticleListItem";
import Pagination from "@/components/features/admin/shared/Pagination";
import { articlesData, Article } from "@/app/admin/articles/data";
import { cn } from "@/lib/utils";

import { useRouter } from 'next/navigation';
import ArticleEditorModal from "@/components/features/admin/articles/ArticleEditorModal";

/**
 * ArticlesPage component for the admin dashboard
 */
export default function ArticlesPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<ArticleTab>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All Categories');
    const [countryFilter, setCountryFilter] = useState('All Countries');
    const [currentPage, setCurrentPage] = useState(1);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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
            const matchesCategory = categoryFilter === 'All Categories' || article.category === categoryFilter;
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
