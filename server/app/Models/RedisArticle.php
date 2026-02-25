<?php

namespace App\Models;

use App\Services\RedisArticleService;

class RedisArticle
{
    protected RedisArticleService $redisService;

    public function __construct(RedisArticleService $redisService)
    {
        $this->redisService = $redisService;
    }

    /**
     * Get a paginated list of Redis articles.
     */
    public function paginate(array $filters = [], int $perPage = 10, int $page = 1)
    {
        $articles = $this->redisService->filterArticles([
            'search' => $filters['search'] ?? null,
            'category' => $filters['category'] ?? null,
            'country' => $filters['country'] ?? null,
        ], 100);

        // Re-index array
        $articles = array_values($articles);

        // Sort by timestamp (newest first)
        usort($articles, fn($a, $b) => ($b['timestamp'] ?? 0) <=> ($a['timestamp'] ?? 0));

        // Manual pagination
        $total = count($articles);
        $offset = ($page - 1) * $perPage;
        $paginatedArticles = array_slice($articles, $offset, $perPage);

        return [
            'data' => array_map(fn($item) => $this->formatArticle($item), $paginatedArticles),
            'current_page' => $page,
            'per_page' => $perPage,
            'total' => $total,
            'last_page' => (int) ceil($total / $perPage),
            'from' => $total > 0 ? $offset + 1 : null,
            'to' => $total > 0 ? min($offset + $perPage, $total) : null,
        ];
    }

    /**
     * Find a Redis article by ID.
     */
    public function find(string $id)
    {
        $article = $this->redisService->getArticle($id);
        if (!$article) {
            return null;
        }

        $formatted = $this->formatArticle($article);
        // ensure ID is attached
        if (!isset($formatted['id'])) {
            $formatted['id'] = $id;
        }
        return $formatted;
    }

    /**
     * Update a Redis article.
     */
    public function update(string $id, array $data)
    {
        $updated = $this->redisService->updateArticle($id, $data);
        if (!$updated) {
            return null;
        }

        return $this->formatArticle($updated);
    }

    /**
     * Delete a Redis article.
     */
    public function delete(string $id): bool
    {
        $article = $this->redisService->getArticle($id);
        if ($article) {
            $this->redisService->deleteArticle($id);
            return true;
        }
        return false;
    }

    /**
     * Get available filters (Categories and Countries) from Redis.
     */
    public function getAvailableFilters(): array
    {
        $countries = collect($this->redisService->getCountries())->pluck('name')->sort()->values()->toArray();
        $categories = collect($this->redisService->getCategories())->pluck('name')->sort()->values()->toArray();

        return [
            'categories' => $categories,
            'countries' => $countries,
        ];
    }

    /**
     * Get statistics from Redis.
     */
    public function getStats(): array
    {
        return $this->redisService->getStats();
    }

    /**
     * Format a raw Redis article array into a consistent structure.
     */
    protected function formatArticle(array $a): array
    {
        return [
            'id' => (string) ($a['id'] ?? ''),
            'title' => $a['title'] ?? 'Untitled',
            'summary' => $a['summary'] ?? (isset($a['content']) ? substr($a['content'], 0, 150) . '...' : ''),
            'content' => $a['content'] ?? '',
            'image' => $a['image_url'] ?? $a['image'] ?? null,
            'image_url' => $a['image_url'] ?? $a['image'] ?? null,
            'category' => $a['category'] ?? 'General',
            'country' => $a['country'] ?? 'Global',
            'status' => 'pending',
            'created_at' => (isset($a['timestamp']) && is_numeric($a['timestamp']))
                ? date('Y-m-d H:i:s', (int) $a['timestamp'])
                : ($a['timestamp'] ?? now()->toIso8601String()),
            'views_count' => $a['views_count'] ?? 0,
            'source' => $a['source'] ?? '',
            'original_url' => $a['original_url'] ?? '',
            'keywords' => $a['keywords'] ?? '',
            'topics' => $a['topics'] ?? [],
            'content_blocks' => $a['content_blocks'] ?? [],
            'template' => $a['template'] ?? '',
            'author' => $a['author'] ?? '',
            'slug' => \Illuminate\Support\Str::slug($a['title'] ?? ''),
        ];
    }
}
