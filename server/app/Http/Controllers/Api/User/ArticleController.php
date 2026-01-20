<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class ArticleController extends Controller
{
    #[OA\Get(
        path: "/api/article",
        operationId: "getUserArticleFeed",
        summary: "Display a dynamic feed of articles",
        description: "Returns Trending, Most Read, and Latest Global articles filtered by criteria.",
        tags: ["User: Articles"],
        parameters: [
            new OA\Parameter(name: "search", in: "query", schema: new OA\Schema(type: "string")),
            new OA\Parameter(name: "country", in: "query", schema: new OA\Schema(type: "string")),
            new OA\Parameter(name: "category", in: "query", schema: new OA\Schema(type: "string"))
        ],
        responses: [
            new OA\Response(response: 200, description: "Successful operation", content: new OA\JsonContent(type: "object"))
        ]
    )]
    public function feed(Request $request)
    {
        // 1. Capture Inputs
        $search = $request->input('search');
        $country = $request->input('country');
        $category = $request->input('category');

        $baseQuery = Article::query()->where('status', 'published');

        if ($country || $category || $search) {
             $baseQuery->where(function($q) use ($search, $country, $category) {
                if ($country) {
                    $q->where('country', $country);
                }
                if ($category) {
                    $q->where('category', $category);
                }
                if ($search) {
                     $q->where(function($subQ) use ($search) {
                        $subQ->where('title', 'LIKE', "%{$search}%")
                             ->orWhere('summary', 'LIKE', "%{$search}%")
                             ->orWhere('content', 'LIKE', "%{$search}%");
                     });
                }
            });
        }

        $trending = (clone $baseQuery)->orderBy('views_count', 'desc')->take(5)->get();
        $mostRead = (clone $baseQuery)->orderBy('views_count', 'desc')->take(10)->get();
        $latestGlobal = (clone $baseQuery)->latest()->take(5)->get();

        return response()->json([
            'trending' => $trending,
            'most_read' => $mostRead,
            'latest_global' => $latestGlobal
        ]);
    }
}
