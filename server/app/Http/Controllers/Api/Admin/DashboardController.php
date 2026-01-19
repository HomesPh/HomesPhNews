<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\News;
use App\Models\User;

class DashboardController extends Controller
{
    /**
     * Get dashboard statistics for the admin panel.
     */
    public function getStats()
    {
        // 1. Get the total number of articles
        $totalArticles = News::count();

        // 2. Get the number of articles with 'published' status
        $totalPublished = News::where('status', 'published')->count();

        // 3. Get the number of articles with 'pending review' status
        $pendingReview = News::where('status', 'pending review')->count();

        // 4. Get the sum of all views from the 'views_count' column
        $totalViews = News::sum('views_count');

        // ✅ 5. Get the 5 most recent articles
        $recentArticles = News::query()
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
            ],
            'recent_articles' => $recentArticles // <-- Add the recent articles here
        ]);
    }
}
