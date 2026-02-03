import { Suspense } from "react";

import ArticleViewCounter from "@/components/features/article/ArticleViewCounter";
import AdSpace from "@/lib/ads/components/AdSpace";
import { notFound } from "next/navigation";
import {
  ArticleHeaderSkeleton,
  ArticleContentSkeleton,
  SidebarSkeleton,
  BreadcrumbSkeleton
} from "@/components/features/article/ArticleSkeletons";
import ArticleDetailContent from "@/components/features/article/ArticleDetailContent";
import RelatedArticlesSidebar from "@/components/features/article/RelatedArticlesSidebar";
import ArticleBreadcrumbContainer from "@/components/features/article/ArticleBreadcrumbContainer";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Article({ searchParams }: Props) {
  const { id } = await searchParams;
  const articleId = Array.isArray(id) ? id[0] : id;

  if (!articleId) {
    notFound();
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-[110px] py-8">
      <Suspense fallback={null}>
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
    </div >
  );
}
