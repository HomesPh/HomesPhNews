<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    protected $redisService;

    public function __construct(\App\Services\RedisArticleService $redisService)
    {
        $this->redisService = $redisService;
    }
    
    public function getStats()
    {
        // 1. Get the number of articles with 'published' status (MySQL)
        $totalPublished = Article::where('status', 'published')->count();

        // 2. Get the number of articles pending in Redis (Pending Review)
        // Redis holds the raw scraper data which is considered 'Pending Review' until published
        $redisStats = $this->redisService->getStats();
        $pendingReview = $redisStats['total_articles'] ?? 0;

        // 3. Total Articles = Published (DB) + Pending (Redis)
        $totalArticles = $totalPublished + $pendingReview;

        // 4. Get the sum of all views from the 'views_count' column
        $totalViews = Article::sum('views_count');

        // 5. Calculate distribution counts using Site relationship
        $sitesWithCounts = \App\Models\Site::withCount('articles')->get();
        
        $results = $sitesWithCounts->map(function ($site) {
             return ['distributed_in' => $site->site_name, 'published_count' => $site->articles_count];
        })->sortByDesc('published_count')->take(5)->values();

        // 6. Get the 5 most recent articles
        $recentArticles = Article::query()
            ->with(['publishedSites']) // Fix N+1 for recent articles list
            ->where('status', 'published')
            ->latest() // This is a shortcut for ->orderBy('created_at', 'desc')
            ->take(5)  // Limit the result to 5 articles
            ->get(['id', 'title', 'image', 'category', 'country', 'created_at', 'views_count', 'status']); // Only get the columns you need

        // Return all statistics in a single JSON response
        return response()->json([
            'stats' => [
                'total_articles' => $totalArticles,
                'total_published' => $totalPublished,
                'pending_review' => $pendingReview,
                'total_views' => $totalViews,
                'total_distribution' => $results, // ✅ CORRECTED: Was $distributedReview
            ],
            'recent_articles' => $recentArticles
        ]);
    }
}
