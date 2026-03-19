import { getArticleById } from "@/lib/api-v2";
import { notFound } from "next/navigation";
import ArticleDetailView from "./ArticleDetailView";

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

  return <ArticleDetailView article={article} />;
}
