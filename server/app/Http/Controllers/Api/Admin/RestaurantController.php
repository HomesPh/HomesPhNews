<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redis;

class RestaurantController extends Controller
{
    /**
     * The Redis prefix for restaurant keys (from Python Script).
     */
    protected $prefix = 'homesph:';

    /**
     * Get all restaurants with pagination.
     */
    public function index(Request $request)
    {
        $limit = $request->input('limit', 20);
        $offset = $request->input('offset', 0);

        // Get all restaurant IDs from Redis
        $restaurantIds = Redis::smembers("{$this->prefix}all_restaurants");
        
        if (empty($restaurantIds)) {
            return response()->json([]);
        }

        // Sort by ID (descending) and apply pagination
        $sortedIds = collect($restaurantIds)->sort()->reverse()->slice($offset, $limit);

        $restaurants = [];
        foreach ($sortedIds as $rid) {
            $data = Redis::get("{$this->prefix}restaurant:{$rid}");
            if ($data) {
                $restaurant = json_decode($data, true);
                // Format for list view (summary with new fields)
                $restaurants[] = [
                    'id' => $restaurant['id'] ?? '',
                    'name' => $restaurant['name'] ?? 'Unknown Restaurant',
                    'country' => $restaurant['country'] ?? '',
                    'city' => $restaurant['city'] ?? '',
                    'cuisine_type' => $restaurant['cuisine_type'] ?? 'Restaurant',
                    'price_range' => $restaurant['price_range'] ?? '₱₱',
                    'rating' => $restaurant['rating'] ?? 0,
                    'image_url' => $restaurant['image_url'] ?? '',
                    'timestamp' => $restaurant['timestamp'] ?? 0,
                    // New engagement fields for list
                    'clickbait_hook' => $restaurant['clickbait_hook'] ?? '',
                    'is_filipino_owned' => $restaurant['is_filipino_owned'] ?? false,
                    'budget_category' => $restaurant['budget_category'] ?? 'Mid-Range',
                    // Missing fields fixed
                    'avg_meal_cost' => $restaurant['avg_meal_cost'] ?? '',
                    'status' => $restaurant['status'] ?? 'draft', // Default to draft if missing
                ];
            }
        }

        return response()->json($restaurants);
    }

    /**
     * Get a single restaurant by ID with ALL fields.
     */
    public function show(string $id)
    {
        $data = Redis::get("{$this->prefix}restaurant:{$id}");
        
        if (!$data) {
            return response()->json(['error' => 'Restaurant not found'], 404);
        }

        $restaurant = json_decode($data, true);
        
        // Return ALL fields with defaults for null values
        return response()->json([
            'id' => $restaurant['id'] ?? $id,
            'name' => $restaurant['name'] ?? 'Unknown Restaurant',
            'country' => $restaurant['country'] ?? '',
            'city' => $restaurant['city'] ?? '',
            'cuisine_type' => $restaurant['cuisine_type'] ?? 'Restaurant',
            'description' => $restaurant['description'] ?? '',
            
            // Location & Maps
            'address' => $restaurant['address'] ?? '',
            'latitude' => $restaurant['latitude'] ?? null,
            'longitude' => $restaurant['longitude'] ?? null,
            'google_maps_url' => $restaurant['google_maps_url'] ?? '',
            
            // Business Info
            'is_filipino_owned' => $restaurant['is_filipino_owned'] ?? false,
            'brand_story' => $restaurant['brand_story'] ?? '',
            'owner_info' => $restaurant['owner_info'] ?? '',
            
            // Food & Menu
            'specialty_dish' => $restaurant['specialty_dish'] ?? '',
            'menu_highlights' => $restaurant['menu_highlights'] ?? '',
            'food_topics' => $restaurant['food_topics'] ?? '',
            
            // Pricing & Budget
            'price_range' => $restaurant['price_range'] ?? '₱₱',
            'budget_category' => $restaurant['budget_category'] ?? 'Mid-Range',
            'avg_meal_cost' => $restaurant['avg_meal_cost'] ?? '',
            
            // Engagement
            'rating' => $restaurant['rating'] ?? 0,
            'clickbait_hook' => $restaurant['clickbait_hook'] ?? '',
            'why_filipinos_love_it' => $restaurant['why_filipinos_love_it'] ?? '',
            
            // Contact
            'contact_info' => $restaurant['contact_info'] ?? '',
            'website' => $restaurant['website'] ?? '',
            'social_media' => $restaurant['social_media'] ?? '',
            
            // Meta
            'image_url' => $restaurant['image_url'] ?? '',
            'original_url' => $restaurant['original_url'] ?? '',
            'timestamp' => $restaurant['timestamp'] ?? 0,
            'status' => $restaurant['status'] ?? 'draft',
        ]);
    }

