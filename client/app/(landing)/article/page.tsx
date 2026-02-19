import { redirect } from "next/navigation";
import { getArticleById } from "@/lib/api-v2";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Article({ searchParams }: Props) {
  const { id, slug } = await searchParams;

  const querySlug = Array.isArray(slug) ? slug[0] : slug;
  const queryId = Array.isArray(id) ? id[0] : id;

  if (querySlug) {
    redirect(`/article/${querySlug}`);
  }

  if (queryId) {
    try {
      const article = await getArticleById(queryId);
      if (article && article.slug) {
        redirect(`/article/${article.slug}`);
      } else {
        // Fallback if no slug found, though we want to encourage slugs.
        // If we can't find a slug, we might have to redirect to the ID version 
        // BUT the ID version IS this page? No, the ID version would be /article/[id] 
        // if we set it up that way, but we are effectively treating [slug] as the catch-all.
        // So /article/123 works too if the API supports it.
        redirect(`/article/${queryId}`);
      }
    } catch (error) {
      console.error("Error fetching article for redirect:", error);
      // If error, just try redirecting to ID as path
      redirect(`/article/${queryId}`);
    }
  }

  // If no params, redirect to home or 404? 
  // Original didn't handle no params explicitly beyond notFound if articleId was missing.
  // Here we just redirect to home if accessed directly without params
  redirect("/");
}
