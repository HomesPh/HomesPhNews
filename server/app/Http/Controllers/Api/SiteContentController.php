<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Http\Resources\Articles\ArticleCollection;
use App\Http\Resources\Restaurants\RestaurantCollection;
use App\Models\City;
use App\Models\Province;
use App\Models\Restaurant;

class SiteContentController extends Controller
{
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
            ->with(['publishedSites:id,site_name', 'images:article_id,image_path'])
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
}
