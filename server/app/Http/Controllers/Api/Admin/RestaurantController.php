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
    /**
     * Get all restaurants with pagination.
     * Merges Redis (Pending) and Database (Published) records.
     */
    public function index(Request $request)
    {
        $limit = (int) $request->input('limit', $request->input('per_page', 20));
        $page = (int) $request->input('page', 1);
        $offset = ($page - 1) * $limit;
        $status = $request->input('status');

        $query = \App\Models\Restaurant::query();

        // 1. If status is 'all' or 'published', fetch from DB first
        if (!$status || $status === 'all' || $status === 'published') {
            $dbRestaurants = $query->when($status === 'published', fn($q) => $q->where('status', 'published'))
                ->orderBy('created_at', 'desc')
                ->paginate($limit);

            $data = $dbRestaurants->items();
        } else {
            $data = [];
        }

        // 2. Fetch from Redis if status is 'all', 'draft', or 'pending'
        $redisRestaurants = [];
        if (!$status || $status === 'all' || $status === 'draft' || $status === 'pending') {
            $restaurantIds = Redis::smembers("{$this->prefix}all_restaurants");
            
            if (!empty($restaurantIds)) {
                // Deduplicate: Don't show Redis items if they already exist in our DB
                $dbIds = \App\Models\Restaurant::pluck('id')->toArray();
                $pendingIds = array_diff($restaurantIds, $dbIds);

                // Sort and slice for simple pagination if status is specifically 'draft'
                if ($status === 'draft' || $status === 'pending') {
                    $sortedIds = collect($pendingIds)->sort()->reverse()->slice($offset, $limit);
                } else {
                    // For 'all', just take some
                    $sortedIds = collect($pendingIds)->sort()->reverse()->take(10);
                }

                foreach ($sortedIds as $rid) {
                    $redisData = Redis::get("{$this->prefix}restaurant:{$rid}");
                    if ($redisData) {
                        $r = json_decode($redisData, true);
                        $redisRestaurants[] = [
                            'id' => $r['id'] ?? $rid,
                            'name' => $r['name'] ?? 'Unknown Restaurant',
                            'country' => $r['country'] ?? '',
                            'city' => $r['city'] ?? '',
                            'cuisine_type' => $r['cuisine_type'] ?? 'Restaurant',
                            'price_range' => $r['price_range'] ?? '₱₱',
                            'rating' => $r['rating'] ?? 0,
                            'image_url' => $r['image_url'] ?? '',
                            'timestamp' => $r['timestamp'] ?? 0,
                            'status' => $r['status'] ?? 'draft',
                            'is_filipino_owned' => $r['is_filipino_owned'] ?? false,
                        ];
                    }
                }
            }
        }

        // Merge results if status is 'all'
        if (!$status || $status === 'all') {
            $allMerged = collect($redisRestaurants)->merge($data);
            
            // Re-format into paginated style for frontend compatibility
            return response()->json([
                'data' => $allMerged,
                'current_page' => $page,
                'last_page' => isset($dbRestaurants) ? $dbRestaurants->lastPage() : 1,
                'total' => (isset($dbRestaurants) ? $dbRestaurants->total() : 0) + count($redisRestaurants),
                'status_counts' => $this->getStatusCounts(),
            ]);
        }

        // If specifically requested drafts/pending
        if ($status === 'draft' || $status === 'pending') {
            return response()->json([
                'data' => $redisRestaurants,
                'current_page' => $page,
                'total' => count($restaurantIds ?? []), // Approximate
                'status_counts' => $this->getStatusCounts(),
            ]);
        }

        // Default DB response
        return response()->json([
            'data' => $data,
            'current_page' => $dbRestaurants->currentPage(),
            'last_page' => $dbRestaurants->lastPage(),
            'total' => $dbRestaurants->total(),
            'status_counts' => $this->getStatusCounts(),
        ]);
    }

    /**
     * Get a single restaurant by ID. Checks MySQL first, then Redis.
     */
    public function show(string $id)
    {
        // 1. Check Database
        $restaurant = \App\Models\Restaurant::find($id);
        if ($restaurant) {
            return response()->json($restaurant);
        }

        // 2. Check Redis
        $data = Redis::get("{$this->prefix}restaurant:{$id}");
        if ($data) {
            $r = json_decode($data, true);
            return response()->json($r);
        }

        return response()->json(['error' => 'Restaurant not found'], 404);
    }

    /**
     * Store a new restaurant in the database.
     */
    public function store(Request $request)
    {
        $data = $request->all();
        $data['id'] = $data['id'] ?? (string) \Illuminate\Support\Str::uuid();
        $data['status'] = $data['status'] ?? 'published';
        
        $restaurant = \App\Models\Restaurant::create($data);
        
        return response()->json([
            'message' => 'Restaurant created successfully',
            'data' => $restaurant
        ], 201);
    }

    /**
     * Update an existing restaurant.
     * Handles both DB records and "virtual" updates for Redis records by publishing them if status becomes published.
     */
    public function update(Request $request, string $id)
    {
        $restaurant = \App\Models\Restaurant::find($id);
        $data = $request->all();

        if ($restaurant) {
            $restaurant->update($data);
            return response()->json([
                'message' => 'Restaurant updated successfully',
                'data' => $restaurant
            ]);
        }

        // If not in DB, check Redis. If payload says status is 'published', publish it.
        if (($data['status'] ?? '') === 'published') {
            return $this->publish($request, $id);
        }

        // Otherwise, update Redis (if we want to support editing drafts in Redis)
        $redisData = Redis::get("{$this->prefix}restaurant:{$id}");
        if ($redisData) {
            $r = json_decode($redisData, true);
            $updated = array_merge($r, $data);
            Redis::set("{$this->prefix}restaurant:{$id}", json_encode($updated));
            return response()->json([
                'message' => 'Draft updated in cache',
                'data' => $updated
            ]);
        }

        return response()->json(['error' => 'Restaurant not found'], 404);
    }

    /**
     * Publish a restaurant from Redis to MySQL.
     * Can accept an optional payload to update fields while publishing.
     */
    public function publish(Request $request, string $id)
    {
        // 1. Check if already in DB
        $restaurant = \App\Models\Restaurant::find($id);
        $payload = $request->all();
        
        if (!$restaurant) {
            // 2. Fetch from Redis
            $data = Redis::get("{$this->prefix}restaurant:{$id}");
            if (!$data) {
                // If not in Redis but we have a payload, maybe it's a new one being published directly?
                if (!empty($payload)) {
                    $r = $payload;
                } else {
                    return response()->json(['error' => 'Restaurant not found in pending cache'], 404);
                }
            } else {
                $r = array_merge(json_decode($data, true), $payload);
            }

            // 3. Move to Database
            $restaurant = \App\Models\Restaurant::create([
                'id' => $id,
                'name' => $r['name'] ?? 'Unknown',
                'description' => $r['description'] ?? '',
                'country' => $r['country'] ?? '',
                'city' => $r['city'] ?? '',
                'cuisine_type' => $r['cuisine_type'] ?? '',
                'address' => $r['address'] ?? '',
                'image_url' => $r['image_url'] ?? '',
                'google_maps_url' => $r['google_maps_url'] ?? '',
                'is_filipino_owned' => $r['is_filipino_owned'] ?? false,
                'price_range' => $r['price_range'] ?? '',
                'budget_category' => $r['budget_category'] ?? '',
                'avg_meal_cost' => $r['avg_meal_cost'] ?? '',
                'rating' => $r['rating'] ?? 0,
                'specialty_dish' => $r['specialty_dish'] ?? '',
                'menu_highlights' => $r['menu_highlights'] ?? '',
                'brand_story' => $r['brand_story'] ?? '',
                'why_filipinos_love_it' => $r['why_filipinos_love_it'] ?? '',
                'contact_info' => $r['contact_info'] ?? '',
                'website' => $r['website'] ?? '',
                'social_media' => $r['social_media'] ?? '',
                'opening_hours' => $r['opening_hours'] ?? '',
                'original_url' => $r['original_url'] ?? '',
                'clickbait_hook' => $r['clickbait_hook'] ?? '',
                'status' => 'published',
                'timestamp' => $r['timestamp'] ?? time(),
                'tags' => $r['tags'] ?? [],
                'features' => $r['features'] ?? [],
            ]);

            // Remove from Redis after publishing
            Redis::del("{$this->prefix}restaurant:{$id}");
            Redis::srem("{$this->prefix}all_restaurants", $id);

        } else {
            // If already in DB, update with payload and ensure status is published
            $payload['status'] = 'published';
            $restaurant->update($payload);
        }

        return response()->json([
            'message' => 'Restaurant published successfully to database',
            'data' => $restaurant
        ]);
    }

    /**
     * Get restaurant statistics.
     */
    public function stats()
    {
        $redisTotal = Redis::scard("{$this->prefix}all_restaurants");
        $dbTotal = \App\Models\Restaurant::count();
        
        return response()->json([
            'total_restaurants' => $redisTotal + $dbTotal,
            'db_total' => $dbTotal,
            'redis_total' => $redisTotal,
            'filipino_owned' => \App\Models\Restaurant::where('is_filipino_owned', true)->count(),
        ]);
    }

    /**
     * Helper to get status counts for UI tabs.
     */
    protected function getStatusCounts()
    {
        $published = \App\Models\Restaurant::where('status', 'published')->count();
        $draft = Redis::scard("{$this->prefix}all_restaurants"); // Most Redis items are drafts
        
        return [
            'all' => $published + $draft,
            'published' => $published,
            'draft' => $draft,
            'deleted' => \App\Models\Restaurant::where('status', 'deleted')->count(),
        ];
    }

    /**
     * Get restaurants by country.
     */
    public function byCountry(Request $request, string $country)
    {
        // Prioritize DB for published restaurants in that country
        $dbQuery = \App\Models\Restaurant::where('country', $country)->where('status', 'published');
        return response()->json($dbQuery->limit(20)->get());
    }

    /**
     * Delete a restaurant.
     */
    public function destroy(string $id)
    {
        // 1. Delete from DB if exists
        $restaurant = \App\Models\Restaurant::find($id);
        if ($restaurant) {
            $restaurant->delete();
        }

        // 2. Delete from Redis
        Redis::del("{$this->prefix}restaurant:{$id}");
        Redis::srem("{$this->prefix}all_restaurants", $id);

        return response()->json(['message' => 'Restaurant deleted from all storage']);
    }
}
