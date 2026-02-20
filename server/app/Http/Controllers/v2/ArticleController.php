<?php

namespace App\Http\Controllers\v2;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ArticleController extends Controller
{
    /**
     * (v2) Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $validated = $request->validate([
            'search' => 'nullable|string',
            'category' => 'nullable|string',
            'country' => 'nullable|string',
            'status' => 'nullable|string',
            'per_page' => 'nullable|integer|min:1|max:100',
        ]);

        $query = Article::query()->where('is_deleted', false);

        // Search
        if (!empty($validated['search'])) {
            $search = $validated['search'];
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('summary', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%")
                  ->orWhere('keywords', 'like', "%{$search}%")
                  ->orWhere('topics', 'like', "%{$search}%");
            });
        }

        // Filters
        if (!empty($validated['category'])) {
            $query->where('category', $validated['category']);
        }

        if (!empty($validated['country'])) {
            $query->where('country', $validated['country']);
        }

        if (!empty($validated['status'])) {
            $query->where('status', $validated['status']);
        }

        $perPage = $validated['per_page'] ?? 10;
        $articles = $query->latest()->paginate($perPage);

        return response()->json($articles);
    }

    /**
     * (v2) Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'summary' => 'nullable|string',
            'category' => 'nullable|string',
            'country' => 'nullable|string',
            'image' => 'nullable|array',
            'image.*' => 'string',
            'status' => 'nullable|string|in:published,pending review,rejected',
            'published_sites' => 'nullable|array',
            'published_sites.*' => 'string',
        ]);

        $siteNames = $validated['published_sites'] ?? [];
        unset($validated['published_sites']);

        $validated['id'] = Str::uuid()->toString();
        $validated['article_id'] = $validated['id'];
        $validated['slug'] = Str::slug($validated['title']);
        $validated['status'] = $validated['status'] ?? 'pending review';
        $validated['is_deleted'] = false;

        $article = Article::create($validated);

        if (!empty($siteNames)) {
            $siteIds = \App\Models\Site::whereIn('site_name', $siteNames)->pluck('id');
            $article->publishedSites()->sync($siteIds);
        }

        return response()->json($article->load('publishedSites'), 201);
    }

    /**
     * (v2) Display the specified resource.
     */
    public function show(string $id)
    {
        $article = Article::with('publishedSites')->findOrFail($id);
        return response()->json($article);
    }

    /**
     * (v2) Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $article = Article::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'content' => 'sometimes|string',
            'summary' => 'nullable|string',
            'category' => 'nullable|string',
            'country' => 'nullable|string',
            'image' => 'nullable|array',
            'image.*' => 'string',
            'status' => 'nullable|string|in:published,pending review,rejected',
            'published_sites' => 'nullable|array',
            'published_sites.*' => 'string',
        ]);

        if (isset($validated['published_sites'])) {
            $siteNames = $validated['published_sites'];
            $siteIds = \App\Models\Site::whereIn('site_name', $siteNames)->pluck('id');
            $article->publishedSites()->sync($siteIds);
            unset($validated['published_sites']);
        }

        if (isset($validated['title'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        $article->update($validated);

        return response()->json($article->load('publishedSites'));
    }

    /**
     * (v2) Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $article = Article::findOrFail($id);
        $article->update(['is_deleted' => true]);

        return response()->json(null, 204);
    }
}
