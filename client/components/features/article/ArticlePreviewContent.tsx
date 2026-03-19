"use client";

import { useEffect, useState } from "react";
import { getAdminArticleById } from "@/lib/api-v2/admin/service/article/getAdminArticleById";
import ArticleDetailView from "./ArticleDetailView";
import ArticleBreadcrumb from "./ArticleBreadcrumb";
import { Categories, Countries } from "@/app/data";
import { Loader2, AlertCircle } from "lucide-react";
import { ArticleResource } from "@/lib/api-v2/types/ArticleResource";

interface ArticlePreviewContentProps {
  id: string;
}

export default function ArticlePreviewContent({ id }: ArticlePreviewContentProps) {
  const [article, setArticle] = useState<ArticleResource | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPreview() {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      try {
        const response = await getAdminArticleById(id);
        const articleData = (response.data as any).data || response.data;
        if (articleData) {
          setArticle(articleData as ArticleResource);
        } else {
          setError("Article not found or you don't have permission to preview it.");
        }
      } catch (err: any) {
        console.error("Preview fetch failed:", err);
        const message = err.response?.status === 401 
          ? "Unauthorized: Please log in to the admin panel to preview this article." 
          : "Failed to load article preview.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPreview();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin text-[#c10007]" />
        <p className="text-lg font-medium">Loading preview...</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center px-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <h2 className="text-2xl font-bold text-gray-900">Preview Error</h2>
        <p className="text-gray-600 max-w-md">{error || "Something went wrong."}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-[#c10007] text-white rounded-lg hover:bg-[#a00006] transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const getCategoryLabel = (catCode: string) =>
    Categories.find(c => c.id.toLowerCase() === catCode?.toLowerCase() || c.label.toLowerCase() === catCode?.toLowerCase())?.label || catCode;

  const getCountryLabel = (countryCode: string) =>
    Countries.find(c => c.id.toLowerCase() === countryCode?.toLowerCase() || c.label.toLowerCase() === countryCode?.toLowerCase())?.label || countryCode;

  return (
    <>
      <div className="mb-8">
        <ArticleBreadcrumb 
          category={getCategoryLabel(article.category)}
          categoryId={article.category}
          categoryHref={article.category?.toLowerCase() === "restaurant" ? "/restaurants" : undefined}
          country={getCountryLabel(article.country)}
          countryId={article.country}
        />
      </div>

      <ArticleDetailView article={article} />
    </>
  );
}
