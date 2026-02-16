<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\Restaurant;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class RestaurantController extends Controller
{
    /**
     * Get all published restaurants.
     */
    public function index(Request $request): JsonResponse
    {
        $limit = (int)$request->input('limit', $request->input('per_page', 20));
        $page = (int)$request->input('page', 1);
        $topic = $request->input('topic');
        $country = $request->input('country');

        $query = Restaurant::where('status', 'published');

        if ($topic) {
            $query->where('cuisine_type', $topic);
        }

        if ($country) {
            $query->where('country', $country);
        }

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $restaurants = $query->orderBy('created_at', 'desc')
            ->paginate($limit, ['*'], 'page', $page);

        return response()->json($restaurants);
    }

    /**
     * Get a single published restaurant.
     */
    public function show(string $id): JsonResponse
    {
        $restaurant = Restaurant::where('status', 'published')
            ->where('id', $id)
            ->first();

        if (!$restaurant) {
            return response()->json(['error' => 'Restaurant not found'], 404);
        }

        return response()->json($restaurant);
    }

    /**
     * Get restaurants by country.
     */
    public function byCountry(string $country): JsonResponse
    {
        $restaurants = Restaurant::where('status', 'published')
            ->where('country', $country)
            ->orderBy('created_at', 'desc')
            ->limit(20)
            ->get();

        return response()->json($restaurants);
    }
}