    /**
     * Get restaurants by country.
     */
    public function byCountry(Request $request, string $country)
    {
        $limit = $request->input('limit', 20);
        
        // Format country key (lowercase, underscores)
        $countryKey = strtolower(str_replace(' ', '_', $country));
        $key = "{$this->prefix}country:{$countryKey}:restaurants";
        
        $restaurantIds = Redis::smembers($key);
        
        if (empty($restaurantIds)) {
            return response()->json([]);
        }

        $sortedIds = collect($restaurantIds)->sort()->reverse()->take($limit);

        $restaurants = [];
        foreach ($sortedIds as $rid) {
            $data = Redis::get("{$this->prefix}restaurant:{$rid}");
            if ($data) {
                $restaurant = json_decode($data, true);
                $restaurants[] = [
                    'id' => $restaurant['id'] ?? '',
                    'name' => $restaurant['name'] ?? 'Unknown Restaurant',
                    'country' => $restaurant['country'] ?? '',
                    'city' => $restaurant['city'] ?? '',
                    'cuisine_type' => $restaurant['cuisine_type'] ?? 'Restaurant',
                    'image_url' => $restaurant['image_url'] ?? '',
                    'clickbait_hook' => $restaurant['clickbait_hook'] ?? '',
                    'is_filipino_owned' => $restaurant['is_filipino_owned'] ?? false,
                ];
            }
        }

        return response()->json($restaurants);
    }

    /**
     * Get restaurant statistics.
     */
    public function stats()
    {
        $totalRestaurants = Redis::scard("{$this->prefix}all_restaurants");
        
        // Get country breakdown
        $countryKeys = Redis::keys("{$this->prefix}country:*:restaurants");
        $byCountry = [];
        
        foreach ($countryKeys as $key) {
            // Extract country name from key (e.g., "homesph:country:japan:restaurants" -> "japan")
            preg_match('/country:(.+?):restaurants/', $key, $matches);
            if (isset($matches[1])) {
                $countryName = ucwords(str_replace('_', ' ', $matches[1]));
                $byCountry[$countryName] = Redis::scard($key);
            }
        }

        // Count Filipino-owned restaurants
        $filipinoOwned = 0;
        $restaurantIds = Redis::smembers("{$this->prefix}all_restaurants");
        foreach ($restaurantIds as $rid) {
            $data = Redis::get("{$this->prefix}restaurant:{$rid}");
            if ($data) {
                $restaurant = json_decode($data, true);
                if (!empty($restaurant['is_filipino_owned'])) {
                    $filipinoOwned++;
                }
            }
        }

        return response()->json([
            'total_restaurants' => $totalRestaurants,
            'filipino_owned' => $filipinoOwned,
            'by_country' => $byCountry,
        ]);
    }

    /**
     * Delete a restaurant (and its image from S3 via Python API).
     */
    public function destroy(string $id)
    {
        $data = Redis::get("{$this->prefix}restaurant:{$id}");
        
        if (!$data) {
            return response()->json(['error' => 'Restaurant not found'], 404);
        }

        $restaurant = json_decode($data, true);
        $country = $restaurant['country'] ?? '';
        
        // Delete from Redis
        Redis::del("{$this->prefix}restaurant:{$id}");
        Redis::srem("{$this->prefix}all_restaurants", $id);
        
        if ($country) {
            $countryKey = strtolower(str_replace(' ', '_', $country));
            Redis::srem("{$this->prefix}country:{$countryKey}:restaurants", $id);
        }

        // Note: S3 image deletion would need to be handled separately
        // or by calling the Python API endpoint

        return response()->json([
            'message' => 'Restaurant deleted successfully',
            'id' => $id,
        ]);
    }
}
