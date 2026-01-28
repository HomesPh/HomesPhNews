<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Articles\ArticleActionRequest;
use App\Http\Requests\Articles\ArticleQueryRequest;
use App\Http\Requests\Articles\StoreArticleRequest;
use App\Http\Requests\Articles\UpdateArticleRequest;
use App\Http\Resources\Articles\ArticleCollection;
use App\Http\Resources\Articles\ArticleResource;
use App\Models\Article;
use App\Services\RedisArticleService;
use Illuminate\Http\JsonResponse;

class ArticleController extends Controller
{
    protected RedisArticleService $redisService;

    public function __construct(RedisArticleService $redisService)
    {
        $this->redisService = $redisService;
    }

    /**
     * Display a listing of the articles.
     */
    public function index(ArticleQueryRequest $request): JsonResponse|ArticleCollection
    {
        $validated = $request->validated();
        $status = $validated['status'] ?? null;
        $perPage = $validated['per_page'] ?? 10;
        $page = $request->input('page', 1);

        // ═══════════════════════════════════════════════════════════════
        // PENDING STATUS: Fetch from Redis (Python Scraper Source)
        // ═══════════════════════════════════════════════════════════════
        if ($status === 'pending') {
            return $this->getPendingArticlesFromRedis($validated, $perPage, $page);
        }

        // ═══════════════════════════════════════════════════════════════
        // OTHER STATUSES: Fetch from Database
        // ═══════════════════════════════════════════════════════════════
        $sortBy = $validated['sort_by'] ?? 'created_at';
        $sortDirection = $validated['sort_direction'] ?? 'desc';

        $filterBaseQuery = Article::query()
            ->when($status, fn ($q, $s) => $q->where('status', $s))
            ->when($validated['search'] ?? null, fn ($q, $search) => $q->where(fn ($subQ) => $subQ->where('title', 'LIKE', "%{$search}%")->orWhere('summary', 'LIKE', "%{$search}%")))
            ->when($validated['start_date'] ?? null, fn ($q, $date) => $q->whereDate('created_at', '>=', $date))
            ->when($validated['end_date'] ?? null, fn ($q, $date) => $q->whereDate('created_at', '<=', $date))
            ->when($validated['topics'] ?? null, function ($q, $topics) {
                $topicArray = explode(',', $topics);
                foreach ($topicArray as $topic) {
                    $q->whereJsonContains('topics', trim($topic));
                }
            });

        $availableCategories = (clone $filterBaseQuery)->when($validated['country'] ?? null, fn ($q, $country) => $q->where('country', $country))->distinct()->whereNotNull('category')->orderBy('category')->pluck('category');
        $availableCountries = (clone $filterBaseQuery)->when($validated['category'] ?? null, fn ($q, $category) => $q->where('category', $category))->distinct()->whereNotNull('country')->orderBy('country')->pluck('country');

        $articlesQuery = (clone $filterBaseQuery)
            ->with(['publishedSites']) // Eager load to fix N+1
            ->when($validated['category'] ?? null, fn ($q, $category) => $q->where('category', $category))
            ->when($validated['country'] ?? null, fn ($q, $country) => $q->where('country', 'like', '%'.$country.'%'))
            ->select('id', 'title', 'summary', 'image', 'category', 'country', 'published_sites', 'status', 'created_at', 'views_count')
            ->orderBy($sortBy, $sortDirection);

        $articles = $articlesQuery->paginate($perPage)->withQueryString();
        $articles->appends(['available_filters' => ['categories' => $availableCategories, 'countries' => $availableCountries]]);

        // MERGE REDIS ARTICLES IF STATUS IS 'ALL' (First Page Only)
        if ((! $status || $status === 'all') && $page == 1) {
            $redisArticlesRaw = $this->redisService->getLatestArticles(5);
            $redisArticles = collect($redisArticlesRaw)->map(function ($a) {
                return [
                    'id' => $a['id'],
                    'title' => $a['title'] ?? 'Untitled',
                    'summary' => isset($a['content']) ? substr($a['content'], 0, 100) : '',
                    'image' => $a['image_url'] ?? null,
                    'category' => $a['category'] ?? 'Uncategorized',
                    'country' => $a['country'] ?? 'Global',
                    'published_sites' => [],
                    'status' => 'pending',
                    'created_at' => $a['timestamp'] ?? now()->toIso8601String(),
                    'views_count' => 0,
                ];
            });

            $mergedCollection = $redisArticles->merge($articles->getCollection());
            $articles->setCollection($mergedCollection);
        }

        return (new ArticleCollection($articles))->additional([
            'status_counts' => $this->getStatusCounts(),
        ]);
    }

