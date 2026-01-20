import ArticleCard from "@/components/features/dashboard/ArticleCard";
import { articles } from "../data";

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function SearchPage({ searchParams }: Props) {
    const { q, topic } = await searchParams;

    const searchQuery = Array.isArray(q) ? q[0] : q;
    const topicQuery = Array.isArray(topic) ? topic[0] : topic;

    // Filter logic
    let filteredArticles = articles;
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredArticles = articles.filter(article =>
            article.title.toLowerCase().includes(query) ||
            article.description.toLowerCase().includes(query)
        );
    } else if (topicQuery) {
        const query = topicQuery.toLowerCase();
        filteredArticles = articles.filter(article =>
            article.topics?.some(t => t.toLowerCase().includes(query)) ||
            article.category.toLowerCase().includes(query) ||
            article.title.toLowerCase().includes(query)
        );
    }

    return (
        <div className="w-full space-y-6">
            <h1 className="text-3xl font-bold">
                {searchQuery ? `Search Results for "${searchQuery}"` : `Trending Topic: ${topicQuery}`}
            </h1>

            {filteredArticles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredArticles.map((article) => (
                        <ArticleCard
                            key={article.id}
                            id={article.id}
                            category={article.category}
                            location={article.location}
                            title={article.title}
                            description={article.description}
                            timeAgo={article.timeAgo}
                            views={article.views}
                            imageSrc={article.imageSrc}
                        />
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 text-lg">No articles found matching your criteria.</p>
            )}
        </div>
    );
}
