<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\Restaurant;
use Illuminate\Http\Request;

class RestaurantController extends Controller
{
    /**
     * Get all published restaurants with optional filtering.
     */
    public function index(Request $request)
    {
        $limit = (int)$request->input('limit', 20);

        $query = Restaurant::where('status', 'published');

        // Filter by country
        if ($request->has('country') && $request->input('country') !== 'All Countries') {
            $query->where('country', $request->input('country'));
        }

        // Filter by category (cuisine_type)
        if ($request->has('category') && $request->input('category') !== 'All Category') {
            $query->where('cuisine_type', 'like', '%' . $request->input('category') . '%');
        }

        // Filter by topic (often maps to category/cuisine in frontend)
        if ($request->has('topic')) {
            $query->where('cuisine_type', 'like', '%' . $request->input('topic') . '%');
        }

        // Search
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('city', 'like', "%{$search}%");
            });
        }

        $restaurants = $query->orderBy('created_at', 'desc')->paginate($limit);

        return response()->json($restaurants);
    }

    /**
     * Get a single published restaurant.
     */
    public function show($id)
    {
        $restaurant = Restaurant::where('id', $id)
            ->where('status', 'published')
            ->first();

        if (!$restaurant) {
            return response()->json(['error' => 'Restaurant not found'], 404);
        }

        return response()->json($restaurant);
    }
}