    /**
     * Fetch pending articles from Redis (Python Scraper source of truth)
     */
    protected function getPendingArticlesFromRedis(array $filters, int $perPage, int $page): \Illuminate\Http\JsonResponse
    {
        $category = $filters['category'] ?? null;
        $country = $filters['country'] ?? null;
        $search = $filters['search'] ?? null;

        // Get articles from Redis
        if ($country) {
            $articles = $this->redisService->getArticlesByCountry($country, 100);
        } elseif ($category) {
            $articles = $this->redisService->getArticlesByCategory($category, 100);
        } elseif ($search) {
            $articles = $this->redisService->searchArticles($search, 100);
        } else {
            $articles = $this->redisService->getLatestArticles(100);
        }

        // Apply additional filters
        if ($country && $category) {
            $articles = array_filter($articles, fn ($a) => stripos($a['country'] ?? '', $country) !== false
            );
        }
        if ($category && ! $country) {
            // Already filtered by category
        }

        // Filter by search if combined with other filters
        if ($search && ($country || $category)) {
            $searchLower = strtolower($search);
            $articles = array_filter($articles, fn ($a) => str_contains(strtolower($a['title'] ?? ''), $searchLower) ||
                str_contains(strtolower($a['content'] ?? ''), $searchLower)
            );
        }

        // Re-index array
        $articles = array_values($articles);

        // Sort by timestamp (newest first)
        usort($articles, fn ($a, $b) => ($b['timestamp'] ?? 0) <=> ($a['timestamp'] ?? 0));

        // Manual pagination
        $total = count($articles);
        $offset = ($page - 1) * $perPage;
        $paginatedArticles = array_slice($articles, $offset, $perPage);

        // Format for admin display (add status field)
        $formattedArticles = array_map(function ($article) {
            return [
                'id' => $article['id'] ?? '',
                'title' => $article['title'] ?? '',
                'summary' => substr($article['content'] ?? '', 0, 200).'...',
                'category' => $article['category'] ?? '',
                'country' => $article['country'] ?? '',
                'topics' => $article['topics'] ?? [],
                'keywords' => $article['keywords'] ?? '',
                'image_url' => $article['image_url'] ?? '',
                'original_url' => $article['original_url'] ?? '',
                'source' => $article['source'] ?? '',
                'status' => 'pending', // All Redis articles are pending
                'created_at' => isset($article['timestamp'])
                    ? date('Y-m-d H:i:s', (int) $article['timestamp'])
                    : null,
                'views_count' => 0,
            ];
        }, $paginatedArticles);

        // Optimization: Avoid Redis::keys() as it is slow.
        // For now, return empty or common filters.
        $availableCountries = ['Global', 'Philippines', 'USA', 'Australia', 'Canada'];
        $availableCategories = ['Real Estate', 'Business', 'Technology', 'Economy', 'Tourism'];

        \Illuminate\Support\Facades\Log::info('Admin API: Fetched '.count($formattedArticles).' pending articles from Redis.');

        // Calculate status counts
        $statusCounts = $this->getStatusCounts();

        return response()->json([
            'data' => $formattedArticles,
            'current_page' => $page,
            'per_page' => $perPage,
            'total' => $total,
            'last_page' => (int) ceil($total / $perPage),
            'from' => $total > 0 ? $offset + 1 : null,
            'to' => $total > 0 ? min($offset + $perPage, $total) : null,
            'available_filters' => [
                'categories' => $availableCategories,
                'countries' => $availableCountries,
            ],
            'status_counts' => $statusCounts,
        ]);
    }

