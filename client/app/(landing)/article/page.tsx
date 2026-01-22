import ArticleBreadcrumb from "@/components/features/article/ArticleBreadcrumb";
import ArticleHeader from "@/components/features/article/ArticleHeader";
import ArticleFeaturedImage from "@/components/features/article/ArticleFeaturedImage";
import ArticleContent from "@/components/features/article/ArticleContent";
import ArticleShareBox from "@/components/features/article/ArticleShareBox";
import RelatedArticles from "@/components/features/article/RelatedArticles";
import AdSpace from "@/components/shared/AdSpace";
import { ArticlesListResponse, getArticleById, getArticlesList } from "@/lib/api";
import { Categories, Countries } from "@/app/data";
import { notFound } from "next/navigation";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Article({ searchParams }: Props) {
  const { id } = await searchParams;
  const articleId = Array.isArray(id) ? id[0] : id;

  if (!articleId) {
    notFound();
  }

  let article;
  try {
    article = await getArticleById(articleId);
  } catch (error) {
    console.error("Error fetching article:", error);
    notFound();
  }

  if (!article) {
    notFound();
  }

  // Fetch related articles (same category)
  // We use getLandingPageArticles and filter by category
  const { data } = await getArticlesList({ mode: "list", category: article.category }) as ArticlesListResponse;

  // Unique articles only, excluding current one
  const seenIds = new Set();
  const relatedArticles = data
    .filter(a => {
      if (a.id === article?.id || seenIds.has(a.id)) return false;
      seenIds.add(a.id);
      return true;
    })
    .slice(0, 4)
    .map(a => ({
      id: a.id,
      title: a.title,
      category: a.category,
      location: a.country,
      imageSrc: a.image_url,
      timeAgo: "TBA",
      views: "0" // API doesn't provide view count yet
    }));

  const getCategoryLabel = (cat: string) => Categories.find(c => c.id.toLowerCase() === cat.toLowerCase() || c.label.toLowerCase() === cat.toLowerCase())?.label || cat;
  const getCountryLabel = (country: string) => Countries.find(c => c.id.toLowerCase() === country.toLowerCase() || c.label.toLowerCase() === country.toLowerCase())?.label || country;

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-[110px] py-12">
      <ArticleBreadcrumb
        category={getCategoryLabel(article.category)}
        categoryId={article.category}
        country={getCountryLabel(article.country)}
        countryId={article.country}
      />
      <ArticleHeader
        category={getCategoryLabel(article.category)}
        categoryId={article.category}
        location={getCountryLabel(article.country)}
        countryId={article.country}
        title={article.title}
        subtitle={article.content.replace(/<[^>]*>/g, '').substring(0, 160) + "..."}
        author={{ name: "HomesPh News" }}
        date={new Date(article.timestamp).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
        views={0}
      />
      {article.image_url && (
        <ArticleFeaturedImage
          src={article.image_url}
          alt={article.title}
          caption=""
        />
      )}

      <ArticleContent
        content={article.content}
        topics={article.keywords ? article.keywords.split(',').map(t => t.trim()) : []}
      />
      <ArticleShareBox />

      <AdSpace className="my-8" label="Advertisement Space" width="300x600" height="Leader board Ad" />

      <RelatedArticles articles={relatedArticles} />
    </div>
  );
}