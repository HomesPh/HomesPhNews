<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Services\RedisArticleService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use OpenApi\Attributes as OA;

class ArticleController extends Controller
{
    protected RedisArticleService $redisService;

    public function __construct(RedisArticleService $redisService)
    {
        $this->redisService = $redisService;
    }

    #[OA\Get(
        path: "/api/admin/articles",
        operationId: "getAdminArticlesList",
        summary: "Get a filtered list of articles for the admin dashboard",
        description: "Returns a paginated list of all articles. For 'pending' status, articles are fetched from Redis (Python scraper source). For other statuses, articles come from the database.",
        security: [['sanctum' => []]],
        tags: ["Admin: Articles"],
        parameters: [
            new OA\Parameter(name: "status", in: "query", description: "Filter by status (published, pending, pending review, rejected). 'pending' fetches from Redis.", schema: new OA\Schema(type: "string")),
            new OA\Parameter(name: "category", in: "query", description: "Filter by category slug", schema: new OA\Schema(type: "string")),
            new OA\Parameter(name: "country", in: "query", description: "Filter by country name", schema: new OA\Schema(type: "string")),
            new OA\Parameter(name: "search", in: "query", description: "Search term for title or summary", schema: new OA\Schema(type: "string")),
            new OA\Parameter(name: "start_date", in: "query", description: "Start date for filtering (YYYY-MM-DD)", schema: new OA\Schema(type: "string", format: "date")),
            new OA\Parameter(name: "end_date", in: "query", description: "End date for filtering (YYYY-MM-DD)", schema: new OA\Schema(type: "string", format: "date")),
            new OA\Parameter(name: "sort_by", in: "query", description: "Column to sort by (created_at, views_count, title)", schema: new OA\Schema(type: "string")),
            new OA\Parameter(name: "sort_direction", in: "query", description: "Sort direction (asc, desc)", schema: new OA\Schema(type: "string")),
            new OA\Parameter(name: "topics", in: "query", description: "Filter by topics (comma-separated)", schema: new OA\Schema(type: "string")),
            new OA\Parameter(name: "page", in: "query", description: "The page number to retrieve", schema: new OA\Schema(type: "integer")),
            new OA\Parameter(name: "per_page", in: "query", description: "Number of articles per page", schema: new OA\Schema(type: "integer"))
        ],
        responses: [
            new OA\Response(response: 200, description: "Successful operation", content: new OA\JsonContent(type: "object")),
            new OA\Response(response: 401, description: "Unauthenticated"),
            new OA\Response(response: 422, description: "Validation Error")
        ]
    )]
    public function index(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'status' => ['nullable', 'string', Rule::in(['published', 'pending', 'pending review', 'rejected'])],
            'category' => 'nullable|string|max:50',
            'country' => 'nullable|string|max:50',
            'search' => 'nullable|string|max:100',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'sort_by' => ['nullable', 'string', Rule::in(['created_at', 'views_count', 'title', 'timestamp'])],
            'sort_direction' => ['nullable', 'string', Rule::in(['asc', 'desc'])],
            'per_page' => 'nullable|integer|min:5|max:100',
            'topics' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $validated = $validator->validated();
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
            ->when($status, fn($q, $s) => $q->where('status', $s))
            ->when($validated['search'] ?? null, fn($q, $search) => $q->where(fn($subQ) => $subQ->where('title', 'LIKE', "%{$search}%")->orWhere('summary', 'LIKE', "%{$search}%")))
            ->when($validated['start_date'] ?? null, fn($q, $date) => $q->whereDate('created_at', '>=', $date))
            ->when($validated['end_date'] ?? null, fn($q, $date) => $q->whereDate('created_at', '<=', $date))
            ->when($validated['topics'] ?? null, function ($q, $topics) {
                $topicArray = explode(',', $topics);
                foreach ($topicArray as $topic) {
                    $q->whereJsonContains('topics', trim($topic));
                }
            });

        $availableCategories = (clone $filterBaseQuery)->when($validated['country'] ?? null, fn($q, $country) => $q->where('country', $country))->distinct()->whereNotNull('category')->orderBy('category')->pluck('category');
        $availableCountries = (clone $filterBaseQuery)->when($validated['category'] ?? null, fn($q, $category) => $q->where('category', $category))->distinct()->whereNotNull('country')->orderBy('country')->pluck('country');

        $articlesQuery = (clone $filterBaseQuery)
            ->with(['publishedSites']) // Eager load to fix N+1
            ->when($validated['category'] ?? null, fn($q, $category) => $q->where('category', $category))
            ->when($validated['country'] ?? null, fn($q, $country) => $q->where('country', 'like', '%' . $country . '%'))
            ->select('id', 'title', 'summary', 'image', 'category', 'country', 'published_sites', 'status', 'created_at', 'views_count')
            ->orderBy($sortBy, $sortDirection);

        $articles = $articlesQuery->paginate($perPage)->withQueryString();
        $articles->appends(['available_filters' => ['categories' => $availableCategories, 'countries' => $availableCountries]]);

        // MERGE REDIS ARTICLES IF STATUS IS 'ALL' (First Page Only)
        if ((!$status || $status === 'all') && $page == 1) {
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
                    'status' => 'pending', // Explicitly set status
                    'created_at' => $a['timestamp'] ?? now()->toIso8601String(),
                    'views_count' => 0,
                ];
            });

            // Prepend Redis articles to the DB collection
            $mergedCollection = $redisArticles->merge($articles->getCollection());
            $articles->setCollection($mergedCollection);
        }

        // Calculate status counts
        $statusCounts = $this->getStatusCounts();

        // Add status counts to response
        $response = $articles->toArray();
        $response['status_counts'] = $statusCounts;

        return response()->json($response);
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
            $articles = array_filter($articles, fn($a) => 
                stripos($a['country'] ?? '', $country) !== false
            );
        }
        if ($category && !$country) {
            // Already filtered by category
        }

        // Filter by search if combined with other filters
        if ($search && ($country || $category)) {
            $searchLower = strtolower($search);
            $articles = array_filter($articles, fn($a) => 
                str_contains(strtolower($a['title'] ?? ''), $searchLower) ||
                str_contains(strtolower($a['content'] ?? ''), $searchLower)
            );
        }

        // Re-index array
        $articles = array_values($articles);

        // Sort by timestamp (newest first)
        usort($articles, fn($a, $b) => ($b['timestamp'] ?? 0) <=> ($a['timestamp'] ?? 0));

        // Manual pagination
        $total = count($articles);
        $offset = ($page - 1) * $perPage;
        $paginatedArticles = array_slice($articles, $offset, $perPage);

        // Format for admin display (add status field)
        $formattedArticles = array_map(function ($article) {
            return [
                'id' => $article['id'] ?? '',
                'title' => $article['title'] ?? '',
                'summary' => substr($article['content'] ?? '', 0, 200) . '...',
                'category' => $article['category'] ?? '',
                'country' => $article['country'] ?? '',
                'topics' => $article['topics'] ?? [],
                'keywords' => $article['keywords'] ?? '',
                'image_url' => $article['image_url'] ?? '',
                'original_url' => $article['original_url'] ?? '',
                'source' => $article['source'] ?? '',
                'status' => 'pending', // All Redis articles are pending
                'created_at' => isset($article['timestamp']) 
                    ? date('Y-m-d H:i:s', (int)$article['timestamp']) 
                    : null,
                'views_count' => 0,
            ];
        }, $paginatedArticles);

        // Optimization: Avoid Redis::keys() as it is slow. 
        // For now, return empty or common filters.
        $availableCountries = ['Global', 'Philippines', 'USA', 'Australia', 'Canada'];
        $availableCategories = ['Real Estate', 'Business', 'Technology', 'Economy', 'Tourism'];

        \Illuminate\Support\Facades\Log::info("Admin API: Fetched " . count($formattedArticles) . " pending articles from Redis.");

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

    #[OA\Post(
        path: "/api/admin/articles",
        operationId: "storeAdminArticle",
        summary: "Create a new article",
        description: "Creates a new article and returns its data.",
        security: [['sanctum' => []]],
        tags: ["Admin: Articles"],
        requestBody: new OA\RequestBody(
            required: true,
            description: "Article data payload",
            content: new OA\JsonContent(
                required: ["title", "summary", "content", "category", "country"],
                properties: [
                    new OA\Property(property: "title", type: "string", example: "Amazing New Article Title"),
                    new OA\Property(property: "summary", type: "string", example: "A short and engaging summary of the article."),
                    new OA\Property(property: "content", type: "string", example: "The full content of the article goes here..."),
                    new OA\Property(property: "category", type: "string", example: "tech"),
                    new OA\Property(property: "country", type: "string", example: "US"),
                    new OA\Property(property: "status", type: "string", example: "pending review", description: "Default is 'pending review'"),
                    new OA\Property(property: "topics", type: "array", items: new OA\Items(type: "string"), example: ["real-estate", "business"])
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: "Article created successfully", content: new OA\JsonContent(type: "object")),
            new OA\Response(response: 422, description: "Validation error"),
            new OA\Response(response: 401, description: "Unauthenticated")
        ]
    )]
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            // 'slug' column doesn't exist yet, remove this rule to avoid 500
            'summary' => 'required|string|max:1000',
            'content' => 'required|string',
            'category' => 'required|string|max:50',
            'country' => 'required|string|max:100', // Relaxed from size:2
            'image' => 'nullable|string|max:500',
            'published_sites' => 'nullable|array',
            'published_sites.*' => 'string',
            'status' => ['nullable', 'string', Rule::in(['published', 'pending review'])],
            'topics' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $validated = $validator->validated();
        $validated['status'] = $validated['status'] ?? 'pending review';
        
        // Extract sites to sync separately
        $siteNames = $validated['published_sites'] ?? [];
        unset($validated['published_sites']);

        $article = Article::create($validated);

        // Sync sites
        if (!empty($siteNames)) {
            $siteIds = \App\Models\Site::whereIn('site_name', $siteNames)->pluck('id');
            $article->publishedSites()->sync($siteIds);
        }

        return response()->json($article, 201);
    }

    #[OA\Get(
        path: "/api/admin/articles/{id}",
        operationId: "getAdminArticleById",
        summary: "Get a single article's details",
        description: "Returns all data for a single article.",
        security: [['sanctum' => []]],
        tags: ["Admin: Articles"],
        parameters: [
            new OA\Parameter(name: "id", in: "path", description: "The ID of the article", required: true, schema: new OA\Schema(type: "integer"))
        ],
        responses: [
            new OA\Response(response: 200, description: "Successful operation", content: new OA\JsonContent(type: "object")),
            new OA\Response(response: 404, description: "Resource Not Found"),
            new OA\Response(response: 401, description: "Unauthenticated")
        ]
    )]
    public function show($id)
    {
        // 1. Try Database
        // Check if ID is likely an integer (database ID) or if it exists in DB
        if (is_numeric($id) || ! \Illuminate\Support\Str::isUuid($id)) {
             $article = Article::find($id);
             if ($article) {
                 return response()->json($article);
             }
        } else {
             // It's a UUID, check DB anyway just in case we switch to UUIDs later
             $article = Article::where('id', $id)->first();
             if ($article) {
                 return response()->json($article);
             }
        }

        // 2. Try Redis (for pending articles)
        if (\Illuminate\Support\Str::isUuid($id)) {
            $redisArticle = $this->redisService->getArticle($id);
            
            if ($redisArticle) {
                // Normalize Redis data to match standard Article response
                $normalized = [
                    'id' => $redisArticle['id'],
                    'title' => $redisArticle['title'],
                    'summary' => $redisArticle['content'] ?? '', // Full content as summary if not separate
                    'content' => $redisArticle['content'] ?? '',
                    'category' => $redisArticle['category'] ?? '',
                    'location' => $redisArticle['country'] ?? '', // Front-end expects location sometimes
                    'country' => $redisArticle['country'] ?? '',
                    'image' => $redisArticle['image_url'] ?? '',
                    'image_url' => $redisArticle['image_url'] ?? '',
                    'status' => 'pending',
                    'views' => 0,
                    'views_count' => 0,
                    'topics' => $redisArticle['topics'] ?? [],
                    'tags' => $redisArticle['topics'] ?? [], // Front-end might expect tags
                    'keywords' => $redisArticle['keywords'] ?? '',
                    'original_url' => $redisArticle['original_url'] ?? '',
                    'source' => $redisArticle['source'] ?? '',
                    'date' => isset($redisArticle['timestamp']) 
                        ? date('Y-m-d', (int)$redisArticle['timestamp']) 
                        : null,
                    'created_at' => isset($redisArticle['timestamp']) 
                        ? date('Y-m-d H:i:s', (int)$redisArticle['timestamp']) 
                        : null,
                    'sites' => [] // No published sites yet
                ];
                return response()->json($normalized);
            }
        }

        return response()->json(['message' => 'Article not found'], 404);
    }

    #[OA\Patch(
        path: "/api/admin/articles/{id}/pending",
        operationId: "updatePendingAdminArticle",
        summary: "Update a pending (Redis) article",
        description: "Updates an AI-generated pending article stored in Redis before it is published to the main database.",
        security: [['sanctum' => []]],
        tags: ["Admin: Articles"],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "string"))
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: "title", type: "string"),
                    new OA\Property(property: "summary", type: "string"),
                    new OA\Property(property: "content", type: "string"),
                    new OA\Property(property: "category", type: "string"),
                    new OA\Property(property: "country", type: "string"),
                    new OA\Property(property: "image_url", type: "string"),
                    new OA\Property(property: "topics", type: "array", items: new OA\Items(type: "string")),
                    new OA\Property(property: "keywords", type: "string"),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Pending article updated successfully", content: new OA\JsonContent(type: "object")),
            new OA\Response(response: 404, description: "Article not found"),
            new OA\Response(response: 422, description: "Validation error")
        ]
    )]
    public function updatePending(Request $request, string $id)
    {
        // Only allow editing Redis-backed pending articles (UUID IDs)
        if (!\Illuminate\Support\Str::isUuid($id)) {
            return response()->json(['message' => 'Only pending Redis articles can be edited via this endpoint'], 400);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'nullable|string|max:255',
            'summary' => 'nullable|string|max:1000',
            'content' => 'nullable|string',
            'category' => 'nullable|string|max:50',
            'country' => 'nullable|string|max:50',
            'image_url' => 'nullable|string|max:255',
            'topics' => 'nullable|array',
            'keywords' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $payload = $validator->validated();

        // Map summary into content if content not provided
        if (!isset($payload['content']) && isset($payload['summary'])) {
            $payload['content'] = $payload['summary'];
        }

        $updated = $this->redisService->updateArticle($id, $payload);

        if (!$updated) {
            return response()->json(['message' => 'Article not found'], 404);
        }

        // Normalize to match the response from show()
        $normalized = [
            'id' => $updated['id'] ?? $id,
            'title' => $updated['title'] ?? '',
            'summary' => $updated['summary'] ?? ($updated['content'] ?? ''),
            'content' => $updated['content'] ?? '',
            'category' => $updated['category'] ?? '',
            'location' => $updated['country'] ?? '',
            'country' => $updated['country'] ?? '',
            'image' => $updated['image_url'] ?? '',
            'image_url' => $updated['image_url'] ?? '',
            'status' => 'pending',
            'views' => 0,
            'views_count' => 0,
            'topics' => $updated['topics'] ?? [],
            'tags' => $updated['topics'] ?? [],
            'keywords' => $updated['keywords'] ?? '',
            'original_url' => $updated['original_url'] ?? '',
            'source' => $updated['source'] ?? '',
            'date' => isset($updated['timestamp'])
                ? date('Y-m-d', (int) $updated['timestamp'])
                : null,
            'created_at' => isset($updated['timestamp'])
                ? date('Y-m-d H:i:s', (int) $updated['timestamp'])
                : null,
            'sites' => [],
        ];

        return response()->json($normalized);
    }

    #[OA\Patch(
        path: "/api/admin/articles/{id}",
        operationId: "updateAdminArticle",
        summary: "Update an existing article",
        description: "Updates article details, including custom titles for different platforms.",
        security: [['sanctum' => []]],
        tags: ["Admin: Articles"],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: "title", type: "string"),
                    new OA\Property(property: "summary", type: "string"),
                    new OA\Property(property: "content", type: "string"),
                    new OA\Property(property: "category", type: "string"),
                    new OA\Property(property: "country", type: "string"),
                    new OA\Property(property: "published_sites", type: "array", items: new OA\Items(type: "string")),
                    new OA\Property(property: "status", type: "string"),
                    new OA\Property(
                        property: "custom_titles",
                        type: "object",
                        description: "JSON object mapping platform names to custom titles",
                        example: '{"FilipinoHomes": "Custom Title 1", "Rent.ph": "Custom Title 2"}'
                    ),
                    new OA\Property(property: "topics", type: "array", items: new OA\Items(type: "string"), example: ["real-estate", "luxury"])
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Article updated successfully", content: new OA\JsonContent(type: "object")),
            new OA\Response(response: 404, description: "Article not found"),
            new OA\Response(response: 422, description: "Validation error")
        ]
    )]
    public function update(Request $request, Article $article)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'nullable|string|max:255',
            'summary' => 'nullable|string|max:1000',
            'content' => 'nullable|string',
            'category' => 'nullable|string|max:50',
            'country' => 'nullable|string|max:100',
            'image' => 'nullable|string|max:500',
            'published_sites' => 'nullable|array',
            'published_sites.*' => 'string',
            'status' => ['nullable', 'string', Rule::in(['published', 'pending review', 'rejected'])],
            'custom_titles' => 'nullable|array',
            'topics' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $validated = $validator->validated();
        
        // Extract sites to sync separately
        if (isset($validated['published_sites'])) {
            $siteNames = $validated['published_sites'];
            $siteIds = \App\Models\Site::whereIn('site_name', $siteNames)->pluck('id');
            $article->publishedSites()->sync($siteIds);
            unset($validated['published_sites']);
        }

        $article->update($validated);

        return response()->json($article->fresh());
    }

    #[OA\Patch(
        path: "/api/admin/articles/{id}/titles",
        operationId: "updateAdminArticleTitles",
        summary: "Update article titles specifically",
        description: "A dedicated endpoint to update the original title and all platform-specific headlines.",
        security: [['sanctum' => []]],
        tags: ["Admin: Articles"],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: "title", type: "string", description: "The original/main title"),
                    new OA\Property(
                        property: "custom_titles",
                        type: "object",
                        description: "JSON mapping of platforms to titles",
                        example: '{"FilipinoHomes": "Custom Headline", "Rent.ph": "Another Headline"}'
                    )
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Titles updated successfully", content: new OA\JsonContent(type: "object")),
            new OA\Response(response: 422, description: "Validation error")
        ]
    )]
    public function updateTitles(Request $request, Article $article)
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'custom_titles' => 'nullable|array',
        ]);

        $article->update($validated);

        return response()->json($article);
    }

    #[OA\Post(
        path: "/api/admin/articles/{id}/publish",
        operationId: "publishAdminArticle",
        summary: "Publish a pending article",
        description: "Moves a pending article from Redis to the MySQL database with 'published' status, then removes it from Redis.",
        security: [['sanctum' => []]],
        tags: ["Admin: Articles"],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, description: "UUID of the pending article", schema: new OA\Schema(type: "string"))
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["published_sites"],
                properties: [
                    new OA\Property(property: "published_sites", type: "array", items: new OA\Items(type: "string"), example: ["FilipinoHomes", "Rent.ph", "Homes"]),
                    new OA\Property(property: "custom_titles", type: "object", description: "Optional custom titles per site")
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: "Article published successfully"),
            new OA\Response(response: 404, description: "Pending article not found in Redis"),
            new OA\Response(response: 422, description: "Validation error")
        ]
    )]
    public function publish(Request $request, string $id)
    {
        // Validate UUID format
        if (!\Illuminate\Support\Str::isUuid($id)) {
            return response()->json(['message' => 'Invalid article ID format'], 400);
        }

        // Validate request
        $validator = Validator::make($request->all(), [
            'published_sites' => 'required|array|min:1',
            'published_sites.*' => 'string',
            'custom_titles' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Get article from Redis
        $redisArticle = $this->redisService->getArticle($id);
        if (!$redisArticle) {
            return response()->json(['message' => 'Pending article not found in Redis'], 404);
        }

        // Check if article already exists in database (prevent duplicates)
        if (Article::where('id', $id)->exists()) {
            return response()->json(['message' => 'Article already exists in database'], 409);
        }

        // Create article in MySQL database
        $article = Article::create([
            'id' => $id,
            'article_id' => $id, // Keep for legacy compatibility
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
            // 'published_sites' is accessed via relationship now
            'views_count' => 0,
        ]);

        // Sync Published Sites (Pivot)
        $siteNames = $request->input('published_sites', []);
        if (!empty($siteNames)) {
            $siteIds = \App\Models\Site::whereIn('site_name', $siteNames)->pluck('id');
            $article->publishedSites()->sync($siteIds);
        }

        // Handle custom titles if provided
        if ($request->has('custom_titles')) {
            $article->custom_titles = $request->input('custom_titles');
            $article->save();
        }

        // Delete from Redis
        $this->redisService->deleteArticle($id);

        \Illuminate\Support\Facades\Log::info("Article {$id} published to sites: " . implode(', ', $siteNames));

        return response()->json([
            'message' => 'Article published successfully',
            'article' => $article,
        ], 201);
    }

    #[OA\Post(
        path: "/api/admin/articles/{id}/reject",
        operationId: "rejectAdminArticle",
        summary: "Reject a pending article",
        description: "Moves a pending article from Redis to the MySQL database with 'rejected' status for record-keeping, then removes it from Redis.",
        security: [['sanctum' => []]],
        tags: ["Admin: Articles"],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, description: "UUID of the pending article", schema: new OA\Schema(type: "string"))
        ],
        requestBody: new OA\RequestBody(
            required: false,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: "reason", type: "string", description: "Optional reason for rejection")
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Article rejected successfully"),
            new OA\Response(response: 404, description: "Pending article not found in Redis")
        ]
    )]
    public function reject(Request $request, string $id)
    {
        // Validate UUID format
        if (!\Illuminate\Support\Str::isUuid($id)) {
            return response()->json(['message' => 'Invalid article ID format'], 400);
        }

        // Get article from Redis
        $redisArticle = $this->redisService->getArticle($id);
        if (!$redisArticle) {
            return response()->json(['message' => 'Pending article not found in Redis'], 404);
        }

        // Check if article already exists in database
        if (Article::where('id', $id)->exists()) {
            return response()->json(['message' => 'Article already exists in database'], 409);
        }

        // Create article in MySQL with rejected status (for record keeping)
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
            'published_sites' => null,
            'views_count' => 0,
        ]);

        // Delete from Redis
        $this->redisService->deleteArticle($id);

        $reason = $request->input('reason', 'No reason provided');
        \Illuminate\Support\Facades\Log::info("Article {$id} rejected. Reason: {$reason}");

        return response()->json([
            'message' => 'Article rejected successfully',
            'article' => $article,
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
