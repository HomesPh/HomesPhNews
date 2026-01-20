<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use OpenApi\Attributes as OA;

class ArticleController extends Controller
{
    #[OA\Get(
        path: "/api/admin/articles",
        operationId: "getAdminArticlesList",
        summary: "Get a filtered list of articles for the admin dashboard",
        description: "Returns a paginated list of all articles with extensive filtering and sorting capabilities.",
        security: [['sanctum' => []]],
        tags: ["Admin: Articles"],
        parameters: [
            new OA\Parameter(name: "status", in: "query", description: "Filter by status (published, pending review, rejected)", schema: new OA\Schema(type: "string")),
            new OA\Parameter(name: "category", in: "query", description: "Filter by category slug", schema: new OA\Schema(type: "string")),
            new OA\Parameter(name: "country", in: "query", description: "Filter by 2-letter country code", schema: new OA\Schema(type: "string")),
            new OA\Parameter(name: "search", in: "query", description: "Search term for title or summary", schema: new OA\Schema(type: "string")),
            new OA\Parameter(name: "start_date", in: "query", description: "Start date for filtering (YYYY-MM-DD)", schema: new OA\Schema(type: "string", format: "date")),
            new OA\Parameter(name: "end_date", in: "query", description: "End date for filtering (YYYY-MM-DD)", schema: new OA\Schema(type: "string", format: "date")),
            new OA\Parameter(name: "sort_by", in: "query", description: "Column to sort by (created_at, views_count, title)", schema: new OA\Schema(type: "string")),
            new OA\Parameter(name: "sort_direction", in: "query", description: "Sort direction (asc, desc)", schema: new OA\Schema(type: "string")),
            new OA\Parameter(name: "page", in: "query", description: "The page number to retrieve", schema: new OA\Schema(type: "integer"))
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
            'status'       => ['nullable', 'string', Rule::in(['published', 'pending review', 'rejected'])],
            'category'     => 'nullable|string|max:50',
            'country'      => 'nullable|string|size:2',
            'search'       => 'nullable|string|max:100',
            'start_date'   => 'nullable|date',
            'end_date'     => 'nullable|date|after_or_equal:start_date',
            'sort_by'      => ['nullable', 'string', Rule::in(['created_at', 'views_count', 'title'])],
            'sort_direction' => ['nullable', 'string', Rule::in(['asc', 'desc'])],
            'per_page'     => 'nullable|integer|min:5|max:100',
        ]);
        if ($validator->fails()) { return response()->json($validator->errors(), 422); }
        $validated = $validator->validated();
        $perPage = $validated['per_page'] ?? 15;
        $sortBy = $validated['sort_by'] ?? 'created_at';
        $sortDirection = $validated['sort_direction'] ?? 'desc';
        $filterBaseQuery = Article::query()
            ->when($validated['status'] ?? null, fn ($q, $status) => $q->where('status', $status))
            ->when($validated['search'] ?? null, fn ($q, $search) => $q->where(fn ($subQ) => $subQ->where('title', 'LIKE', "%{$search}%")->orWhere('summary', 'LIKE', "%{$search}%")))
            ->when($validated['start_date'] ?? null, fn ($q, $date) => $q->whereDate('created_at', '>=', $date))
            ->when($validated['end_date'] ?? null, fn ($q, $date) => $q->whereDate('created_at', '<=', $date));
        $availableCategories = (clone $filterBaseQuery)->when($validated['country'] ?? null, fn ($q, $country) => $q->where('country', $country))->distinct()->whereNotNull('category')->orderBy('category')->pluck('category');
        $availableCountries = (clone $filterBaseQuery)->when($validated['category'] ?? null, fn ($q, $category) => $q->where('category', $category))->distinct()->whereNotNull('country')->orderBy('country')->pluck('country');
        $articlesQuery = (clone $filterBaseQuery)
            ->when($validated['category'] ?? null, fn ($q, $category) => $q->where('category', $category))
            ->when($validated['country'] ?? null, fn ($q, $country) => $q->where('country', 'like', '%' . $country . '%'))
            ->select('id', 'title', 'summary', 'category', 'country', 'distributed_in', 'status', 'created_at', 'views_count')
            ->orderBy($sortBy, $sortDirection);
        $articles = $articlesQuery->paginate($perPage)->withQueryString();
        $articles->appends(['available_filters' => ['categories' => $availableCategories, 'countries' => $availableCountries]]);
        return response()->json($articles);
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
                    new OA\Property(property: "status", type: "string", example: "pending review", description: "Default is 'pending review'")
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
            'summary' => 'required|string|max:1000',
            'content' => 'required|string',
            'category' => 'required|string|max:50',
            'country' => 'required|string|size:2',
            'distributed_in' => 'nullable|string',
            'status' => ['nullable', 'string', Rule::in(['published', 'pending review'])],
        ]);
        if ($validator->fails()) { return response()->json($validator->errors(), 422); }
        $validated = $validator->validated();
        $validated['status'] = $validated['status'] ?? 'pending review';
        $article = Article::create($validated);
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
    public function show(Article $article)
    {
        return response()->json($article);
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
                    new OA\Property(property: "distributed_in", type: "string"),
                    new OA\Property(property: "status", type: "string"),
                    new OA\Property(
                        property: "custom_titles", 
                        type: "object",
                        description: "JSON object mapping platform names to custom titles",
                        example: '{"FilipinoHomes": "Custom Title 1", "Rent.ph": "Custom Title 2"}'
                    )
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
            'country' => 'nullable|string|size:2',
            'distributed_in' => 'nullable', // Can be string or array
            'status' => ['nullable', 'string', Rule::in(['published', 'pending review', 'rejected'])],
            'custom_titles' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $data = $request->all();

        // Handle distributed_in array from checkboxes
        if (isset($data['distributed_in']) && is_array($data['distributed_in'])) {
            $data['distributed_in'] = implode(', ', $data['distributed_in']);
        }

        $article->update($data);

        return response()->json($article);
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
}
