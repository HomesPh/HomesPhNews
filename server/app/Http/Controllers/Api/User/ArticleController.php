<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Services\RedisArticleService;
use Illuminate\Http\Request;

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


    public function latest(Request $request)
    {
        $limit = min(50, max(1, (int) $request->input('limit', 10)));
        $articles = $this->redisService->getLatestArticles($limit);

        return response()->json($this->redisService->formatSummaries($articles));
    }

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

    public function stats()
    {
        return response()->json($this->redisService->getStats());
    }
}
