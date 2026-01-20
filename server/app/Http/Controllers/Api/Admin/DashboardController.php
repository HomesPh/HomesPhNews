<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\User;
use Illuminate\Support\Facades\DB; // Make sure to import the DB facade

class DashboardController extends Controller
{
    /**
     * Get dashboard statistics for the admin panel.A
     */
    public function getStats()
    {
        // 1. Get the total number of articles
        $totalArticles = Article::count();

        // 2. Get the number of articles with 'published' status
        $totalPublished = Article::where('status', 'published')->count();

        // 3. Get the number of articles with 'pending review' status
        $pendingReview = Article::where('status', 'pending review')->count();

        // 4. Get the sum of all views from the 'views_count' column
        $totalViews = Article::sum('views_count');

        // 5. Get the number of articles distributed to users (top 5)
        $results = Article::query()
            // Corresponds to: SELECT `distributed_in`, COUNT(...) AS published_count
            ->select('distributed_in', DB::raw('COUNT(distributed_in) as published_count'))
            
            // Corresponds to: WHERE `status` = 'published'
            ->where('status', 'published')
            
            // Corresponds to: GROUP BY `distributed_in`
            ->groupBy('distributed_in')
            
            // Corresponds to: ORDER BY `published_count` ASC
            ->orderBy('published_count', 'asc') // 'asc' for ascending order (smallest first)
            
            // Corresponds to: LIMIT 5
            ->take(5)
            
            // Execute the query
            ->get();

        // 6. Get the 5 most recent articles
        $recentArticles = Article::query()
            ->latest() // This is a shortcut for ->orderBy('created_at', 'desc')
            ->take(5)  // Limit the result to 5 articles
            ->get(['id', 'content', 'category', 'created_at', 'views_count']); // Only get the columns you need

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
