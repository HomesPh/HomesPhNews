import { getArticleById, getArticlesList } from "@/lib/api-v2";
import { mockSpecialtyContent } from "@/lib/api-v2/mock/mockArticles";
import MostReadTodayCard from "@/components/features/dashboard/MostReadTodayCard";
import AdSpace from "@/components/features/admin/ads/AdSpace";

interface RelatedArticlesSidebarProps {
  id: string;
}

export default async function RelatedArticlesSidebar({ id }: RelatedArticlesSidebarProps) {
  let article;
  try {
    const response = await getArticleById(id);
    article = response;
  } catch (error) {
    return null;
  }

  if (!article) return null;

  // Fetch related articles (same category)
  let relatedArticles: { id: string; title: string; views: number; imageUrl: string; timeAgo: string; }[] = [];
  try {
    const listResponse = await getArticlesList({
      mode: "list",
      category: article.category,
      limit: 5,
    });

    const articlesArray = listResponse?.data?.data || [];

    relatedArticles = articlesArray
      .filter((a) => a.id !== article?.id)
      .slice(0, 4)
      .map((a) => ({
        id: a.id,
        slug: a.slug,
        title: a.title,
        views: a.views_count,
        imageUrl: a.image || "/healthcare.jpg",
        timeAgo: new Date(a.created_at).toLocaleDateString(),
      }));
  } catch (error) {
    console.error("Error fetching related articles:", error);
  }

  // Filter mock content for Blogs and Newsletters
  const dummyBlogs = mockSpecialtyContent
    .filter((a) => a.id.startsWith("dummy-blog"))
    .slice(0, 6)
    .map((a) => ({
      id: a.id,
      title: a.title,
      views: a.views_count,
      imageUrl: a.image || "https://placehold.co/400x400?text=No+Image",
      timeAgo: new Date(a.created_at).toLocaleDateString(),
    }));

  const dummyNewsletters = mockSpecialtyContent
    .filter((a) => a.id.startsWith("dummy-newsletter"))
    .slice(0, 6)
    .map((a) => ({
      id: a.id,
      title: a.title,
      views: a.views_count,
      imageUrl: a.image || "https://placehold.co/400x400?text=No+Image",
      timeAgo: new Date(a.created_at).toLocaleDateString(),
    }));

  return (
    <aside className="space-y-8">
      <AdSpace
        className="h-28"
        rotateInterval={3000}
      />

      {relatedArticles.length > 0 && (
        <MostReadTodayCard title="Related Articles" items={relatedArticles} />
      )}

      <MostReadTodayCard title="Related Blogs" items={dummyBlogs} />

      <MostReadTodayCard
        title="Related Newsletters"
        items={dummyNewsletters}
      />

      <AdSpace
        className="h-28"
        rotateInterval={3000}
      />
    </aside>
  );
}