    /**
     * Store a newly created article.
     */
    public function store(StoreArticleRequest $request): JsonResponse|ArticleResource
    {
        $validated = $request->validated();
        $validated['status'] = $validated['status'] ?? 'pending review';

        $siteNames = $validated['published_sites'] ?? [];
        unset($validated['published_sites']);

        $article = Article::create($validated);

        if (! empty($siteNames)) {
            $siteIds = \App\Models\Site::whereIn('site_name', $siteNames)->pluck('id');
            $article->publishedSites()->sync($siteIds);
        }

        return (new ArticleResource($article->fresh()))->response()->setStatusCode(201);
    }

    /**
     * Display the specified article.
     */
    public function show($id): JsonResponse|ArticleResource
    {
        if (is_numeric($id) || ! \Illuminate\Support\Str::isUuid($id)) {
            $article = Article::find($id);
            if ($article) {
                return new ArticleResource($article);
            }
        } else {
            $article = Article::where('id', $id)->first();
            if ($article) {
                return new ArticleResource($article);
            }
        }

        if (\Illuminate\Support\Str::isUuid($id)) {
            $redisArticle = $this->redisService->getArticle($id);
            if ($redisArticle) {
                return new ArticleResource($redisArticle);
            }
        }

        return response()->json(['message' => 'Article not found'], 404);
    }

    /**
     * Update a pending (Redis) article.
     */
    public function updatePending(UpdateArticleRequest $request, string $id): JsonResponse|ArticleResource
    {
        if (! \Illuminate\Support\Str::isUuid($id)) {
            return response()->json(['message' => 'Only pending Redis articles can be edited via this endpoint'], 400);
        }

        $payload = $request->validated();

        if (! isset($payload['content']) && isset($payload['summary'])) {
            $payload['content'] = $payload['summary'];
        }

        $updated = $this->redisService->updateArticle($id, $payload);

        if (! $updated) {
            return response()->json(['message' => 'Article not found'], 404);
        }

        return new ArticleResource($updated);
    }

    /**
     * Update an existing database article.
     */
    public function update(UpdateArticleRequest $request, Article $article): ArticleResource
    {
        $validated = $request->validated();

        if (isset($validated['published_sites'])) {
            $siteNames = $validated['published_sites'];
            $siteIds = \App\Models\Site::whereIn('site_name', $siteNames)->pluck('id');
            $article->publishedSites()->sync($siteIds);
            unset($validated['published_sites']);
        }

        $article->update($validated);

        return new ArticleResource($article->fresh());
    }

