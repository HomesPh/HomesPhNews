import { getArticleById } from "@/lib/api-v2";
import ArticleHeader from "./ArticleHeader";
import ArticleFeaturedImage from "./ArticleFeaturedImage";
import ArticleContent from "./ArticleContent";
import ArticleShareBox from "./ArticleShareBox";
import { Categories, Countries } from "@/app/data";
import { notFound } from "next/navigation";

interface ArticleDetailContentProps {
  id: string;
}

export default async function ArticleDetailContent({ id }: ArticleDetailContentProps) {
  let article;
  try {
    const response = await getArticleById(id);
    article = response;
  } catch (error) {
    console.error("Error fetching article:", error);
    notFound();
  }

  if (!article) {
    notFound();
  }

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
    <section>
      <ArticleHeader
        category={getCategoryLabel(article.category)}
        categoryId={article.category}
        location={getCountryLabel(article.country)}
        countryId={article.country}
        title={article.title}
        subtitle={
          article.content ? article.content.replace(/<[^>]*>/g, "").substring(0, 160) + "..." : ""
        }
        author={{ name: "HomesPh News" }}
        date={new Date(article.created_at || Date.now()).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
        views={article.views_count}
      />
      {article.image && (
        <ArticleFeaturedImage
          src={article.image}
          alt={article.title}
          caption=""
        />
      )}

      <ArticleContent
        content={article.content}
        topics={
          article.keywords
            ? article.keywords.split(",").map((t: string) => t.trim())
            : []
        }
        originalUrl={article.original_url}
      />
      <ArticleShareBox />
    </section>
  );
}
