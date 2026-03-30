<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Http\Resources\Articles\ArticleCollection;
use App\Http\Resources\Articles\ArticleResource;
use App\Http\Resources\Restaurants\RestaurantCollection;
use App\Models\City;
use App\Models\Province;
use App\Models\Restaurant;

class SiteContentController extends Controller
{
    /**
     * Eager loads for ArticleResource (avoids N+1 on list/show).
     *
     * @return list<string|array<string, mixed>>
     */
    protected function siteArticleWith(): array
    {
        return [
            'publishedSites:id,site_name',
            'images:article_id,image_path',
            'province:id,name',
            'city:city_id,name',
            'editor:id,first_name,last_name,name',
        ];
    }

    public function getRestaurants(Request $request)
    {
        $site = $request->attributes->get('site');

        $restaurants = Restaurant::where('status', 'published')
            ->whereJsonContains('published_sites', $site->site_name)
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'site' => [
                'name'        => $site->site_name,
                'url'         => $site->site_url,
                'description' => $site->site_description,
            ],
            'data' => new RestaurantCollection($restaurants),
        ]);
    }

    public function getArticles(Request $request)
    {
        // The site is already resolved by the Middleware
        $site = $request->attributes->get('site');

        $category = $request->query('category');
        $country  = $request->query('country');
        $province = $request->query('province');
        $city     = $request->query('city');

        $query = $site->articles()
            ->with($this->siteArticleWith())
            ->where('status', 'published');

        if ($category) {
            $query->where('category', $category);
        }

        if ($country) {
            $query->where('country', $country);
        }

        if ($province) {
            $provinceModel = Province::where('name', 'LIKE', $province)->first();
            $query->where('province_id', $provinceModel ? $provinceModel->id : -1);
        }

        if ($city) {
            $cityModel = City::where('name', 'LIKE', $city)->first();
            $query->where('city_id', $cityModel ? $cityModel->city_id : -1);
        }

        $articles = $query->orderBy('created_at', 'desc')->paginate(20);

        return response()->json([
            'site' => [
                'name' => $site->site_name,
                'url' => $site->site_url,
                'description' => $site->site_description,
            ],
            'data' => new ArticleCollection($articles)
        ]);
    }

    public function getArticle(Request $request, string $id)
    {
        $site = $request->attributes->get('site');

        $article = $site->articles()
            ->with($this->siteArticleWith())
            ->where('status', 'published')
            ->where(function ($query) use ($id) {
                $query->where('articles.id', $id)
                    ->orWhere('articles.slug', $id);
            })
            ->first();

        if (!$article) {
            return response()->json(['message' => 'Article not found'], 404);
        }

        return response()->json([
            'article' => new ArticleResource($article),
        ]);
    }
}
