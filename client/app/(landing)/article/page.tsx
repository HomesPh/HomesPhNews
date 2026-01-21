import Link from "next/link";
import ArticleBreadcrumb from "@/components/features/article/ArticleBreadcrumb";
import ArticleHeader from "@/components/features/article/ArticleHeader";
import ArticleFeaturedImage from "@/components/features/article/ArticleFeaturedImage";
import ArticleContent from "@/components/features/article/ArticleContent";
import ArticleShareBox from "@/components/features/article/ArticleShareBox";
import RelatedArticles from "@/components/features/article/RelatedArticles";
import AdSpace from "@/components/shared/AdSpace";

// dummy article data
import { articleData } from "./data";
import { getArticleById, articles } from "../data";

import { Categories, Countries } from "@/app/data";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Article({ searchParams }: Props) {
  const { id } = await searchParams;
  const articleId = Array.isArray(id) ? id[0] : id;
  const foundArticle = articleId ? getArticleById(articleId) : undefined;

  const getCategoryLabel = (cat: string) => Categories.find(c => c.id.toLowerCase() === cat.toLowerCase() || c.label.toLowerCase() === cat.toLowerCase())?.label || cat;
  const getCountryLabel = (country: string) => Countries.find(c => c.id.toLowerCase() === country.toLowerCase() || c.label.toLowerCase() === country.toLowerCase())?.label || country;

  // Logic to find related articles (other articles in the same category)
  const getRelatedArticles = (currentArticleId: string | number, category: string) => {
    return articles
      .filter(a => a.category.toLowerCase() === category.toLowerCase() && String(a.id) !== String(currentArticleId))
      .slice(0, 4);
  };

  // Use found article or fallback to fallback data
  const displayData = foundArticle ? {
    id: foundArticle.id,
    category: getCategoryLabel(foundArticle.category),
    categoryId: foundArticle.category,
    location: getCountryLabel(foundArticle.location),
    country: getCountryLabel(foundArticle.location),
    countryId: foundArticle.location,
    title: foundArticle.title,
    subtitle: foundArticle.subtitle || foundArticle.description,
    author: {
      name: foundArticle.author?.name || "Unknown Author",
      image: foundArticle.author?.avatar,
    },
    date: foundArticle.createdAt || foundArticle.timeAgo,
    views: parseInt(foundArticle.views) || 0,
    featuredImageUrl: foundArticle.featuredImageUrl || foundArticle.imageSrc,
    content: foundArticle.content || foundArticle.description,
    topics: foundArticle.topics || [],
    relatedArticles: getRelatedArticles(foundArticle.id, foundArticle.category),
  } : {
    id: articleData.id,
    category: getCategoryLabel(articleData.category),
    categoryId: articleData.category,
    location: getCountryLabel(articleData.country),
    country: getCountryLabel(articleData.country),
    countryId: articleData.country,
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
    relatedArticles: getRelatedArticles(articleData.id, articleData.category)
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-[110px] py-12">
      <ArticleBreadcrumb
        category={displayData.category}
        categoryId={displayData.categoryId}
        country={displayData.country}
        countryId={displayData.countryId}
      />
      <ArticleHeader
        category={displayData.category}
        categoryId={displayData.categoryId}
        location={displayData.location}
        countryId={displayData.countryId}
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

      <AdSpace className="my-8" label="Advertisement Space" width="300x600" height="Leader board Ad" />

      <RelatedArticles articles={displayData.relatedArticles as any} />
    </div>
  );
}