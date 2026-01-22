<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Services\RedisArticleService;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

/**
 * User Article Controller
 * 
 * Reads articles directly from Redis (where Python scraper stores them).
 * The Python Script is the SOURCE OF TRUTH.
 */
class ArticleController extends Controller
{
    protected RedisArticleService $redisService;

    public function __construct(RedisArticleService $redisService)
    {
        $this->redisService = $redisService;
    }

    #[OA\Get(
        path: "/api/article",
        operationId: "getUserArticleFeed",
        summary: "Display a dynamic feed of articles from Redis",
        description: "Returns Trending, Most Read (Latest), and Latest Global articles from Redis. Optionally filter by country, category, or search term.",
        tags: ["User: Articles"],
        parameters: [
            new OA\Parameter(name: "search", in: "query", description: "Search term for title/content", schema: new OA\Schema(type: "string")),
            new OA\Parameter(name: "country", in: "query", description: "Filter by country name (e.g., 'Philippines', 'United States')", schema: new OA\Schema(type: "string")),
            new OA\Parameter(name: "category", in: "query", description: "Filter by category (e.g., 'Real Estate', 'Business')", schema: new OA\Schema(type: "string"))
        ],
        responses: [
            new OA\Response(response: 200, description: "Successful operation", content: new OA\JsonContent(type: "object"))
        ]
    )]
    public function feed(Request $request)
    {
        $search = $request->input('search');
        $country = $request->input('country');
        $category = $request->input('category');

        // If filters are applied, return filtered results
        if ($search || $country || $category) {
            $articles = [];

            if ($search) {
                $articles = $this->redisService->searchArticles($search, 20);
            } elseif ($country) {
                $articles = $this->redisService->getArticlesByCountry($country, 20);
            } elseif ($category) {
                $articles = $this->redisService->getArticlesByCategory($category, 20);
            }

            return response()->json([
                'trending' => array_slice($articles, 0, 5),
                'most_read' => array_slice($articles, 0, 10),
                'latest_global' => array_slice($articles, 0, 5),
                'filter_applied' => compact('search', 'country', 'category'),
            ]);
        }

        // Default: Return unfiltered feed
        $trending = $this->redisService->getTrendingArticles(5);
        $latestGlobal = $this->redisService->getLatestArticles(10);

        return response()->json([
            'trending' => $trending,
            'most_read' => $latestGlobal, // Same as latest since Redis doesn't track views
            'latest_global' => array_slice($latestGlobal, 0, 5),
        ]);
    }

    #[OA\Get(
        path: "/api/articles/{id}",
        operationId: "getArticleById",
        summary: "Get a single article by ID",
        description: "Returns full article data from the database.",
        tags: ["User: Articles"],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, description: "Article ID (UUID)", schema: new OA\Schema(type: "string"))
        ],
        responses: [
            new OA\Response(response: 200, description: "Successful operation", content: new OA\JsonContent(type: "object")),
            new OA\Response(response: 404, description: "Article not found")
        ]
    )]
    public function show(string $id)
    {
        $article = Article::find($id);

        if (!$article) {
            // Fallback to Redis if not found in DB (useful during migration/transition)
            $articleData = $this->redisService->getArticle($id);
            if (!$articleData) {
                return response()->json(['error' => 'Article not found'], 404);
            }
            return response()->json($articleData);
        }

        return response()->json($article);
    }


    #[OA\Get(
        path: "/api/latest",
        operationId: "getLatestArticles",
        summary: "Get latest articles",
        description: "Returns the most recent articles sorted by timestamp.",
        tags: ["User: Articles"],
        parameters: [
            new OA\Parameter(name: "limit", in: "query", description: "Max articles to return (1-50)", schema: new OA\Schema(type: "integer", default: 10))
        ],
        responses: [
            new OA\Response(response: 200, description: "Successful operation")
        ]
    )]
    public function latest(Request $request)
    {
        $limit = min(50, max(1, (int) $request->input('limit', 10)));
        $articles = $this->redisService->getLatestArticles($limit);

        return response()->json($this->redisService->formatSummaries($articles));
    }

    #[OA\Get(
        path: "/api/search",
        operationId: "searchArticles",
        summary: "Search articles",
        description: "Search articles by title or content.",
        tags: ["User: Articles"],
        parameters: [
            new OA\Parameter(name: "q", in: "query", required: true, description: "Search query (min 2 chars)", schema: new OA\Schema(type: "string")),
            new OA\Parameter(name: "limit", in: "query", description: "Max articles to return", schema: new OA\Schema(type: "integer", default: 20))
        ],
        responses: [
            new OA\Response(response: 200, description: "Successful operation"),
            new OA\Response(response: 400, description: "Invalid query")
        ]
    )]
    public function search(Request $request)
    {
        $query = $request->input('q', '');

        if (strlen($query) < 2) {
            return response()->json(['error' => 'Search query must be at least 2 characters'], 400);
        }

        $limit = min(100, max(1, (int) $request->input('limit', 20)));
        $articles = $this->redisService->searchArticles($query, $limit);

        return response()->json([
            'query' => $query,
            'count' => count($articles),
            'data' => $this->redisService->formatSummaries($articles),
        ]);
    }

    #[OA\Get(
        path: "/api/countries",
        operationId: "getCountries",
        summary: "Get all countries with article counts",
        description: "Returns list of all countries that have articles.",
        tags: ["User: Metadata"],
        responses: [
            new OA\Response(response: 200, description: "Successful operation")
        ]
    )]
    public function countries()
    {
        return response()->json($this->redisService->getCountries());
    }

    #[OA\Get(
        path: "/api/categories",
        operationId: "getCategories",
        summary: "Get all categories with article counts",
        description: "Returns list of all categories that have articles.",
        tags: ["User: Metadata"],
        responses: [
            new OA\Response(response: 200, description: "Successful operation")
        ]
    )]
    public function categories()
    {
        return response()->json($this->redisService->getCategories());
    }

    #[OA\Get(
        path: "/api/stats",
        operationId: "getArticleStats",
        summary: "Get article statistics",
        description: "Returns total counts for articles, countries, and categories.",
        tags: ["User: Metadata"],
        responses: [
            new OA\Response(response: 200, description: "Successful operation")
        ]
    )]
    public function stats()
    {
        return response()->json($this->redisService->getStats());
    }
}
