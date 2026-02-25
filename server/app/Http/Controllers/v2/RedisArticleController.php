<?php

namespace App\Http\Controllers\v2;

use App\Http\Controllers\Controller;
use App\Models\RedisArticle;
use Illuminate\Http\Request;

class RedisArticleController extends Controller
{
    protected RedisArticle $redisArticleModel;

    public function __construct(RedisArticle $redisArticleModel)
    {
        $this->redisArticleModel = $redisArticleModel;
    }

    /**
     * (v2) Display a listing of Redis articles (pending).
     */
    public function index(Request $request)
    {
        $validated = $request->validate([
            'search' => 'nullable|string',
            'category' => 'nullable|string',
            'country' => 'nullable|string',
            'page' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1|max:100',
        ]);

        $page = $validated['page'] ?? 1;
        $perPage = $validated['per_page'] ?? 10;

        $articles = $this->redisArticleModel->paginate($validated, $perPage, $page);

        return response()->json($articles);
    }

    /**
     * (v2) Display the specified Redis article.
     */
    public function show(string $id)
    {
        $article = $this->redisArticleModel->find($id);

        if (!$article) {
            return response()->json(['message' => 'Article not found in Redis'], 404);
        }

        return response()->json($article);
    }

    /**
     * (v2) Update the specified Redis article in storage.
     */
    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'content' => 'sometimes|string',
            'summary' => 'nullable|string',
            'category' => 'nullable|string',
            'country' => 'nullable|string',
            'image_url' => 'nullable|string',
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

        $article = $this->redisArticleModel->update($id, $validated);

        if (!$article) {
            return response()->json(['message' => 'Article not found in Redis or failed to update'], 404);
        }

        return response()->json($article);
    }

    /**
     * (v2) Remove the specified Redis article from storage.
     */
    public function destroy(string $id)
    {
        $deleted = $this->redisArticleModel->delete($id);

        if (!$deleted) {
            return response()->json(['message' => 'Article not found in Redis'], 404);
        }

        return response()->json(null, 204);
    }

    /**
     * (v2) Get available filters for Redis articles.
     */
    public function filters()
    {
        $filters = $this->redisArticleModel->getAvailableFilters();
        return response()->json($filters);
    }

    /**
     * (v2) Get stats for Redis articles.
     */
    public function stats()
    {
        $stats = $this->redisArticleModel->getStats();
        return response()->json($stats);
    }
    
    /**
     * (v2) Transfer a Redis Article to the Database (Publish)
     */
    public function publish(Request $request, string $id)
    {
        $redisArticleData = $this->redisArticleModel->find($id);

        if (!$redisArticleData) {
            return response()->json(['message' => 'Article not found in Redis'], 404);
        }

        $imageUrl = $redisArticleData['image_url'] ?? null;
        
        $contentBlocks = $redisArticleData['content_blocks'] ?? [];
        if (empty($contentBlocks) && $imageUrl) {
            $contentBlocks[] = [
                'type' => 'image',
                'data' => [
                    'url' => $imageUrl,
                    'alt' => $redisArticleData['title'],
                ],
            ];
        }

        // Format data for DB Article
        $dbData = [
            'id' => \Illuminate\Support\Str::uuid()->toString(),
            'article_id' => \Illuminate\Support\Str::uuid()->toString(), // For legacy
            'title' => $redisArticleData['title'],
            'original_title' => $redisArticleData['original_title'] ?? null,
            'summary' => $redisArticleData['summary'] ?? '',
            'content' => $redisArticleData['content'] ?? '',
            'category' => $redisArticleData['category'] ?? 'General',
            'country' => $redisArticleData['country'] ?? 'Global',
            'thumbnail_url' => $redisArticleData['thumbnail_url'] ?? $imageUrl,
            'content_blocks' => $contentBlocks,
            'template' => $redisArticleData['template'] ?? null,
            'source' => $redisArticleData['source'] ?? '',
            'original_url' => $redisArticleData['original_url'] ?? '',
            'slug' => \Illuminate\Support\Str::slug($redisArticleData['title']),
            'status' => 'pending', // Always set to pending per requirements
            'is_deleted' => false,
            'is_legacy' => false,
            'published_at' => now(),
            'author' => $redisArticleData['author'] ?? null,
            'topics' => is_array($redisArticleData['topics'] ?? null) ? $redisArticleData['topics'] : [],
            'keywords' => is_array($redisArticleData['keywords'] ?? null) ? $redisArticleData['keywords'] : [],
        ];

        \DB::beginTransaction();
        try {
            $dbArticle = \App\Models\Article::create($dbData);
            
            // Logically if they published sites
            if ($request->has('published_sites')) {
                $siteNames = $request->input('published_sites');
                $siteIds = \App\Models\Site::whereIn('site_name', $siteNames)->pluck('id');
                $dbArticle->publishedSites()->sync($siteIds);
            }

            // Remove from Redis upon success
            $this->redisArticleModel->delete($id);
            
            \DB::commit();

            return response()->json(new \App\Http\Resources\Articles\ArticleResource($dbArticle->load('publishedSites')), 201);
            
        } catch (\Exception $e) {
            \DB::rollBack();
            return response()->json(['message' => 'Failed to transfer article: ' . $e->getMessage()], 500);
        }
    }
}
