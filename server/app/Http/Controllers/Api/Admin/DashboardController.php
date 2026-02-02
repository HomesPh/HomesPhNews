<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    protected $redisService;

    public function __construct(\App\Services\RedisArticleService $redisService)
    {
        $this->redisService = $redisService;
    }
    
    public function getStats()
    {
        // Periods
        $now = Carbon::now();
        $thirtyDaysAgo = $now->copy()->subDays(30);
        $sixtyDaysAgo = $now->copy()->subDays(60);

        // 1. Current Stats
        $totalPublished = Article::where('status', 'published')->count();
        $redisStats = $this->redisService->getStats();
        $pendingReview = $redisStats['total_articles'] ?? 0;
        $totalArticles = $totalPublished + $pendingReview;
        $totalViews = Article::sum('views_count');

        // 2. Trend Calculations (Last 30 vs Previous 30)
        $currentPeriodArticles = Article::whereBetween('created_at', [$thirtyDaysAgo, $now])->count();
        $previousPeriodArticles = Article::whereBetween('created_at', [$sixtyDaysAgo, $thirtyDaysAgo])->count();
        $articleTrend = $this->calculateTrend($currentPeriodArticles, $previousPeriodArticles);

        $currentPeriodViews = Article::whereBetween('created_at', [$thirtyDaysAgo, $now])->sum('views_count');
        // Views are all-time, so comparing "added views" in last 30 days might be hard without logs.
        // For now, let's just calculate based on articles added. 
        // Or if we have Analytics timestamps, we use that. 
        $viewTrend = $this->calculateTrend($currentPeriodViews, 0); // Temporary placeholder

        $currentPeriodPublished = Article::where('status', 'published')->whereBetween('created_at', [$thirtyDaysAgo, $now])->count();
        $previousPeriodPublished = Article::where('status', 'published')->whereBetween('created_at', [$sixtyDaysAgo, $thirtyDaysAgo])->count();
        $publishedTrend = $this->calculateTrend($currentPeriodPublished, $previousPeriodPublished);

        // 5. Distribution by Site
        $sitesWithCounts = \App\Models\Site::withCount('articles')
            ->withSum('articles', 'views_count')
            ->get();
        
        $results = $sitesWithCounts->map(function ($site) {
             return [
                 'distributed_in' => $site->site_name, 
                 'published_count' => $site->articles_count,
                 'total_views' => $site->articles_sum_views_count ?? 0
             ];
        })->sortByDesc('published_count')->take(5)->values();

        // 6. Recent articles - Eager load to prevent N+1
        $recentArticles = Article::query()
            ->with(['publishedSites:id,site_name', 'images:article_id,image_path'])
            ->where('status', 'published')
            ->latest() 
            ->take(5)  
            ->get(['id', 'title', 'image', 'category', 'country', 'created_at', 'views_count', 'status']); 

        return response()->json([
            'stats' => [
                'total_articles' => $totalArticles,
                'total_articles_trend' => $articleTrend,
                'total_published' => $totalPublished,
                'total_published_trend' => $publishedTrend,
                'pending_review' => $pendingReview,
                'pending_review_trend' => "Needs attention",
                'total_views' => $totalViews,
                'total_views_trend' => $viewTrend,
                'total_distribution' => $results,
            ],
            'recent_articles' => $recentArticles
        ]);
    }

    private function calculateTrend($current, $previous)
    {
        if ($previous == 0) {
            return $current > 0 ? "+100%" : "0%";
        }
        $diff = (($current - $previous) / $previous) * 100;
        return ($diff >= 0 ? "+" : "") . round($diff, 1) . "%";
    }
}
