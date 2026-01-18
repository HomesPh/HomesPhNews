<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\News;
use Illuminate\Http\Request;

class NewsController extends Controller
{
    // List all news
    public function index()
    {
        $news = News::orderBy('created_at', 'desc')->get();
        return response()->json($news);
    }

    // Get a single news item
    public function show($id)
    {

        // Find the requested news article or fail with a 404 error.
        $news = News::findOrFail($id);

        // Atomically increment the 'views_count' column for this article.
        $news->increment('views_count');

        // Return the news article as a JSON response.
        return response()->json($news);
    }

    // Create news (optional)
    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string',
            'summary' => 'required|string',
            'category' => 'nullable|string',
            'tags' => 'nullable|string',
            'country' => 'nullable|string',
            'image' => 'nullable|string',
            'status' => 'nullable|string',
        ]);

        $news = News::create($data);
        return response()->json($news, 201);
    }

    public function trending()
    {
        // Query the News model:
        // - orderBy('views_count', 'desc'): Sorts articles by views, highest first.
        // - take(10): Limits the result to the Top 5. You can change this number.
        // - get(): Executes the query.
        $trendingNews = News::orderBy('views_count', 'desc')->take(5)->get();

        return response()->json($trendingNews);
    }

    public function mostRead()
    {
        // Query the News model:
        // - orderBy('views_count', 'desc'): Sorts articles by views, highest first.
        // - take(10): Limits the result to the Top 10. You can change this number.
        // - get(): Executes the query.
        $mostReadNews = News::orderBy('views_count', 'desc')->take(4)->get();

        return response()->json($mostReadNews);
    }

    public function latestGlobal()
{
    // Query the News model
    $latestGlobalNews = News::query()
        // This is the key: only get news WHERE it HAS a relationship
        // to a category that matches our criteria.
        ->whereHas('category', function ($query) {
            // The criteria: the category's 'slug' column must be 'global-news'
            $query->where('slug', 'global-news');
        })
        // Then, order the results by creation date, newest first.
        ->orderBy('created_at', 'desc')
        // Take the top 10.
        // Execute the query.
        ->take(10)
        ->get();

    return response()->json($latestGlobalNews);
}
}
