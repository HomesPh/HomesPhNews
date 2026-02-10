import { Suspense } from "react";

import ArticleViewCounter from "@/components/features/article/ArticleViewCounter";
import AdSpace from "@/components/features/admin/ads/AdSpace";
import { notFound, redirect } from "next/navigation";
import {
  ArticleHeaderSkeleton,
  ArticleContentSkeleton,
  SidebarSkeleton,
  BreadcrumbSkeleton
} from "@/components/features/article/ArticleSkeletons";
import { Skeleton } from "@/components/ui/skeleton";
import ArticleDetailContent from "@/components/features/article/ArticleDetailContent";
import RelatedArticlesSidebar from "@/components/features/article/RelatedArticlesSidebar";
import ArticleBreadcrumbContainer from "@/components/features/article/ArticleBreadcrumbContainer";

import type { Metadata } from "next";
import { getArticleById } from "@/lib/api-v2";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { id, slug } = await searchParams;
  const articleId = (Array.isArray(slug) ? slug[0] : slug) || (Array.isArray(id) ? id[0] : id);

  if (!articleId) {
    return {
      title: "Article Not Found",
    };
  }

  try {
    const article = await getArticleById(articleId);

    if (!article) {
      return {
        title: "Article Not Found",
      };
    }

    const description = article.content
      ? article.content.replace(/<[^>]*>/g, "").substring(0, 160) + "..."
      : "";

    return {
      title: article.title,
      description: description,
      openGraph: {
        title: article.title,
        description: description,
        images: article.image ? [article.image] : [],
        type: "article",
        publishedTime: article.created_at,
        authors: ["HomesPh News"],
      },
      twitter: {
        card: "summary_large_image",
        title: article.title,
        description: description,
        images: article.image ? [article.image] : [],
      },
    };
  } catch (error) {
    console.error("Error fetching article metadata:", error);
    return {
      title: "Error",
    };
  }
}

export default async function Article({ searchParams }: Props) {
  const { id, slug } = await searchParams;
  const articleId = (Array.isArray(slug) ? slug[0] : slug) || (Array.isArray(id) ? id[0] : id);

  if (!articleId) {
    notFound();
  }

  // If accessed by ID, but has a slug, redirect to the slug URL
  let redirectTo = null;
  if (id && !slug) {
    try {
      const article = await getArticleById(Array.isArray(id) ? id[0] : id);
      if (article && article.slug) {
        redirectTo = `/article?slug=${article.slug}`;
      }
    } catch (error) {
      console.error("Error checking for slug redirect:", error);
    }
  }

  if (redirectTo) {
    redirect(redirectTo);
  }

  return (
    <div className="max-w-360 mx-auto px-4 md:px-27.5 py-8">
      <div className="max-w-360 mx-auto px-4 md:px-27.5 py-8">
        <Suspense fallback={<Skeleton className="h-0 w-0" />}>
          <ArticleViewCounter articleId={articleId} />
        </Suspense>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Component Area */}
          <div className="lg:col-span-2 space-y-8">
            <Suspense fallback={<BreadcrumbSkeleton />}>
              <ArticleBreadcrumbContainer id={articleId} />
            </Suspense>

            <Suspense fallback={
              <div className="space-y-8">
                <ArticleHeaderSkeleton />
                <ArticleContentSkeleton />
              </div>
            }>
              <ArticleDetailContent id={articleId} />
            </Suspense>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-1">
            <Suspense fallback={<SidebarSkeleton />}>
              <RelatedArticlesSidebar id={articleId} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
