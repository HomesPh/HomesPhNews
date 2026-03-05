<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Restaurants\RestaurantResource;
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
     * Merges Redis (Pending) and Database (Published) records.
     */
    public function index(Request $request)
    {
        $limit = (int) $request->input('limit', $request->input('per_page', 20));
        $page = (int) $request->input('page', 1);
        $offset = ($page - 1) * $limit;
        $status = $request->input('status');

        $query = \App\Models\Restaurant::query();

        // Being Processed = Redis only. Pending Review = DB where status draft.
        $isBeingProcessed = ($status === 'being_processed' || $status === 'draft' || $status === 'pending');
        $isPendingReview = ($status === 'pending_review');

        // 1. DB: published, pending_review (draft), or for 'all'
        $data = [];
        $dbRestaurants = null;
        if (!$status || $status === 'all' || $status === 'published' || $isPendingReview) {
            $dbQuery = clone $query;
            $dbQuery->when($status === 'published', fn($q) => $q->where('status', 'published'))
                ->when($isPendingReview, fn($q) => $q->where('status', 'draft'))
                ->when(!$status || $status === 'all', fn($q) => $q->whereIn('status', ['published', 'draft']))
                ->orderBy('created_at', 'desc');
            $dbRestaurants = $dbQuery->paginate($limit);
            $data = $dbRestaurants->items();
        }

        // 2. Redis list (Being Processed)
        $redisRestaurants = [];
        $restaurantIds = [];
        if (!$status || $status === 'all' || $isBeingProcessed) {
            $restaurantIds = Redis::smembers("{$this->prefix}all_restaurants");
            if (!empty($restaurantIds)) {
                $dbIds = \App\Models\Restaurant::pluck('id')->toArray();
                $pendingIds = array_values(array_diff($restaurantIds, $dbIds));
                $sortedIds = collect($pendingIds)->sort()->reverse()->values()->all();
                if ($isBeingProcessed) {
                    $sortedIds = array_slice($sortedIds, $offset, $limit);
                } else {
                    $sortedIds = array_slice($sortedIds, 0, 10);
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
                            'is_redis' => true,
                        ];
                    }
                }
            }
        }

        // Prepare filters for Dynamic Counts
        $search = $request->input('search');
        $country = $request->input('country');
        $city = $request->input('city');
        $category = $request->input('category');
 
        // Helper function for DB filtering
        $applyDbFilters = function($q) use ($status, $search, $isBeingProcessed, $isPendingReview) {
            return $q->when($status === 'published', fn($sq) => $sq->where('status', 'published'))
                ->when($isPendingReview, fn($sq) => $sq->where('status', 'draft'))
                ->when(!$status || $status === 'all', fn($sq) => $sq->whereIn('status', ['published', 'draft']))
                ->when($search, fn($sq) => $sq->where('name', 'like', "%{$search}%"));
        };
 
        // Helper function for Redis filtering
        $allRedisDataFiltered = function($currentSearch) use ($restaurantIds) {
            $filtered = [];
            foreach ($restaurantIds as $rid) {
                $raw = Redis::get("{$this->prefix}restaurant:{$rid}");
                if (!$raw) continue;
                $r = json_decode($raw, true);
                $dbExists = \App\Models\Restaurant::where('id', $r['id'] ?? $rid)->exists();
                if ($dbExists) continue;
 
                $matchesSearch = !$currentSearch || (isset($r['name']) && stripos($r['name'], $currentSearch) !== false);
                if ($matchesSearch) $filtered[] = $r;
            }
            return $filtered;
        };
 
        // 1. Calculate Category Counts (respect search, country, city)
        $dbCatQuery = $applyDbFilters((clone $query))
            ->when($country, fn($q) => $q->where('country', $country))
            ->when($city, fn($q) => $q->where('city', $city));
        $dbCategoryCounts = $dbCatQuery->whereNotNull('cuisine_type')->groupBy('cuisine_type')->selectRaw('cuisine_type, count(*) as count')->pluck('count', 'cuisine_type')->toArray();
        
        $redisCategoryCounts = [];
        if (!$status || $status === 'all' || $isBeingProcessed) {
            $redisFiltered = collect($allRedisDataFiltered($search))
                ->filter(fn($r) => (!$country || ($r['country'] ?? '') === $country) && (!$city || ($r['city'] ?? '') === $city));
            $redisCategoryCounts = $redisFiltered->groupBy('cuisine_type')->map(fn($g) => $g->count())->toArray();
        }
 
        // 2. Calculate Country Counts (respect search, category, city)
        $dbCountryQuery = $applyDbFilters((clone $query))
            ->when($category, fn($q) => $q->where('cuisine_type', $category))
            ->when($city, fn($q) => $q->where('city', $city));
        $dbCountryCounts = $dbCountryQuery->whereNotNull('country')->groupBy('country')->selectRaw('country, count(*) as count')->pluck('count', 'country')->toArray();
 
        $redisCountryCounts = [];
        if (!$status || $status || $isBeingProcessed) {
            $redisFiltered = collect($allRedisDataFiltered($search))
                ->filter(fn($r) => (!$category || ($r['cuisine_type'] ?? '') === $category) && (!$city || ($r['city'] ?? '') === $city));
            $redisCountryCounts = $redisFiltered->groupBy('country')->map(fn($g) => $g->count())->toArray();
        }
 
        $finalCategoryCounts = [];
        $allCatNames = collect(array_merge(array_keys($dbCategoryCounts), array_keys($redisCategoryCounts)))->unique()->sort()->values()->toArray();
        foreach ($allCatNames as $name) {
            $finalCategoryCounts[] = ['name' => $name ?: 'Restaurant', 'count' => ($dbCategoryCounts[$name] ?? 0) + ($redisCategoryCounts[$name] ?? 0)];
        }
 
        $finalCountryCounts = [];
        $allCountryNames = collect(array_merge(array_keys($dbCountryCounts), array_keys($redisCountryCounts)))->unique()->sort()->values()->toArray();
        foreach ($allCountryNames as $name) {
            $finalCountryCounts[] = ['name' => $name ?: 'Global', 'count' => ($dbCountryCounts[$name] ?? 0) + ($redisCountryCounts[$name] ?? 0)];
        }
 
        $availableFilters = [
            'categories' => $finalCategoryCounts,
            'countries' => $finalCountryCounts
        ];
 
        // Being Processed tab: Redis only
        if ($isBeingProcessed) {
            $totalRedis = count(array_diff($restaurantIds, \App\Models\Restaurant::pluck('id')->toArray()));
            return response()->json([
                'data' => $redisRestaurants,
                'current_page' => $page,
                'last_page' => (int) max(1, ceil($totalRedis / $limit)),
                'total' => $totalRedis,
                'status_counts' => $this->getStatusCounts(),
                'available_filters' => $availableFilters,
            ]);
        }

        // Pending Review tab: DB draft only
        if ($isPendingReview) {
            return response()->json([
                'data' => $data,
                'current_page' => $dbRestaurants->currentPage(),
                'last_page' => $dbRestaurants->lastPage(),
                'total' => $dbRestaurants->total(),
                'status_counts' => $this->getStatusCounts(),
                'available_filters' => $availableFilters,
            ]);
        }

        // Merge results if status is 'all'
        if (!$status || $status === 'all') {
            $allMerged = collect($redisRestaurants)->merge($data);
            $dbTotal = $dbRestaurants ? $dbRestaurants->total() : 0;
            $redisTotal = count(array_diff($restaurantIds, \App\Models\Restaurant::pluck('id')->toArray()));
            return response()->json([
                'data' => $allMerged,
                'current_page' => $page,
                'last_page' => max(1, (int) ceil(($dbTotal + $redisTotal) / $limit)),
                'total' => $dbTotal + $redisTotal,
                'status_counts' => $this->getStatusCounts(),
                'available_filters' => $availableFilters,
            ]);
        }

        // Published or default DB response
        return response()->json([
            'data' => $data,
            'current_page' => $dbRestaurants->currentPage(),
            'last_page' => $dbRestaurants->lastPage(),
            'total' => $dbRestaurants->total(),
            'status_counts' => $this->getStatusCounts(),
            'available_filters' => $availableFilters,
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
            return new RestaurantResource($restaurant);
        }

        // 2. Check Redis
        $data = Redis::get("{$this->prefix}restaurant:{$id}");
        if ($data) {
            $r = json_decode($data, true);
            $r['is_redis'] = true;
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
        $data['is_featured'] = $request->boolean('is_featured', false);
        $data['is _featured'] = $request->boolean('is_featured', false);

        $restaurant = \App\Models\Restaurant::create($data);
        
        return response()->json([
            'message' => 'Restaurant created successfully',
            'data' => $restaurant
        ], 201);
    }

    /**
     * Update an existing restaurant.
     */
    public function update(Request $request, string $id)
    {
        $restaurant = \App\Models\Restaurant::find($id);
        $data = $request->all();
        if ($request->has('is_featured')) {
            $data['is_featured'] = $request->boolean('is_featured');
            $data['is _featured'] = $request->boolean('is_featured');
        }

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

        // Otherwise, update Redis
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
     */
    public function publish(Request $request, string $id)
    {
        $restaurant = \App\Models\Restaurant::find($id);
        $payload = $request->all();
        
        if (!$restaurant) {
            $data = Redis::get("{$this->prefix}restaurant:{$id}");
            if (!$data) {
                if (!empty($payload)) {
                    $r = $payload;
                } else {
                    return response()->json(['error' => 'Restaurant not found in pending cache'], 404);
                }
            } else {
                $r = array_merge(json_decode($data, true), $payload);
            }

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
                'is_featured' => $r['is_featured'] ?? false,
                'is _featured' => $r['is_featured'] ?? false,
                'status' => 'published',
                'timestamp' => $r['timestamp'] ?? time(),
                'tags' => $r['tags'] ?? [],
                'features' => $r['features'] ?? [],
                'published_sites' => $payload['published_sites'] ?? $r['published_sites'] ?? [],
            ]);

            Redis::del("{$this->prefix}restaurant:{$id}");
            Redis::srem("{$this->prefix}all_restaurants", $id);

        } else {
            $payload['status'] = 'published';
            if ($request->has('published_sites')) {
                $payload['published_sites'] = $request->input('published_sites', []);
            }
            $restaurant->update($payload);
        }

        return response()->json([
            'message' => 'Restaurant published successfully to database',
            'data' => $restaurant
        ]);
    }

    /**
     * Bulk move Redis restaurants to database with status 'draft' (Pending Review).
     */
    public function moveToDb(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'required|string',
        ]);
        $ids = array_values(array_unique($validated['ids']));
        $inserted = [];
        $failed = [];
        $chunkSize = 5;
        $delayMs = 150;

        foreach (array_chunk($ids, $chunkSize) as $chunk) {
            foreach ($chunk as $id) {
                try {
                    $data = Redis::get("{$this->prefix}restaurant:{$id}");
                    if (!$data) {
                        $failed[] = ['id' => $id, 'reason' => 'Restaurant not found in Redis'];
                        continue;
                    }
                    if (\App\Models\Restaurant::where('id', $id)->exists()) {
                        $failed[] = ['id' => $id, 'reason' => 'Already exists in database'];
                        continue;
                    }
                    $r = json_decode($data, true);
                    \App\Models\Restaurant::create([
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
                        'status' => 'draft',
                        'timestamp' => $r['timestamp'] ?? time(),
                        'tags' => $r['tags'] ?? [],
                        'features' => $r['features'] ?? [],
                        'is_featured' => $r['is_featured'] ?? false,
                        'is _featured' => $r['is _featured'] ?? false,
                    ]);
                    Redis::del("{$this->prefix}restaurant:{$id}");
                    Redis::srem("{$this->prefix}all_restaurants", $id);
                    $inserted[] = $id;
                } catch (\Exception $e) {
                    \Log::warning("Restaurant moveToDb failed for {$id}: " . $e->getMessage());
                    $failed[] = ['id' => $id, 'reason' => $e->getMessage()];
                }
            }
            if ($delayMs > 0 && count($chunk) === $chunkSize) {
                usleep($delayMs * 1000);
            }
        }

        return response()->json([
            'message' => count($inserted) . ' moved to database' . (count($failed) > 0 ? ', ' . count($failed) . ' failed' : ''),
            'inserted' => $inserted,
            'failed' => $failed,
        ]);
    }

    /**
     * Helper to get status counts for UI tabs.
     */
    protected function getStatusCounts()
    {
        $published = \App\Models\Restaurant::where('status', 'published')->count();
        $dbDraft = \App\Models\Restaurant::where('status', 'draft')->count();
        $redisCount = (int) Redis::scard("{$this->prefix}all_restaurants");
        $deleted = \App\Models\Restaurant::where('status', 'deleted')->count();
        // Being Processed = Redis only. Pending = DB draft only.
        return [
            'all' => $published + $dbDraft + $redisCount,
            'published' => $published,
            'being_processed' => $redisCount,
            'pending' => $dbDraft,
            'draft' => $redisCount + $dbDraft, // legacy
            'deleted' => $deleted,
        ];
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
     * Get restaurants by country.
     */
    public function byCountry(Request $request, string $country)
    {
        $dbQuery = \App\Models\Restaurant::where('country', $country)->where('status', 'published');
        return response()->json($dbQuery->limit(20)->get());
    }

    /**
     * Delete a restaurant.
     */
    public function destroy(string $id)
    {
        $restaurant = \App\Models\Restaurant::find($id);
        if ($restaurant) {
            $restaurant->delete();
        }

        Redis::del("{$this->prefix}restaurant:{$id}");
        Redis::srem("{$this->prefix}all_restaurants", $id);

        return response()->json(['message' => 'Restaurant deleted from all storage']);
    }
}
