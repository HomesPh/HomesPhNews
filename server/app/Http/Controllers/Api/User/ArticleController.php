<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\Articles\ArticleQueryRequest;
use App\Http\Resources\Articles\ArticleCollection;
use App\Http\Resources\Articles\ArticleResource;
use App\Models\Article;
use App\Services\RedisArticleService;
use Illuminate\Http\JsonResponse;

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

    /**
     * Get a paginated list of articles with searching and filtering.
     *
     * This endpoint is intended for search results, category listings, etc.
     */
    public function index(ArticleQueryRequest $request): ArticleCollection
    {
        $validated = $request->validated();
        $search = $validated['search'] ?? $validated['q'] ?? null;
        $country = $validated['country'] ?? null;
        $category = $validated['category'] ?? null;
        $topic = $validated['topic'] ?? null;
        $perPage = min(100, max(1, (int) ($validated['per_page'] ?? $validated['limit'] ?? 10)));
        $page = $validated['page'] ?? (isset($validated['offset']) ? (int) ($validated['offset'] / $perPage) + 1 : 1);

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

        // NOTE: DO NOT load relationships here - ArticleResource queries them directly via raw DB queries
        $articles = $query
            ->select('id', 'title', 'summary', 'country', 'category', 'image', 'status', 'created_at as timestamp', 'views_count', 'topics', 'original_url')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);

        return (new ArticleCollection($articles))->additional([
            'meta' => [
                'filters' => array_filter([
                    'search' => $search,
                    'country' => $country,
                    'category' => $category,
                    'topic' => $topic,
                ]),
            ],
        ]);
    }

    /**
     * Get the curated article feed for the landing page.
     *
     * Includes trending, most read, and latest articles.
     *
     * @return array{trending: \App\Http\Resources\Articles\ArticleResource[], most_read: \App\Http\Resources\Articles\ArticleResource[], latest_global: \App\Http\Resources\Articles\ArticleResource[]}
     */
    public function feed(ArticleQueryRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $country = $validated['country'] ?? null;
        $category = $validated['category'] ?? null;

        $baseQuery = Article::where('status', 'published');

        if ($country) {
            $baseQuery->where('country', $country);
        }

        if ($category) {
            $baseQuery->where('category', $category);
        }

        $trending = (clone $baseQuery)
            ->select('id', 'title', 'country', 'category', 'image', 'topics', 'views_count', 'status', 'created_at as timestamp', 'original_url')
            ->orderBy('views_count', 'desc')
            ->limit(5)
            ->get();

        $mostRead = (clone $baseQuery)
            ->select('id', 'title', 'country', 'category', 'image', 'views_count', 'status', 'created_at as timestamp', 'original_url')
            ->orderBy('views_count', 'desc')
            ->limit(10)
            ->get();

        $latestGlobal = (clone $baseQuery)
            ->select('id', 'title', 'summary as content', 'country', 'category', 'status', 'created_at as timestamp', 'image', 'views_count', 'keywords', 'original_url')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        $categoryCounts = Article::groupBy('category')
            ->selectRaw('category, count(*) as count')
            ->pluck('count', 'category');

        return response()->json([
            'trending' => ArticleResource::collection($trending),
            'most_read' => ArticleResource::collection($mostRead),
            'latest_global' => ArticleResource::collection($latestGlobal),
            'category_counts' => $categoryCounts,
        ]);
    }

    /**
     * Show a single article.
     */
    public function show(string $id): JsonResponse|ArticleResource
    {
        $article = Article::find($id);

        if (! $article) {
            // Fallback to Redis if not found in DB
            $articleData = $this->redisService->getArticle($id);
            if (! $articleData) {
                return response()->json(['error' => 'Article not found'], 404);
            }

            return new ArticleResource($articleData);
        }

        return new ArticleResource($article);
    }

    /**
     * Increment article view count.
     */
    public function incrementViews(string $id): JsonResponse
    {
        $article = Article::find($id);

        if (! $article) {
            return response()->json(['error' => 'Article not found'], 404);
        }

        $article->increment('views_count');

        return response()->json([
            'message' => 'View count incremented',
            'views_count' => (int) $article->views_count,
        ]);
    }

    /**
     * Get statistics summary.
     */
    public function stats(): JsonResponse
    {
        return response()->json($this->redisService->getStats());
    }
}
