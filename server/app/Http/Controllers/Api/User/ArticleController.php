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
        summary: "Display a dynamic feed or list of articles",
        description: "Returns articles in two modes: 'feed' (structured dashboard with Trending, Most Read, Latest Global) or 'list' (filtered, paginated list with metadata). Performance is optimized via Database lookups.",
        tags: ["User: Articles"],
        parameters: [
            new OA\Parameter(
                name: "mode",
                in: "query",
                description: "Operational mode. Defaults to 'feed' if no filters are present, or 'list' if search is provided.",
                schema: new OA\Schema(type: "string", enum: ["feed", "list"])
            ),
            new OA\Parameter(name: "search", in: "query", description: "Keyword search in titles and summaries. Forces mode=list if mode is not specified.", schema: new OA\Schema(type: "string")),
            new OA\Parameter(name: "country", in: "query", description: "Filter results by country name (e.g., 'PH', 'Canada')", schema: new OA\Schema(type: "string")),
            new OA\Parameter(name: "category", in: "query", description: "Filter results by category name (e.g., 'Real Estate', 'Business')", schema: new OA\Schema(type: "string")),
            new OA\Parameter(name: "limit", in: "query", description: "Max results per page (used in 'list' mode)", schema: new OA\Schema(type: "integer", default: 10)),
            new OA\Parameter(name: "offset", in: "query", description: "Pagination offset (used in 'list' mode)", schema: new OA\Schema(type: "integer", default: 0))
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Successful operation",
                content: new OA\JsonContent(
                    oneOf: [
                        new OA\Schema(
                            title: "FeedModeResponse",
                            properties: [
                                new OA\Property(property: "trending", type: "array", items: new OA\Items(type: "object")),
                                new OA\Property(property: "most_read", type: "array", items: new OA\Items(type: "object")),
                                new OA\Property(property: "latest_global", type: "array", items: new OA\Items(type: "object"))
                            ]
                        ),
                        new OA\Schema(
                            title: "ListModeResponse",
                            properties: [
                                new OA\Property(property: "data", type: "array", items: new OA\Items(type: "object")),
                                new OA\Property(
                                    property: "meta",
                                    type: "object",
                                    properties: [
                                        new OA\Property(property: "total", type: "integer"),
                                        new OA\Property(property: "limit", type: "integer"),
                                        new OA\Property(property: "offset", type: "integer"),
                                        new OA\Property(property: "filters", type: "object")
                                    ]
                                )
                            ]
                        )
                    ]
                )
            )
        ]
    )]
    public function feed(Request $request)
    {
        $mode = $request->input('mode');
        $search = $request->input('search') ?? $request->input('q'); // Support both 'search' and 'q'
        $country = $request->input('country');
        $category = $request->input('category');
        $topic = $request->input('topic'); // Support topic filtering
        $limit = min(100, max(1, (int) $request->input('limit', 10)));
        $offset = max(0, (int) $request->input('offset', 0));

        // Default to list mode if search is provided
        if ($search && !$mode) {
            $mode = 'list';
        }

        // 1. Dashboard Mode (feed) or default if no filters
        if ($mode === 'feed' || (!$mode && !$search && !$country && !$category)) {
            $trending = Article::with(['publishedSites']) // Fix N+1
                ->select('id', 'title', 'country', 'category', 'image', 'topics', 'views_count')
                ->where('status', 'published')
                ->orderBy('views_count', 'desc')
                ->limit(5)
                ->get();

            $mostRead = Article::with(['publishedSites']) // Fix N+1
                ->select('id', 'title', 'country', 'category', 'image', 'views_count', 'created_at as timestamp')
                ->where('status', 'published')
                ->orderBy('views_count', 'desc')
                ->limit(10)
                ->get();

            $latestGlobal = Article::with(['publishedSites']) // Fix N+1
                ->select('id', 'title', 'summary as content', 'country', 'category', 'created_at as timestamp', 'image', 'views_count', 'keywords')
                ->where('status', 'published')
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get();

            return response()->json([
                'trending' => $trending,
                'most_read' => $mostRead,
                'latest_global' => $latestGlobal,
            ]);
        }

        // 2. List Mode or Filtered Mode
        $query = Article::query();

        // Always filter by published status for public feed
        $query->where('status', 'published');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'LIKE', "%{$search}%")
                    ->orWhere('summary', 'LIKE', "%{$search}%")
                    ->orWhere('content', 'LIKE', "%{$search}%")
                    ->orWhere('keywords', 'LIKE', "%{$search}%")
                    ->orWhere('topics', 'LIKE', "%{$search}%");
            });
        }

        if ($country) {
            $query->where('country', $country);
        }

        if ($category) {
            $query->where('category', $category);
        }

        if ($topic) {
            // Filter by topic using JSON search
            $query->whereRaw('JSON_CONTAINS(topics, ?)', [json_encode($topic)]);
        }

        $total = $query->count();

        $articles = $query->with(['publishedSites']) // Fix N+1
            ->select('id', 'title', 'summary', 'country', 'category', 'image', 'created_at as timestamp', 'views_count')
            ->orderBy('created_at', 'desc')
            ->offset($offset)
            ->limit($limit)
            ->get();

        return response()->json([
            'data' => $articles,
            'meta' => [
                'total' => $total,
                'limit' => $limit,
                'offset' => $offset,
                'filters' => array_filter([
                    'search' => $search,
                    'country' => $country,
                    'category' => $category,
                ]),
            ],
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

    /**
     * Increment article view count
     */
    #[OA\Post(
        path: "/api/articles/{id}/view",
        operationId: "incrementArticleViews",
        summary: "Increment article view count",
        description: "Increments the views_count for a specific article.",
        tags: ["User: Articles"],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, description: "Article ID (UUID)", schema: new OA\Schema(type: "string"))
        ],
        responses: [
            new OA\Response(response: 200, description: "Successful operation"),
            new OA\Response(response: 404, description: "Article not found")
        ]
    )]
    public function incrementViews(string $id)
    {
        $article = Article::find($id);

        if (!$article) {
            return response()->json(['error' => 'Article not found'], 404);
        }

        $article->increment('views_count');

        return response()->json([
            'message' => 'View count incremented',
            'views_count' => $article->views_count
        ]);
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
        $countries = Article::select('country as name', \Illuminate\Support\Facades\DB::raw('count(*) as count'))
            ->where('status', 'published')
            ->groupBy('country')
            ->orderBy('count', 'desc')
            ->get();

        return response()->json([
            'data' => $countries
        ]);
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
        $categories = Article::select('category as name', \Illuminate\Support\Facades\DB::raw('count(*) as count'))
            ->where('status', 'published')
            ->groupBy('category')
            ->orderBy('count', 'desc')
            ->get();

        return response()->json([
            'data' => $categories
        ]);
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