    public function updateTitles(Request $request, Article $article)
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'custom_titles' => 'nullable|array',
        ]);

        $article->update($validated);

        return response()->json($article);
    }

    /**
     * Publish a pending article to the database.
     */
    public function publish(ArticleActionRequest $request, string $id): JsonResponse|ArticleResource
    {
        if (! \Illuminate\Support\Str::isUuid($id)) {
            return response()->json(['message' => 'Invalid article ID format'], 400);
        }

        $validated = $request->validated();

        $redisArticle = $this->redisService->getArticle($id);
        if (! $redisArticle) {
            return response()->json(['message' => 'Pending article not found in Redis'], 404);
        }

        if (Article::where('id', $id)->exists()) {
            return response()->json(['message' => 'Article already exists in database'], 409);
        }

        $article = Article::create([
            'id' => $id,
            'article_id' => $id,
            'title' => $redisArticle['title'] ?? '',
            'original_title' => $redisArticle['title'] ?? '',
            'summary' => substr($redisArticle['content'] ?? '', 0, 500),
            'content' => $redisArticle['content'] ?? '',
            'image' => $redisArticle['image_url'] ?? '',
            'category' => $redisArticle['category'] ?? '',
            'country' => $redisArticle['country'] ?? '',
            'source' => $redisArticle['source'] ?? '',
            'original_url' => $redisArticle['original_url'] ?? '',
            'keywords' => $redisArticle['keywords'] ?? '',
            'topics' => $redisArticle['topics'] ?? [],
            'status' => 'published',
            'views_count' => 0,
        ]);

        $siteNames = $validated['published_sites'] ?? [];
        if (! empty($siteNames)) {
            $siteIds = \App\Models\Site::whereIn('site_name', $siteNames)->pluck('id');
            $article->publishedSites()->sync($siteIds);
        }

        if (isset($validated['custom_titles'])) {
            $article->custom_titles = $validated['custom_titles'];
            $article->save();
        }

        $this->redisService->deleteArticle($id);

        \Illuminate\Support\Facades\Log::info("Article {$id} published to sites: ".implode(', ', $siteNames));

        return (new ArticleResource($article))->response()->setStatusCode(201);
    }

    /**
     * Reject a pending article.
     */
    public function reject(ArticleActionRequest $request, string $id): JsonResponse|ArticleResource
    {
        if (! \Illuminate\Support\Str::isUuid($id)) {
            return response()->json(['message' => 'Invalid article ID format'], 400);
        }

        $validated = $request->validated();

        $redisArticle = $this->redisService->getArticle($id);
        if (! $redisArticle) {
            return response()->json(['message' => 'Pending article not found in Redis'], 404);
        }

        if (Article::where('id', $id)->exists()) {
            return response()->json(['message' => 'Article already exists in database'], 409);
        }

        $article = Article::create([
            'id' => $id,
            'article_id' => $id,
            'title' => $redisArticle['title'] ?? '',
            'original_title' => $redisArticle['title'] ?? '',
            'summary' => substr($redisArticle['content'] ?? '', 0, 500),
            'content' => $redisArticle['content'] ?? '',
            'image' => $redisArticle['image_url'] ?? '',
            'category' => $redisArticle['category'] ?? '',
            'country' => $redisArticle['country'] ?? '',
            'source' => $redisArticle['source'] ?? '',
            'original_url' => $redisArticle['original_url'] ?? '',
            'keywords' => $redisArticle['keywords'] ?? '',
            'status' => 'rejected',
            'views_count' => 0,
        ]);

        $this->redisService->deleteArticle($id);

        $reason = $validated['reason'] ?? 'No reason provided';
        \Illuminate\Support\Facades\Log::info("Article {$id} rejected. Reason: {$reason}");

        return new ArticleResource($article);
    }

    /**
     * Get counts for all article statuses
     * - all: total from database + pending from Redis
     * - published: from database
     * - pending: from Redis (all articles in Redis are pending)
     * - rejected: from database
     */
    protected function getStatusCounts(): array
    {
        // Database counts - Single query group by is much faster
        $counts = Article::selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status')
            ->toArray();

        // Redis count (all Redis articles are pending)
        $redisStats = $this->redisService->getStats();
        $pendingCount = $redisStats['total_articles'] ?? 0;

        // Map status names to counts
        $publishedCount = $counts['published'] ?? 0;
        $rejectedCount = $counts['rejected'] ?? 0;
        $pendingReviewCount = $counts['pending review'] ?? 0;

        // All = published + rejected + pending (Redis) + pending review (DB)
        $allCount = $publishedCount + $rejectedCount + $pendingCount + $pendingReviewCount;

        return [
            'all' => $allCount,
            'published' => $publishedCount,
            'pending' => $pendingCount,
            'rejected' => $rejectedCount,
            'pending_review' => $pendingReviewCount,
        ];
    }
}
