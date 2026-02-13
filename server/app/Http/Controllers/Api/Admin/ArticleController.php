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
use Illuminate\Http\Request;

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
        $status = $validated['status'] ?? $request->query('status');
        \Illuminate\Support\Facades\Log::info('Admin API Index: Status = ' . ($status ?? 'NULL'));
        $perPage = $validated['per_page'] ?? 10;
        $page = $request->input('page', 1);
        $sortBy = $validated['sort_by'] ?? 'created_at';
        $sortDirection = $validated['sort_direction'] ?? 'desc';

        // Redirect to specialized Redis fetcher if status is 'pending'
        // This ensures we get the full list from the scraper/Redis
        if ($status === 'pending') {
            return $this->getPendingArticlesFromRedis($validated, $perPage, (int) $page);
        }

        // Apply common filters (Search, Dates, Topics)
        $query = Article::query()
            // Filter by status if specified (except 'all' and 'deleted' which handle is_deleted)
            // Note: 'pending' is redirected to getPendingArticlesFromRedis at line 41.
            ->when($status === 'published', fn($q) => $q->where('status', 'published'))
            ->when($status === 'pending review', fn($q) => $q->where('status', 'pending review'))
            ->when($status === 'rejected', fn($q) => $q->where('status', 'rejected'))
            ->when(!$status || $status === 'all', function ($q) {
                // For "All", only show active primary statuses to match getStatusCounts logic
                // This excludes 'rejected' articles from the general 'All' view
                return $q->whereIn('status', ['published', 'pending review']);
            })

            // Filter by is_deleted based on status
            ->when($status === 'deleted', fn($q) => $q->where('is_deleted', true))
            ->when($status !== 'deleted', fn($q) => $q->where('is_deleted', false))

            ->when($validated['search'] ?? null, function ($q, $s) {
                $q->where(function ($sub) use ($s) {
                    $sub->where('title', 'LIKE', "%{$s}%")
                        ->orWhere('summary', 'LIKE', "%{$s}%")
                        ->orWhere('content', 'LIKE', "%{$s}%")
                        ->orWhere('keywords', 'LIKE', "%{$s}%")
                        ->orWhere('topics', 'LIKE', "%{$s}%");
                });
            })
            ->when($validated['start_date'] ?? null, fn($q, $d) => $q->whereDate('created_at', '>=', $d))
            ->when($validated['end_date'] ?? null, fn($q, $d) => $q->whereDate('created_at', '<=', $d))
            ->when($validated['category'] ?? null, fn($q, $c) => $q->where('category', $c))
            ->when($validated['country'] ?? null, fn($q, $c) => $q->where('country', 'like', "%{$c}%"));

        // Get filter counts before pagination (from database)
        $availableCategories = (clone $query)->distinct()->whereNotNull('category')->pluck('category')->sort()->values()->toArray();
        $availableCountries = (clone $query)->distinct()->whereNotNull('country')->pluck('country')->sort()->values()->toArray();

        // Merge Redis filters if fetching 'all' or 'pending' status
        if (!$status || $status === 'all' || $status === 'pending') {
            try {
                $redisCountries = collect($this->redisService->getCountries())->pluck('name')->toArray();
                $redisCategories = collect($this->redisService->getCategories())->pluck('name')->toArray();

                // Merge and deduplicate
                $availableCategories = collect(array_merge($availableCategories, $redisCategories))
                    ->unique()
                    ->sort()
                    ->values()
                    ->toArray();
                $availableCountries = collect(array_merge($availableCountries, $redisCountries))
                    ->unique()
                    ->sort()
                    ->values()
                    ->toArray();
            } catch (\Exception $e) {
                \Log::warning('Failed to get Redis filters: ' . $e->getMessage());
            }
        }

        // Paginate DB results - Eager load to prevent N+1 queries
        $articles = $query
            ->with(['publishedSites:id,site_name', 'images:article_id,image_path'])
            ->select('id', 'article_id', 'title', 'summary', 'image', 'category', 'country', 'status', 'created_at', 'views_count', 'topics', 'keywords', 'source', 'original_url', 'is_deleted', 'content_blocks', 'template', 'author')
            ->orderBy($sortBy, $sortDirection)
            ->paginate($perPage);

        // Merge Redis articles if on early page of 'all' or 'pending'
        if ((!$status || $status === 'all' || $status === 'pending') && $page == 1) {
            try {
                // Pass all active filters to Redis filterArticles
                $redisRaw = $this->redisService->filterArticles([
                    'search' => $validated['search'] ?? null,
                    'category' => $validated['category'] ?? null,
                    'country' => $validated['country'] ?? null,
                ], ($status === 'pending') ? 50 : 5);

                $redisItems = collect($redisRaw)->map(function ($a) {
                    return [
                        'id' => (string) ($a['id'] ?? ''),
                        'title' => $a['title'] ?? 'Untitled',
                        'summary' => isset($a['content']) ? substr($a['content'], 0, 150) . '...' : '',
                        'content' => $a['content'] ?? '',
                        'image' => $a['image_url'] ?? null,
                        'image_url' => $a['image_url'] ?? null,
                        'category' => $a['category'] ?? 'General',
                        'country' => $a['country'] ?? 'Global',
                        'status' => 'pending',
                        'created_at' => (isset($a['timestamp']) && is_numeric($a['timestamp']))
                            ? date('Y-m-d H:i:s', (int) $a['timestamp'])
                            : ($a['timestamp'] ?? now()->toIso8601String()),
                        'views_count' => 0,
                        'published_sites' => [],
                    ];
                })->filter(fn($a) => !empty($a['id']));

                // Deduplicate: Don't show Redis items if they already exist in our DB
                // Check by both ID and Title to catch manual drafts of scraper items
                $redisIds = $redisItems->pluck('id')->toArray();
                $redisTitles = $redisItems->pluck('title')->toArray();
                
                $existingInDb = Article::whereIn('id', $redisIds)
                    ->orWhereIn('title', $redisTitles)
                    ->pluck('id', 'title')
                    ->toArray();

                $redisItems = $redisItems->filter(function($a) use ($existingInDb) {
                    return !in_array($a['id'], $existingInDb) && !isset($existingInDb[$a['title']]);
                });

                $merged = $redisItems->merge($articles->getCollection());
                $articles->setCollection($merged);
            } catch (\Exception $e) {
                \Log::warning('Redis merge failed: ' . $e->getMessage());
            }
        }

        return response()->json([
            'data' => ArticleResource::collection($articles->getCollection()),
            'current_page' => $articles->currentPage(),
            'per_page' => $articles->perPage(),
            'total' => $articles->total() + ((!$status || $status === 'all') ? 20 : 0), // Estimate total for UI if merging
            'last_page' => $articles->lastPage(),
            'from' => $articles->firstItem(),
            'to' => $articles->lastItem(),
            'status_counts' => $this->getStatusCounts(),
            'available_filters' => [
                'categories' => $availableCategories,
                'countries' => $availableCountries,
            ],
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

        // Use the unified filterArticles method which handles search, category, and country correctly
        $articles = $this->redisService->filterArticles([
            'search' => $search,
            'category' => $category,
            'country' => $country,
        ], 100);

        // Re-index array
        $articles = array_values($articles);

        // Sort by timestamp (newest first)
        usort($articles, fn($a, $b) => ($b['timestamp'] ?? 0) <=> ($a['timestamp'] ?? 0));

        // Manual pagination
        $total = count($articles);
        $offset = ($page - 1) * $perPage;
        $paginatedArticles = array_slice($articles, $offset, $perPage);

        // Format for admin display (add status field)
        $formattedArticles = ArticleResource::collection($paginatedArticles);

        // Get actual available filters from Redis
        $redisCountries = collect($this->redisService->getCountries())->pluck('name')->toArray();
        $redisCategories = collect($this->redisService->getCategories())->pluck('name')->toArray();

        \Illuminate\Support\Facades\Log::info('Admin API: Fetched ' . count($formattedArticles) . ' pending articles from Redis.');

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
                'categories' => $redisCategories,
                'countries' => $redisCountries,
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

        // Generate UUID for the article ID
        $validated['id'] = \Illuminate\Support\Str::uuid()->toString();
        $validated['article_id'] = $validated['id'];

        $siteNames = $validated['published_sites'] ?? [];
        unset($validated['published_sites']);

        // Remove fields that don't exist in the articles table
        unset($validated['gallery_images']);
        unset($validated['split_images']);
        unset($validated['date']);

        if (empty($validated['slug'])) {
            $validated['slug'] = \Illuminate\Support\Str::slug($validated['title']);
        } else {
            $validated['slug'] = \Illuminate\Support\Str::slug($validated['slug']);
        }

        $validated['is_deleted'] = false;
        $article = Article::create($validated);

        if (!empty($siteNames)) {
            $siteIds = \App\Models\Site::whereIn('site_name', $siteNames)->pluck('id');
            $article->publishedSites()->sync($siteIds);
        }

        // Handle Gallery Images
        $galleryImages = $request->input('gallery_images', []);
        if (is_array($galleryImages)) {
            foreach ($galleryImages as $imagePath) {
                if (!empty($imagePath)) {
                    $article->images()->create([
                        'image_path' => $imagePath
                    ]);
                }
            }
        }

        return (new ArticleResource($article))->response()->setStatusCode(201);
    }

    /**
     * Display the specified article.
     */
    public function show($id): JsonResponse|ArticleResource
    {
        if (is_numeric($id) || !\Illuminate\Support\Str::isUuid($id)) {
            $article = Article::with(['publishedSites:id,site_name', 'images:article_id,image_path'])->find($id);
            if ($article) {
                return new ArticleResource($article);
            }
        } else {
            $article = Article::with(['publishedSites:id,site_name', 'images:article_id,image_path'])->where('id', $id)->first();
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
        if (!\Illuminate\Support\Str::isUuid($id)) {
            return response()->json(['message' => 'Only pending Redis articles can be edited via this endpoint'], 400);
        }

        $payload = $request->validated();

        if (!isset($payload['content']) && isset($payload['summary'])) {
            $payload['content'] = $payload['summary'];
        }

        $updated = $this->redisService->updateArticle($id, $payload);

        if (!$updated) {
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

        // Handle Gallery Images Sync (support both field names for compatibility)
        $galleryImages = $validated['galleryImages'] ?? $validated['gallery_images'] ?? null;
        if (isset($galleryImages) && is_array($galleryImages)) {
            // Remove old images
            $article->images()->delete();

            // Add new images
            foreach ($galleryImages as $imagePath) {
                if (!empty($imagePath)) {
                    $article->images()->create([
                        'image_path' => $imagePath
                    ]);
                }
            }
        }
        
        // Remove fields that don't belong in the articles table
        unset($validated['galleryImages']);
        unset($validated['gallery_images']);
        unset($validated['split_images']); // Not stored in articles table
        unset($validated['date']); // Not a database column

        $article->update($validated);

        return new ArticleResource($article);
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
        \Log::info("Publishing article: {$id}");
        
        if (!\Illuminate\Support\Str::isUuid($id)) {
            return response()->json(['message' => 'Invalid article ID format'], 400);
        }

        try {
            $validated = $request->validated();
            $existing = Article::where('id', $id)->first();
            $redisArticle = $this->redisService->getArticle($id);

            if ($existing) {
            \Log::info("Found existing article in DB, updating status.");
            $updateData = ['is_deleted' => false, 'status' => 'published'];
            
            // If Redis has data, merge it, BUT preserve DB fields if they're more recent/complete
            if ($redisArticle) {
                // Only update from Redis if the DB field is empty or Redis has newer data
                // This prevents overwriting edited content_blocks with stale Redis data
                $updateData = array_merge($updateData, [
                    'title' => $redisArticle['title'] ?? $existing->title,
                    'summary' => $redisArticle['summary'] ?? $existing->summary,
                    'content' => $redisArticle['content'] ?? $existing->content,
                    // Preserve DB content_blocks if they exist (from editing), otherwise use Redis
                    'content_blocks' => (!empty($existing->content_blocks) ? $existing->content_blocks : ($redisArticle['content_blocks'] ?? [])),
                    // Preserve DB template if it exists (from editing), otherwise use Redis
                    'template' => (!empty($existing->template) ? $existing->template : ($redisArticle['template'] ?? '')),
                    // Preserve DB author if it exists (from editing), otherwise use Redis
                    'author' => (!empty($existing->author) ? $existing->author : ($redisArticle['author'] ?? '')),
                ]);
            }
            $existing->update($updateData);
            $article = $existing;
        }    else {
                \Log::info("Article not in DB, creating from Redis.");
                if (!$redisArticle) {
                    \Log::error("Redis article not found for ID: {$id}");
                    return response()->json(['message' => 'Article not found in database or pending queue'], 404);
                }

                \Log::info("Redis Article content found. Blocks count: " . (isset($redisArticle['content_blocks']) ? count($redisArticle['content_blocks']) : 0));

                $article = Article::create([
                    'id' => $id,
                    'article_id' => $id,
                    'title' => $redisArticle['title'] ?? '',
                    'original_title' => $redisArticle['title'] ?? '',
                    'summary' => $redisArticle['summary'] ?? substr($redisArticle['content'] ?? '', 0, 500),
                    'content' => $redisArticle['content'] ?? '',
                    'image' => $redisArticle['image_url'] ?? $redisArticle['image'] ?? '',
                    'category' => $redisArticle['category'] ?? '',
                    'country' => $redisArticle['country'] ?? '',
                    'source' => $redisArticle['source'] ?? '',
                    'original_url' => $redisArticle['original_url'] ?? '',
                    'keywords' => $redisArticle['keywords'] ?? '',
                    'topics' => $redisArticle['topics'] ?? [],
                    'status' => 'published',
                    'views_count' => 0,
                    'is_deleted' => false,
                    'slug' => \Illuminate\Support\Str::slug($redisArticle['title'] ?? ''),
                    'content_blocks' => $redisArticle['content_blocks'] ?? [],
                    'template' => $redisArticle['template'] ?? '',
                    'author' => $redisArticle['author'] ?? '',
                ]);
            }

            // Sync sites
            $siteNames = $validated['published_sites'] ?? [];
            if (!empty($siteNames)) {
                $siteIds = \App\Models\Site::whereIn('site_name', $siteNames)->pluck('id');
                $article->publishedSites()->sync($siteIds);
            }

            if (isset($validated['custom_titles'])) {
                $article->update(['custom_titles' => $validated['custom_titles']]);
            }

            // Sync images
            $galleryImages = $redisArticle['gallery_images'] ?? [];
            if (is_array($galleryImages)) {
                $article->images()->delete();
                foreach ($galleryImages as $imagePath) {
                    if (!empty($imagePath)) $article->images()->create(['image_path' => $imagePath]);
                }
            }

            $this->redisService->deleteArticle($id);
            \Log::info("Article {$id} published successfully.");
            
            return (new ArticleResource($article))->response()->setStatusCode(201);
            
        } catch (\Exception $e) {
            \Log::error("Failed to publish article {$id}: " . $e->getMessage());
            \Log::error($e->getTraceAsString());
            return response()->json(['message' => 'Failed to publish article: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified article from storage.
     * Handles both Database articles and Redis articles.
     */
    public function destroy(string $id): JsonResponse
    {
        $deletedFromDb = false;
        $deletedFromRedis = false;

        // 1. Try to find in Database
        $article = Article::find($id);
        if ($article) {
            $article->update(['is_deleted' => true]);
            $deletedFromDb = true;
        }

        // 2. Try to handle Redis article (if ID is UUID and not in DB)
        if (!$deletedFromDb && \Illuminate\Support\Str::isUuid($id)) {
            try {
                $redisArticle = $this->redisService->getArticle($id);
                if ($redisArticle) {
                    // Move to DB as soft-deleted article
                    Article::create([
                        'id' => $id,
                        'article_id' => $id,
                        'title' => $redisArticle['title'] ?? '',
                        'summary' => $redisArticle['summary'] ?? substr($redisArticle['content'] ?? '', 0, 500),
                        'content' => $redisArticle['content'] ?? '',
                        'image' => $redisArticle['image_url'] ?? $redisArticle['image'] ?? '',
                        'category' => $redisArticle['category'] ?? '',
                        'country' => $redisArticle['country'] ?? '',
                        'source' => $redisArticle['source'] ?? '',
                        'status' => 'pending review',
                        'is_deleted' => true,
                        'slug' => \Illuminate\Support\Str::slug($redisArticle['title'] ?? ''),
                    ]);

                    $this->redisService->deleteArticle($id);
                    $deletedFromRedis = true;
                }
            } catch (\Exception $e) {
                \Log::warning("Failed to soft-delete article {$id} from Redis: " . $e->getMessage());
            }
        }

        if (!$deletedFromDb && !$deletedFromRedis) {
            return response()->json(['message' => 'Article not found'], 404);
        }

        return response()->json([
            'message' => 'Article soft-deleted successfully',
            'from_db' => $deletedFromDb,
            'from_redis' => $deletedFromRedis
        ]);
    }

    /**
     * Restore a soft-deleted article.
     */
    public function restore(string $id): JsonResponse
    {
        $article = Article::find($id);

        if (!$article) {
            return response()->json(['message' => 'Article not found'], 404);
        }

        if (!$article->is_deleted) {
            return response()->json(['message' => 'Article is not deleted'], 400);
        }

        $article->update([
            'is_deleted' => false,
            'status' => 'pending review'
        ]);

        return response()->json([
            'message' => 'Article restored successfully',
            'article' => $article
        ]);
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
        // Database counts for active articles
        $counts = Article::where('is_deleted', false)
            ->selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status')
            ->toArray();

        // Count soft-deleted articles separately
        $deletedCount = Article::where('is_deleted', true)->count();

        // Redis count (all Redis articles are pending)
        $pendingCount = 0;
        try {
            $redisStats = $this->redisService->getStats();
            $pendingCount = $redisStats['total_articles'] ?? 0;
        } catch (\Exception $e) {
            \Log::warning('Redis failed in ArticleController@getStatusCounts: ' . $e->getMessage());
        }

        // Map status names to counts
        $publishedCount = $counts['published'] ?? 0;
        $pendingReviewCount = $counts['pending review'] ?? 0;

        // DB Total (Published + Pending Review) - excluding soft deleted
        $dbTotal = $publishedCount + $pendingReviewCount;

        // All = DB Total + Redis Pending
        $allCount = $dbTotal + $pendingCount;

        return [
            'all' => $allCount,
            'published' => $publishedCount,
            'pending' => $pendingCount + $pendingReviewCount,
            'deleted' => $deletedCount,
        ];
    }
}
