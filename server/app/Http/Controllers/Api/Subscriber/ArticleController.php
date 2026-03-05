<?php

namespace App\Http\Controllers\Api\Subscriber;

use App\Http\Controllers\Controller;
use App\Http\Resources\Articles\ArticleCollection;
use App\Http\Resources\Articles\ArticleResource;
use App\Models\Article;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Subscriber Article Controller
 *
 * Reads published articles ONLY from the database (no Redis).
 * Accessible to any authenticated user regardless of role.
 */
class ArticleController extends Controller
{
    /**
     * Get a paginated list of published articles with filters.
     */
    public function index(Request $request): JsonResponse
    {
        $search   = $request->input('search') ?? $request->input('q');
        $category = $request->input('category');
        $country  = $request->input('country');
        $perPage  = min(50, max(1, (int) $request->input('per_page', 10)));
        $page     = (int) $request->input('page', 1);

        $allowedCategories = $request->input('allowed_categories');
        $allowedCountries  = $request->input('allowed_countries');

        $query = Article::query()
            ->where('status', 'published')
            ->where('is_deleted', false)
            ->when($search, function ($q, $s) {
                $q->where(function ($sub) use ($s) {
                    $sub->where('title', 'LIKE', "%{$s}%")
                        ->orWhere('summary', 'LIKE', "%{$s}%");
                });
            })
            ->when($category, fn($q, $c) => $q->where('category', $c))
            ->when($country,  fn($q, $c) => $q->where('country', 'LIKE', "%{$c}%"))
            ->when($allowedCategories, fn($q, $c) => $q->whereIn('category', $c))
            ->when($allowedCountries, fn($q, $c) => $q->where(function ($sub) use ($c) {
                foreach ($c as $country) {
                    $sub->orWhere('country', 'LIKE', "%{$country}%");
                }
            }));

        // Base query for counts (respects search and allowedPrefs, but NOT the specific category/country filter)
        $baseCountQuery = Article::query()
            ->where('status', 'published')
            ->where('is_deleted', false)
            ->when($search, function ($q, $s) {
                $q->where(function ($sub) use ($s) {
                    $sub->where('title', 'LIKE', "%{$s}%")
                        ->orWhere('summary', 'LIKE', "%{$s}%");
                });
            })
            ->when($allowedCategories, fn($q, $c) => $q->whereIn('category', $c))
            ->when($allowedCountries, fn($q, $c) => $q->where(function ($sub) use ($c) {
                foreach ($c as $country) {
                    $sub->orWhere('country', 'LIKE', "%{$country}%");
                }
            }));
 
        // 1. Calculate Category Counts (respect search and country)
        $availableCategories = (clone $baseCountQuery)
            ->when($country, fn($q, $c) => $q->where('country', 'LIKE', "%{$c}%"))
            ->groupBy('category')
            ->selectRaw('category as name, count(*) as count')
            ->orderBy('name')
            ->get()
            ->filter(fn($i) => !empty($i->name))
            ->values();
 
        // 2. Calculate Country Counts (respect search and category)
        $availableCountries = (clone $baseCountQuery)
            ->when($category, fn($q, $c) => $q->where('category', $c))
            ->groupBy('country')
            ->selectRaw('country as name, count(*) as count')
            ->orderBy('name')
            ->get()
            ->filter(fn($i) => !empty($i->name))
            ->values();

        $articles = $query
            ->with(['publishedSites:id,site_name', 'images:article_id,image_path'])
            ->select('id', 'article_id', 'slug', 'title', 'summary', 'image', 'category', 'country', 'status', 'created_at', 'views_count', 'topics', 'source', 'original_url', 'is_deleted')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);

        return response()->json([
            'data'             => ArticleResource::collection($articles->getCollection()),
            'current_page'     => $articles->currentPage(),
            'per_page'         => $articles->perPage(),
            'total'            => $articles->total(),
            'last_page'        => $articles->lastPage(),
            'from'             => $articles->firstItem(),
            'to'               => $articles->lastItem(),
            'available_filters' => [
                'categories' => $availableCategories,
                'countries'  => $availableCountries,
            ],
        ]);
    }

    /**
     * Show a single published article by ID or slug.
     */
    public function show(string $id): JsonResponse|ArticleResource
    {
        $article = Article::with(['publishedSites:id,site_name', 'images:article_id,image_path'])
            ->where('is_deleted', false)
            ->where(function ($q) use ($id) {
                $q->where('id', $id)->orWhere('slug', $id);
            })
            ->first();

        if (!$article) {
            return response()->json(['message' => 'Article not found'], 404);
        }

        return new ArticleResource($article);
    }
}
