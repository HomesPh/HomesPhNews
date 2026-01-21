<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Article;
use App\Models\Analytics;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use OpenApi\Attributes as OA;

class AnalyticsController extends Controller
{
    #[OA\Get(
        path: "/api/admin/analytics",
        operationId: "getAdminAnalytics",
        summary: "Get aggregated analytics data",
        description: "Returns overview stats, traffic trends, content by category, and performance by country based on a period filter.",
        security: [['sanctum' => []]],
        tags: ["Admin: Analytics"],
        parameters: [
            new OA\Parameter(
                name: "period",
                in: "query",
                description: "Filter range (7d, 30d, 3m, 6m, 1y)",
                required: false,
                schema: new OA\Schema(type: "string", default: "7d", enum: ["7d", "30d", "3m", "6m", "1y"])
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Successful operation",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "range", type: "string", example: "7d"),
                        new OA\Property(
                            property: "overview",
                            type: "object",
                            properties: [
                                new OA\Property(property: "total_page_news", type: "integer", example: 150),
                                new OA\Property(property: "unique_visitors", type: "integer", example: 1200),
                                new OA\Property(property: "total_clicks", type: "integer", example: 3500),
                                new OA\Property(property: "avg_engagement", type: "number", format: "float", example: 4.52)
                            ]
                        ),
                        new OA\Property(property: "traffic_trends", type: "array", items: new OA\Items(type: "object")),
                        new OA\Property(property: "content_by_category", type: "array", items: new OA\Items(type: "object")),
                        new OA\Property(property: "performance_by_country", type: "array", items: new OA\Items(type: "object"))
                    ]
                )
            ),
            new OA\Response(response: 401, description: "Unauthenticated")
        ]
    )]
    public function index(Request $request)
    {
        // Determine filter range
        $period = $request->query('period', '7d'); // default to 7 days
        $endDate = Carbon::now();

        switch ($period) {
            case '30d':
                $startDate = Carbon::now()->subDays(30);
                break;
            case '3m':
                $startDate = Carbon::now()->subMonths(3);
                break;
            case '6m':
                $startDate = Carbon::now()->subMonths(6);
                break;
            case '1y':
                $startDate = Carbon::now()->subYear();
                break;
            case '7d':
            default:
                $startDate = Carbon::now()->subDays(6); // 6 days ago + today = 7 days
                break;
        }

        // 1. Total Overview Stats (Filtered)
        $totalPageNews = Article::whereBetween('created_at', [$startDate, $endDate])->count();
        $totalUniqueVisitors = Analytics::whereBetween('created_at', [$startDate, $endDate])->sum('unique_visitors');
        $totalClicks = Analytics::whereBetween('created_at', [$startDate, $endDate])->sum('total_clicks');
        $avgEngagement = Analytics::whereBetween('created_at', [$startDate, $endDate])->avg('avg_engagement');

        // 2. Traffic Trends (Optimized)
        // Fetch grouped data directly from database to avoid N+1 queries
        $newsCounts = Article::whereBetween('created_at', [$startDate, $endDate])
            ->selectRaw('DATE(created_at) as date, count(*) as count')
            ->groupBy('date')
            ->pluck('count', 'date');

        $visitorCounts = Analytics::whereBetween('created_at', [$startDate, $endDate])
            ->selectRaw('DATE(created_at) as date, sum(unique_visitors) as count')
            ->groupBy('date')
            ->pluck('count', 'date');

        $trafficTrends = [];
        // Loop through every day in the range to ensure even 0-value days are present
        for ($date = $startDate->copy(); $date->lte($endDate); $date->addDay()) {
            $dayString = $date->format('Y-m-d');

            $trafficTrends[] = [
                'date' => $dayString,
                'total_page_news' => $newsCounts[$dayString] ?? 0,
                'unique_visitors' => $visitorCounts[$dayString] ?? 0 // Note: numeric key in pluck might behave differently, usually string date
            ];
        }

        // 3. Content by Category (Filtered)
        $contentByCategory = Article::whereBetween('created_at', [$startDate, $endDate])
            ->select('category', DB::raw('count(*) as count'))
            ->groupBy('category')
            ->orderByDesc('count')
            ->get();

        // 4. Performance by Country (Filtered)
        $performanceByCountry = Article::whereBetween('created_at', [$startDate, $endDate])
            ->select('country', DB::raw('sum(views_count) as total_views'))
            ->whereNotNull('country')
            ->groupBy('country')
            ->orderByDesc('total_views')
            ->get();

        return response()->json([
            'range' => $period,
            'overview' => [
                'total_page_news' => $totalPageNews,
                'unique_visitors' => (int) $totalUniqueVisitors,
                'total_clicks' => (int) $totalClicks,
                'avg_engagement' => round($avgEngagement ?? 0, 2),
            ],
            'traffic_trends' => $trafficTrends,
            'content_by_category' => $contentByCategory,
            'performance_by_country' => $performanceByCountry
        ]);
    }
}
