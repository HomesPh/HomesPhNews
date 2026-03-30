<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Articles\ExternalArticleCollection;
use App\Http\Resources\Articles\ExternalArticleResource;
use App\Http\Resources\Restaurants\RestaurantCollection;
use App\Models\Category;
use App\Models\City;
use App\Models\Country;
use App\Models\Province;
use App\Models\Restaurant;
use Illuminate\Http\Request;

class SiteContentController extends Controller
{
    // ─── Articles ────────────────────────────────────────────────────

    public function getArticles(Request $request)
    {
        $site = $request->attributes->get('site');

        $query = $site->articles()
            ->with(['publishedSites:id,site_name', 'province', 'city'])
            ->where('status', 'published');

        $search = $request->input('search') ?? $request->input('q');
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('summary', 'like', "%{$search}%")
                    ->orWhere('keywords', 'like', "%{$search}%")
                    ->orWhere('topics', 'like', "%{$search}%");
            });
        }

        if ($category = $request->input('category')) {
            $query->where('category', $category);
        }

        if ($country = $request->input('country')) {
            $query->where('country', $country);
        }

        if ($province = $request->input('province')) {
            $query->where('province_id', $province);
        }

        if ($city = $request->input('city')) {
            $query->where('city_id', $city);
        }

        if ($topic = $request->input('topic')) {
            $query->whereRaw('JSON_CONTAINS(topics, ?)', [json_encode($topic)]);
        }

        $perPage = min(100, max(1, (int) ($request->input('per_page') ?? $request->input('limit') ?? 20)));

        $articles = $query
            ->orderByDesc('published_at')
            ->orderByDesc('created_at')
            ->paginate($perPage);

        return response()->json([
            'site' => [
                'name' => $site->site_name,
                'url' => $site->site_url,
                'description' => $site->site_description,
            ],
            'data' => new ExternalArticleCollection($articles),
        ]);
    }

    public function getArticle(Request $request, string $identifier)
    {
        $site = $request->attributes->get('site');

        $isUuid = (bool) preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-/i', $identifier);

        $article = $site->articles()
            ->where($isUuid ? 'articles.id' : 'articles.slug', $identifier)
            ->with(['publishedSites:id,site_name', 'province', 'city'])
            ->where('status', 'published')
            ->first();

        if ($article === null) {
            abort(404, 'Article not found');
        }

        return response()->json([
            'article' => new ExternalArticleResource($article),
        ]);
    }

    // ─── Restaurants ─────────────────────────────────────────────────

    public function getRestaurants(Request $request)
    {
        $site = $request->attributes->get('site');

        $query = Restaurant::where('status', 'published')
            ->whereJsonContains('published_sites', $site->site_name);

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($country = $request->input('country')) {
            $query->where('country', $country);
        }

        if ($city = $request->input('city')) {
            $query->where('city', $city);
        }

        $cuisineType = $request->input('cuisine_type') ?? $request->input('topic');
        if ($cuisineType) {
            $query->where('cuisine_type', $cuisineType);
        }

        $perPage = min(100, max(1, (int) ($request->input('per_page') ?? $request->input('limit') ?? 20)));

        $restaurants = $query
            ->orderByDesc('created_at')
            ->paginate($perPage);

        return response()->json([
            'site' => [
                'name' => $site->site_name,
                'url' => $site->site_url,
                'description' => $site->site_description,
            ],
            'data' => new RestaurantCollection($restaurants),
        ]);
    }

    // ─── Metadata (for partner filter dropdowns) ─────────────────────

    public function getCategories()
    {
        $categories = Category::where('is_active', true)
            ->get(['id', 'name', 'slug']);

        return response()->json($categories);
    }

    public function getCountries()
    {
        $countries = Country::where('is_active', true)
            ->get(['id', 'name']);

        return response()->json($countries);
    }

    public function getProvinces(Request $request)
    {
        $query = Province::query()->select(['id', 'name', 'country_id']);

        if ($countryId = $request->input('country_id')) {
            $query->where('country_id', $countryId);
        }

        return response()->json($query->orderBy('name')->get());
    }

    public function getCities(Request $request)
    {
        $query = City::query()->select(['city_id', 'name', 'province_id', 'country_id']);

        if ($countryId = $request->input('country_id')) {
            $query->where('country_id', $countryId);
        }

        if ($provinceId = $request->input('province_id')) {
            $query->where('province_id', $provinceId);
        }

        return response()->json($query->orderBy('name')->get());
    }
}
