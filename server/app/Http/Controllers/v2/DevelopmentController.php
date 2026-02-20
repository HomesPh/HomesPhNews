<?php

namespace App\Http\Controllers\v2;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\RedisArticleService;

use App\Services\RedisRestaurantService;

class DevelopmentController extends Controller
{
    /**
     * (v2) Test: Get all Redis contents.
     */
    public function getRedisContents(Request $request, RedisArticleService $redisArticleService)
    {
        $limit = (int) $request->input('limit', 10);
        $offset = (int) $request->input('offset', 0);
        $data = $redisArticleService->getAllArticles($limit, $offset);

        return response()->json($data);
    }

    public function getRestaurantContents(RedisRestaurantService $redisRestaurantService)
    {
        $data = $redisRestaurantService->getRestaurants();
        return response()->json($data);
    }
}
