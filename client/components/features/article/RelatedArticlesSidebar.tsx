import { getArticleById, getArticlesList } from "@/lib/api-v2";
import MostReadTodayCard from "@/components/features/dashboard/MostReadTodayCard";
import AdSpace from "@/lib/ads/components/AdSpace";

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
        title: a.title,
        views: a.views_count,
        imageUrl: a.image || "/healthcare.jpg",
        timeAgo: new Date(a.created_at).toLocaleDateString(),
      }));
  } catch (error) {
    console.error("Error fetching related articles:", error);
  }

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

  return (
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
  );
}
