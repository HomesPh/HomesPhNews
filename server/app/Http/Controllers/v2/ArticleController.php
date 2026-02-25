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
            $status = $validated['status'];
            if ($status === 'deleted') {
                $query->where(function($q) {
                    $q->where('status', 'deleted')->orWhere('is_deleted', true);
                });
            } else {
                $query->where('status', $status);
            }
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
            'status' => 'nullable|string|in:published,pending,deleted',
            'published_sites' => 'nullable|array',
            'published_sites.*' => 'string',
            'thumbnail_url' => 'nullable|string',
            'author' => 'nullable|string',
            'source' => 'nullable|string',
            'original_url' => 'nullable|string',
            'original_title' => 'nullable|string',
            'topics' => 'nullable|array',
            'topics.*' => 'string',
            'keywords' => 'nullable|array',
            'keywords.*' => 'string',
            'content_blocks' => 'nullable|array',
            'template' => 'nullable|string',
        ]);

        $siteNames = $validated['published_sites'] ?? [];
        unset($validated['published_sites']);

        // Convert legacy image array to modern format if provided
        if (!empty($validated['image']) && empty($validated['thumbnail_url'])) {
            $imageUrl = is_array($validated['image']) ? ($validated['image'][0] ?? null) : $validated['image'];
            if ($imageUrl) {
                $validated['thumbnail_url'] = $imageUrl;
                if (empty($validated['content_blocks'])) {
                    $validated['content_blocks'] = [
                        [
                            'type' => 'image',
                            'data' => [
                                'url' => $imageUrl,
                                'alt' => $validated['title'],
                            ]
                        ]
                    ];
                }
            }
        }
        // Remove legacy image array completely so it relies on modern fields
        unset($validated['image']);

        $validated['id'] = Str::uuid()->toString();
        $validated['article_id'] = $validated['id'];
        $validated['slug'] = Str::slug($validated['title']);
        $validated['status'] = $validated['status'] ?? 'pending';

        $dbStatus = $validated['status'];
        $validated['is_deleted'] = ($dbStatus === 'deleted');
        $validated['is_legacy'] = false;

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
            'status' => 'nullable|string|in:published,pending,deleted',
            'published_sites' => 'nullable|array',
            'published_sites.*' => 'string',
            'thumbnail_url' => 'nullable|string',
            'author' => 'nullable|string',
            'source' => 'nullable|string',
            'original_url' => 'nullable|string',
            'original_title' => 'nullable|string',
            'topics' => 'nullable|array',
            'topics.*' => 'string',
            'keywords' => 'nullable|array',
            'keywords.*' => 'string',
            'content_blocks' => 'nullable|array',
            'template' => 'nullable|string',
        ]);

        if (isset($validated['published_sites'])) {
            $siteNames = $validated['published_sites'];
            $siteIds = \App\Models\Site::whereIn('site_name', $siteNames)->pluck('id');
            $article->publishedSites()->sync($siteIds);
            unset($validated['published_sites']);
        }

        // Migrate legacy image to modern fields (either from incoming request or existing DB model)
        $currentImageUrl = $article->image_url; // uses the accessor from the model
        if (isset($validated['image'])) {
            $currentImageUrl = is_array($validated['image']) ? ($validated['image'][0] ?? null) : $validated['image'];
        }

        // If no thumbnail is set yet, but we found a legacy image url, map it over.
        if (empty($validated['thumbnail_url']) && empty($article->thumbnail_url) && $currentImageUrl) {
            $validated['thumbnail_url'] = $currentImageUrl;
        }

        // If no content blocks are set yet, but we found a legacy image url, map it over.
        if (empty($validated['content_blocks']) && empty($article->content_blocks) && $currentImageUrl) {
            $title = $validated['title'] ?? $article->title;
            $validated['content_blocks'] = [
                [
                    'type' => 'image',
                    'data' => [
                        'url' => $currentImageUrl,
                        'alt' => $title,
                    ]
                ]
            ];
        }

        // Always force update to modern
        $validated['is_legacy'] = false;
        
        // Unset old image field so we don't accidentally update the legacy column with arrays when we move to strings/JSON
        unset($validated['image']);

        if (isset($validated['title'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        if (isset($validated['status'])) {
            $dbStatus = $validated['status'];
            if ($dbStatus === 'deleted') {
                $validated['is_deleted'] = true;
            }
            $validated['status'] = $dbStatus;
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
        $article->update([
            'is_deleted' => true,
            'status' => 'deleted'
        ]);

        return response()->json(null, 204);
    }
}
