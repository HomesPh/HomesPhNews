<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Articles\ExternalArticleCollection;
use App\Http\Resources\Articles\ExternalArticleResource;
use App\Http\Resources\Restaurants\RestaurantCollection;
use App\Models\Article;
use App\Models\Category;
use App\Models\City;
use App\Models\Country;
use App\Models\Province;
use App\Models\Restaurant;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

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
                    ->orWhere('topics', 'like', "%{$search}%")
                    ->orWhere('content_blocks', 'like', "%{$search}%");
            });
        }

        if ($request->filled('category_slug')) {
            $slug = (string) $request->input('category_slug');
            $name = Category::where('slug', $slug)->where('is_active', true)->value('name');
            if ($name) {
                $query->where('category', $name);
            } else {
                $query->whereRaw('1 = 0');
            }
        } elseif ($category = $request->input('category')) {
            $query->where('category', $category);
        }

        $countryContext = null;
        if ($request->filled('country_slug')) {
            $countryContext = $this->resolveCountryFromSegment((string) $request->input('country_slug'));
            if ($countryContext) {
                $query->where('country', $countryContext['name']);
            } else {
                $query->whereRaw('1 = 0');
            }
        } elseif ($country = $request->input('country')) {
            $query->where('country', $country);
            $countryContext = $this->resolveCountryFromSegment((string) $country)
                ?? $this->resolveCountryFromSegment(Str::slug((string) $country));
        }

        $resolvedProvinceIds = null;
        $provinceParam = $request->input('province_slug') ?? $request->input('province');
        if ($provinceParam !== null && $provinceParam !== '') {
            $resolvedProvinceIds = $this->resolveProvinceIds((string) $provinceParam, $countryContext['id'] ?? null);
            if ($resolvedProvinceIds !== null) {
                if ($resolvedProvinceIds === []) {
                    $query->whereRaw('1 = 0');
                } else {
                    $query->whereIn('province_id', $resolvedProvinceIds);
                }
            }
        }

        $cityParam = $request->input('city_slug') ?? $request->input('city');
        if ($cityParam !== null && $cityParam !== '') {
            $provinceIdForCity = null;
            if (is_array($resolvedProvinceIds) && count($resolvedProvinceIds) === 1) {
                $provinceIdForCity = (int) $resolvedProvinceIds[0];
            }
            $resolvedCityIds = $this->resolveCityIds((string) $cityParam, $provinceIdForCity, $countryContext['id'] ?? null);
            if ($resolvedCityIds !== null) {
                if ($resolvedCityIds === []) {
                    $query->whereRaw('1 = 0');
                } else {
                    $query->whereIn('city_id', $resolvedCityIds);
                }
            }
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

    /**
     * Nested: provinces for a country (country id e.g. PH or slug e.g. philippines).
     */
    public function getProvincesForCountry(Request $request, string $country)
    {
        $resolved = $this->resolveCountryFromSegment($country);
        if (!$resolved) {
            return response()->json(['message' => 'Country not found'], 404);
        }

        $rows = Province::query()
            ->select(['id', 'name', 'country_id'])
            ->where('country_id', $resolved['id'])
            ->where('is_active', true)
            ->orderBy('name')
            ->get();

        return response()->json($rows);
    }

    /**
     * Nested: cities for a province within a country (province id or slugified name).
     */
    public function getCitiesForProvince(Request $request, string $country, string $province)
    {
        $resolvedCountry = $this->resolveCountryFromSegment($country);
        if (!$resolvedCountry) {
            return response()->json(['message' => 'Country not found'], 404);
        }

        $provinceIds = $this->resolveProvinceIds($province, $resolvedCountry['id']);
        if ($provinceIds === null || $provinceIds === []) {
            return response()->json(['message' => 'Province not found'], 404);
        }

        if (count($provinceIds) > 1) {
            return response()->json(['message' => 'Ambiguous province; use numeric province id in the path'], 422);
        }

        $provinceId = (int) $provinceIds[0];

        $rows = City::query()
            ->select(['city_id', 'name', 'province_id', 'country_id'])
            ->where('province_id', $provinceId)
            ->where('country_id', $resolvedCountry['id'])
            ->where('is_active', true)
            ->orderBy('name')
            ->get();

        return response()->json($rows);
    }

    /**
     * Distinct category + country pairs for published articles on this site (for filter UX / URLs).
     */
    public function getCategoriesCountries(Request $request)
    {
        $site = $request->attributes->get('site');

        $rows = Article::query()
            ->whereHas('publishedSites', fn ($q) => $q->where('sites.id', $site->id))
            ->where('status', 'published')
            ->whereNotNull('category')
            ->where('category', '!=', '')
            ->whereNotNull('country')
            ->where('country', '!=', '')
            ->selectRaw('category, country, COUNT(*) as article_count')
            ->groupBy('category', 'country')
            ->orderBy('category')
            ->orderBy('country')
            ->get();

        $categoryNames = $rows->pluck('category')->unique()->filter()->values();
        $categorySlugByName = Category::whereIn('name', $categoryNames)
            ->where('is_active', true)
            ->pluck('slug', 'name');

        $countryNames = $rows->pluck('country')->unique()->filter()->values();
        $countryIdByName = Country::whereIn('name', $countryNames)
            ->where('is_active', true)
            ->pluck('id', 'name');

        $data = $rows->map(function ($row) use ($categorySlugByName, $countryIdByName) {
            return [
                'category' => $row->category,
                'category_slug' => $categorySlugByName[$row->category] ?? null,
                'country' => $row->country,
                'country_id' => $countryIdByName[$row->country] ?? null,
                'article_count' => (int) $row->article_count,
            ];
        })->values();

        return response()->json([
            'site' => [
                'name' => $site->site_name,
                'url' => $site->site_url,
                'description' => $site->site_description,
            ],
            'data' => $data,
        ]);
    }

    private function resolveCountryFromSegment(string $segment): ?array
    {
        $segment = trim($segment);
        if ($segment === '') {
            return null;
        }

        $country = Country::query()
            ->where('is_active', true)
            ->where(function ($q) use ($segment) {
                $q->where('id', $segment)
                    ->orWhere('name', $segment)
                    ->orWhereRaw('LOWER(name) = ?', [mb_strtolower($segment)]);
            })
            ->first(['id', 'name']);

        if ($country) {
            return ['id' => $country->id, 'name' => $country->name];
        }

        $needle = Str::slug($segment);
        $country = Country::query()
            ->where('is_active', true)
            ->get(['id', 'name'])
            ->first(fn ($c) => Str::slug($c->name) === $needle);

        return $country ? ['id' => $country->id, 'name' => $country->name] : null;
    }

    /**
     * @return int[]|null null if nothing to filter; [] if no match (empty result)
     */
    private function resolveProvinceIds(string $value, ?string $countryId): ?array
    {
        $value = trim($value);
        if ($value === '') {
            return null;
        }

        if (ctype_digit($value)) {
            return [(int) $value];
        }

        $needle = Str::slug($value);
        $query = Province::query()
            ->where('is_active', true)
            ->when($countryId, fn ($q) => $q->where('country_id', $countryId));

        return $query->get(['id', 'name'])
            ->filter(fn ($p) => Str::slug($p->name) === $needle)
            ->pluck('id')
            ->values()
            ->all();
    }

    /**
     * @return int[]|null city_id list
     */
    private function resolveCityIds(string $value, ?int $provinceId, ?string $countryId): ?array
    {
        $value = trim($value);
        if ($value === '') {
            return null;
        }

        if (ctype_digit($value)) {
            return [(int) $value];
        }

        $needle = Str::slug($value);
        $query = City::query()
            ->where('is_active', true)
            ->when($countryId, fn ($q) => $q->where('country_id', $countryId))
            ->when($provinceId, fn ($q) => $q->where('province_id', $provinceId));

        return $query->get(['city_id', 'name'])
            ->filter(fn ($c) => Str::slug($c->name) === $needle)
            ->pluck('city_id')
            ->values()
            ->all();
    }
}
