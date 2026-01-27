import ArticleBreadcrumb from "@/components/features/article/ArticleBreadcrumb";
import ArticleHeader from "@/components/features/article/ArticleHeader";
import ArticleFeaturedImage from "@/components/features/article/ArticleFeaturedImage";
import ArticleContent from "@/components/features/article/ArticleContent";
import ArticleShareBox from "@/components/features/article/ArticleShareBox";
import ArticleViewCounter from "@/components/features/article/ArticleViewCounter";
import AdSpace from "@/components/shared/AdSpace";
import MostReadTodayCard from "@/components/features/dashboard/MostReadTodayCard";
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
  const { data } = (await getArticlesList({
    mode: "list",
    category: article.category,
  })) as ArticlesListResponse;

  // Unique articles only, excluding current one, mapped for MostReadTodayCard
  const seenIds = new Set();
  const relatedArticles = data
    .filter((a) => {
      if (a.id === article?.id || seenIds.has(a.id)) return false;
      seenIds.add(a.id);
      return true;
    })
    .slice(0, 4)
    .map((a) => ({
      id: a.id,
      title: a.title,
      views: a.views_count || 0,
      imageUrl: a.image_url || "/healthcare.jpg",
      timeAgo: new Date(a.created_at || Date.now()).toLocaleDateString(),
    }));

  // Dummy data for Blogs and Newsletters
  const dummyBlogs = [
    {
      id: "b1",
      title: "How to Build a Modern Real Estate Portfolio",
      views: 1240,
      imageUrl: "https://placehold.co/400x400?text=Blog+1",
      timeAgo: "2 days ago",
    },
    {
      id: "b2",
      title: "Top 10 Investment Tips for 2026",
      views: 850,
      imageUrl: "https://placehold.co/400x400?text=Blog+2",
      timeAgo: "5 days ago",
    },
  ];

  const dummyNewsletters = [
    {
      id: "n1",
      title: "Weekly Market Insights - January Edition",
      views: 5400,
      imageUrl: "https://placehold.co/400x400?text=Newsletter+1",
      timeAgo: "1 week ago",
    },
    {
      id: "n2",
      title: "HomesPh Updates: Real Estate Trends in SEA",
      views: 3200,
      imageUrl: "https://placehold.co/400x400?text=Newsletter+2",
      timeAgo: "2 weeks ago",
    },
  ];

  const getCategoryLabel = (cat: string) =>
    Categories.find(
      (c) =>
        c.id.toLowerCase() === cat.toLowerCase() ||
        c.label.toLowerCase() === cat.toLowerCase()
    )?.label || cat;
  const getCountryLabel = (country: string) =>
    Countries.find(
      (c) =>
        c.id.toLowerCase() === country.toLowerCase() ||
        c.label.toLowerCase() === country.toLowerCase()
    )?.label || country;

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-[110px] py-12">
      <ArticleViewCounter articleId={articleId} />
      <ArticleBreadcrumb
        category={getCategoryLabel(article.category)}
        categoryId={article.category}
        country={getCountryLabel(article.country)}
        countryId={article.country}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Main Content Component Area */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <ArticleHeader
              category={getCategoryLabel(article.category)}
              categoryId={article.category}
              location={getCountryLabel(article.country)}
              countryId={article.country}
              title={article.title}
              subtitle={
                article.content.replace(/<[^>]*>/g, "").substring(0, 160) + "..."
              }
              author={{ name: "HomesPh News" }}
              date={new Date(article.timestamp).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              views={article.views_count}
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
              topics={
                article.keywords
                  ? article.keywords.split(",").map((t) => t.trim())
                  : []
              }
            />
            <ArticleShareBox />
          </section>
        </div>

        {/* Sidebar Area */}
        <aside className="space-y-8">
          <AdSpace
            className="h-[112px]"
            width="300x600"
            height="Leader board Ad"
          />

          {relatedArticles.length > 0 && (
            <MostReadTodayCard title="Related Articles" items={relatedArticles} />
          )}

          <MostReadTodayCard title="Related Blogs" items={dummyBlogs} />

          <MostReadTodayCard
            title="Related Newsletters"
            items={dummyNewsletters}
          />

          <AdSpace width="300x600" height="Leader board Ad" />
        </aside>
      </div>

      <AdSpace
        className="my-12"
        label="Advertisement Space"
        width="300x600"
        height="Leader board Ad"
      />
    </div>
  );
}
