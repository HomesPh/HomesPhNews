import Link from "next/link";
import ArticleBreadcrumb from "@/components/features/article/ArticleBreadcrumb";
import ArticleHeader from "@/components/features/article/ArticleHeader";
import ArticleFeaturedImage from "@/components/features/article/ArticleFeaturedImage";
import ArticleContent from "@/components/features/article/ArticleContent";
import ArticleShareBox from "@/components/features/article/ArticleShareBox";
import RelatedArticles from "@/components/features/article/RelatedArticles";

// dummy article data
import { articleData } from "./data";
import { getArticleById } from "../data";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Article({ searchParams }: Props) {
  const { id } = await searchParams;
  const articleId = Array.isArray(id) ? id[0] : id;
  const foundArticle = articleId ? getArticleById(articleId) : undefined;

  // Use found article or fallback to dummy data
  // detailed mapping to handle data structure differences
  const displayData = foundArticle ? {
    category: foundArticle.category,
    location: foundArticle.location,
    country: foundArticle.location, // breadcrumb uses country, header uses location
    title: foundArticle.title,
    subtitle: foundArticle.subtitle || foundArticle.description,
    author: {
      name: foundArticle.author?.name || "Unknown Author",
      image: foundArticle.author?.avatar, // Map avatar to image
    },
    date: foundArticle.createdAt || foundArticle.timeAgo,
    views: parseInt(foundArticle.views) || 0,
    featuredImageUrl: foundArticle.featuredImageUrl || foundArticle.imageSrc,
    content: foundArticle.content || foundArticle.description,
    topics: foundArticle.topics || [],
    relatedArticles: [], // Todo: implement related articles logic
  } : {
    // Adapter for existing dummy data
    category: articleData.category,
    location: articleData.country,
    country: articleData.country,
    title: articleData.title,
    subtitle: articleData.subtitle,
    author: {
      name: articleData.author.name,
      image: articleData.author.imageUrl
    },
    date: articleData.createdAt,
    views: articleData.views,
    featuredImageUrl: articleData.featuredImageUrl,
    content: articleData.content,
    topics: articleData.topics,
    relatedArticles: articleData.relatedArticles
  };

  return (
    <div className="max-w-7xl mx-auto">
      <ArticleBreadcrumb category={displayData.category} country={displayData.country} />
      <ArticleHeader
        category={displayData.category}
        location={displayData.location}
        title={displayData.title}
        subtitle={displayData.subtitle || ""}
        author={displayData.author}
        date={displayData.date}
        views={displayData.views}
      />
      {displayData.featuredImageUrl && (
        <ArticleFeaturedImage
          src={displayData.featuredImageUrl}
          alt={displayData.title}
          caption=""
        />
      )}
      <ArticleContent content={displayData.content} topics={displayData.topics} />
      <ArticleShareBox />
      <RelatedArticles articles={displayData.relatedArticles as any} />
    </div>
  );
}