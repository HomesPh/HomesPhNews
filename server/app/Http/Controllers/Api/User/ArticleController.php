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
        $perPage = min(100, max(1, (int)($validated['per_page'] ?? $validated['limit'] ?? 10)));
        $page = $validated['page'] ?? (isset($validated['offset']) ? (int)($validated['offset'] / $perPage) + 1 : 1);

        $query = Article::query();

        // Always filter by published status for public feed
        $query->where('status', 'published')->where('is_deleted', false);

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

        // Eager load relationships to prevent N+1 queries
        $articles = $query
            ->with(['publishedSites:id,site_name', 'images:article_id,image_path'])
            ->select('id', 'slug', 'title', 'summary', 'content', 'country', 'category', 'image', 'status', 'created_at as timestamp', 'views_count', 'topics', 'original_url')
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

        $baseQuery = Article::where('status', 'published')->where('is_deleted', false);

        if ($country) {
            $baseQuery->where('country', $country);
        }

        if ($category) {
            $baseQuery->where('category', $category);
        }

        $trending = (clone $baseQuery)
            ->with(['publishedSites:id,site_name', 'images:article_id,image_path'])
            ->select('id', 'slug', 'title', 'country', 'category', 'image', 'topics', 'views_count', 'status', 'created_at as timestamp', 'original_url')
            ->orderBy('views_count', 'desc')
            ->limit(5)
            ->get();

        $mostRead = (clone $baseQuery)
            ->with(['publishedSites:id,site_name', 'images:article_id,image_path'])
            ->select('id', 'slug', 'title', 'country', 'category', 'image', 'views_count', 'status', 'created_at as timestamp', 'original_url')
            ->orderBy('views_count', 'desc')
            ->limit(10)
            ->get();

        $latestGlobal = (clone $baseQuery)
            ->with(['publishedSites:id,site_name', 'images:article_id,image_path'])
            ->select('id', 'slug', 'title', 'summary', 'content', 'country', 'category', 'status', 'created_at as timestamp', 'image', 'views_count', 'keywords', 'original_url')
            ->orderBy('created_at', 'desc')
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
        // 1. Check Database for main articles
        $article = Article::with(['publishedSites:id,site_name', 'images:article_id,image_path'])
            ->where('is_deleted', false)
            ->where(function ($query) use ($id) {
            $query->where('id', $id)
                ->orWhere('slug', $id);
        })
            ->first();

        if ($article) {
            return new ArticleResource($article);
        }

        // 2. Fallback to Published Restaurants in DB
        $restaurant = \App\Models\Restaurant::where('status', 'published')
            ->where('id', $id)
            ->first();

        if ($restaurant) {
            // Map restaurant model items to article-compatible array
            $mapped = [
                'id' => $restaurant->id,
                'slug' => $restaurant->id,
                'title' => $restaurant->name,
                'summary' => $restaurant->clickbait_hook ?? $restaurant->description ?? '',
                'content' => $restaurant->description ?? '',
                'category' => 'Restaurant',
                'country' => $restaurant->country ?? 'Global',
                'image_url' => $restaurant->image_url ?? '',
                'image' => $restaurant->image_url ?? '',
                'views_count' => $restaurant->views_count ?? 0,
                'created_at' => $restaurant->created_at,
                'source' => 'HomesPh Restaurant',
                'original_url' => $restaurant->original_url ?? '#',
                'topics' => [$restaurant->cuisine_type ?? 'Restaurant'],
                'published_sites' => [],
                'sites' => [],
                'galleryImages' => [],
                'is_deleted' => false,
                'is_redis' => false,

                // Rich Metadata for UI Matching Admin Page
                'clickbait_hook' => $restaurant->clickbait_hook,
                'city' => $restaurant->city,
                'location' => $restaurant->location,
                'cuisine_type' => $restaurant->cuisine_type,
                'rating' => $restaurant->rating,
                'is_filipino_owned' => $restaurant->is_filipino_owned,
                'price_range' => $restaurant->price_range,
                'avg_meal_cost' => $restaurant->avg_meal_cost,
                'budget_category' => $restaurant->budget_category,
                'specialty_dish' => $restaurant->specialty_dish,
                'contact_info' => $restaurant->contact_info,
                'why_filipinos_love_it' => $restaurant->why_filipinos_love_it,
                'menu_highlights' => $restaurant->menu_highlights,
                'google_maps_url' => $restaurant->google_maps_url,
                'address' => $restaurant->address,
                'website' => $restaurant->website,
                'social_media' => $restaurant->social_media,
                'opening_hours' => $restaurant->opening_hours,
                'brand_story' => $restaurant->brand_story,
                'tags' => $restaurant->tags,
                'features' => $restaurant->features,
            ];
            return new ArticleResource((object)$mapped);
        }

        // 3. Fallback to Redis for pending scrapers
        $articleData = $this->redisService->getArticle($id);
        if ($articleData) {
            return new ArticleResource($articleData);
        }

        return response()->json(['error' => 'Article not found'], 404);
    }

    /**
     * Increment article view count.
     */
    public function incrementViews(string $id): JsonResponse
    {
        // 1. Try Article
        $article = Article::where('id', $id)
            ->orWhere('slug', $id)
            ->first();

        if ($article) {
            $article->increment('views_count');
            return response()->json([
                'message' => 'View count incremented',
                'views_count' => (int)$article->views_count,
            ]);
        }

        // 2. Try Restaurant
        $restaurant = \App\Models\Restaurant::where('id', $id)->first();
        if ($restaurant) {
            $restaurant->increment('views_count');
            return response()->json([
                'message' => 'Restaurant view count incremented',
                'views_count' => (int)$restaurant->views_count,
            ]);
        }

        return response()->json(['error' => 'Not found'], 404);
    }

    /**
     * Get statistics summary.
     */
    public function stats(): JsonResponse
    {
        return response()->json($this->redisService->getStats());
    }
}
