import ArticleBreadcrumb from "@/components/features/article/ArticleBreadcrumb";
import ArticleHeader from "@/components/features/article/ArticleHeader";
import ArticleFeaturedImage from "@/components/features/article/ArticleFeaturedImage";
import ArticleContent from "@/components/features/article/ArticleContent";
import ArticleShareBox from "@/components/features/article/ArticleShareBox";
import RelatedArticles from "@/components/features/article/RelatedArticles";

// dummy article data
import { articleData } from "./data";

export default function Article() {
  return (
    <div className="max-w-7xl mx-auto">
      <ArticleBreadcrumb category={articleData.category} country={articleData.country} />
      <ArticleHeader
        category={articleData.category}
        location={articleData.country}
        title={articleData.title}
        subtitle={articleData.subtitle}
        author={articleData.author}
        date={articleData.createdAt}
        views={articleData.views}
      />
      <ArticleFeaturedImage
        src={articleData.featuredImageUrl}
        alt={articleData.title}
        caption=""
      />
      <ArticleContent content={articleData.content} topics={articleData.topics} />
      <ArticleShareBox />
      <RelatedArticles articles={articleData.relatedArticles} />
    </div>
  );
}