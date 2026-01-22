<?php

namespace App\Services;

use Illuminate\Support\Facades\Redis;

/**
 * RedisArticleService
 * 
 * This service reads articles directly from Redis where the Python scraper stores them.
 * The Python Script is the SOURCE OF TRUTH.
 * 
 * Redis Key Patterns (matching Python storage.py):
 * - Article:        {prefix}article:{article_id}
 * - Country Index:  {prefix}country:{country_slug}
 * - Category Index: {prefix}category:{category_slug}
 * - All Articles:   {prefix}all_articles
 * - By Time:        {prefix}articles_by_time (sorted set)
 */
class RedisArticleService
{
    protected string $prefix;

    public function __construct()
    {
        // Match the Python REDIS_PREFIX (default: "homesph:")
        $this->prefix = env('REDIS_PREFIX', 'homesph:');
    }

    /**
     * Get a single article by ID
     */
    public function getArticle(string $articleId): ?array
    {
        $data = Redis::get("{$this->prefix}article:{$articleId}");
        return $data ? json_decode($data, true) : null;
    }

    /**
     * Get all articles with pagination
     */
    public function getAllArticles(int $limit = 20, int $offset = 0): array
    {
        $articleIds = Redis::smembers("{$this->prefix}all_articles");
        $sortedIds = array_slice(array_reverse(array_values($articleIds)), $offset, $limit);

        return $this->fetchArticlesByIds($sortedIds);
    }

    /**
     * Get latest articles (sorted by timestamp)
     */
    public function getLatestArticles(int $limit = 10): array
    {
        // Use sorted set for time-ordered retrieval
        $articleIds = Redis::zrevrange("{$this->prefix}articles_by_time", 0, $limit - 1);

        return $this->fetchArticlesByIds($articleIds);
    }

    /**
     * Get articles by country
     * Country is stored as full name: "Philippines", "United States", etc.
     */
    public function getArticlesByCountry(string $country, int $limit = 20): array
    {
        $countrySlug = $this->slugify($country);
        $key = "{$this->prefix}country:{$countrySlug}";
        $articleIds = Redis::smembers($key);
        $sortedIds = array_slice(array_reverse(array_values($articleIds)), 0, $limit);

        return $this->fetchArticlesByIds($sortedIds);
    }

    /**
     * Get articles by category
     * Category examples: "Real Estate", "Business", "Technology"
     */
    public function getArticlesByCategory(string $category, int $limit = 20): array
    {
        $categorySlug = $this->slugify($category);
        $key = "{$this->prefix}category:{$categorySlug}";
        $articleIds = Redis::smembers($key);
        $sortedIds = array_slice(array_reverse(array_values($articleIds)), 0, $limit);

        return $this->fetchArticlesByIds($sortedIds);
    }

    /**
     * Search articles by title or content
     */
    public function searchArticles(string $query, int $limit = 20): array
    {
        $allIds = Redis::smembers("{$this->prefix}all_articles");
        $results = [];
        $queryLower = strtolower($query);

        foreach ($allIds as $articleId) {
            if (count($results) >= $limit) break;

            $article = $this->getArticle($articleId);
            if (!$article) continue;

            $title = strtolower($article['title'] ?? '');
            $content = strtolower($article['content'] ?? '');

            if (str_contains($title, $queryLower) || str_contains($content, $queryLower)) {
                $results[] = $article;
            }
        }

        return $results;
    }

    /**
     * Get trending articles (most recent with some variety)
     * Since Python doesn't track views, we use latest as proxy
     */
    public function getTrendingArticles(int $limit = 5): array
    {
        return $this->getLatestArticles($limit);
    }

    /**
     * Get all available countries with article counts
     */
    public function getCountries(): array
    {
        $keys = Redis::keys("{$this->prefix}country:*");
        $countries = [];

        foreach ($keys as $key) {
            // Remove any Redis database prefix (e.g., "laravel_database_")
            $cleanKey = preg_replace('/^.*?homesph:/', 'homesph:', $key);
            $name = str_replace("{$this->prefix}country:", '', $cleanKey);
            $name = str_replace('_', ' ', $name);
            $name = ucwords($name);
            $count = Redis::scard($key);
            
            $countries[] = [
                'name' => $name,
                'count' => $count
            ];
        }

        // Sort by count descending
        usort($countries, fn($a, $b) => $b['count'] - $a['count']);

        return $countries;
    }

    /**
     * Get all available categories with article counts
     */
    public function getCategories(): array
    {
        $keys = Redis::keys("{$this->prefix}category:*");
        $categories = [];

        foreach ($keys as $key) {
            // Remove any Redis database prefix
            $cleanKey = preg_replace('/^.*?homesph:/', 'homesph:', $key);
            $name = str_replace("{$this->prefix}category:", '', $cleanKey);
            $name = str_replace('_', ' ', $name);
            $name = ucwords($name);
            $count = Redis::scard($key);
            
            $categories[] = [
                'name' => $name,
                'count' => $count
            ];
        }

        // Sort by count descending
        usort($categories, fn($a, $b) => $b['count'] - $a['count']);

        return $categories;
    }

    /**
     * Get storage statistics
     */
    public function getStats(): array
    {
        return [
            'total_articles' => Redis::scard("{$this->prefix}all_articles"),
            'countries' => count(Redis::keys("{$this->prefix}country:*")),
            'categories' => count(Redis::keys("{$this->prefix}category:*")),
        ];
    }

    /**
     * Update an existing pending article stored in Redis.
     * This is used by the admin panel to edit AI-generated (pending) articles
     * before they are published to the main database.
     */
    public function updateArticle(string $articleId, array $data): ?array
    {
        $existing = $this->getArticle($articleId);
        if (!$existing) {
            return null;
        }

        $oldCountry = $existing['country'] ?? null;
        $oldCategory = $existing['category'] ?? null;

        // Merge incoming data on top of existing article
        $updated = array_merge($existing, $data);

        // Persist updated article
        $key = "{$this->prefix}article:{$articleId}";
        Redis::set($key, json_encode($updated));

        // Re-index country if it changed
        $newCountry = $updated['country'] ?? $oldCountry;
        if ($oldCountry && $newCountry && $oldCountry !== $newCountry) {
            $oldCountryKey = "{$this->prefix}country:".$this->slugify($oldCountry);
            $newCountryKey = "{$this->prefix}country:".$this->slugify($newCountry);
            Redis::srem($oldCountryKey, $articleId);
            Redis::sadd($newCountryKey, $articleId);
        }

        // Re-index category if it changed
        $newCategory = $updated['category'] ?? $oldCategory;
        if ($oldCategory && $newCategory && $oldCategory !== $newCategory) {
            $oldCategoryKey = "{$this->prefix}category:".$this->slugify($oldCategory);
            $newCategoryKey = "{$this->prefix}category:".$this->slugify($newCategory);
            Redis::srem($oldCategoryKey, $articleId);
            Redis::sadd($newCategoryKey, $articleId);
        }

        // Keep timestamp ordering as-is; if timestamp is changed, zset will be updated
        if (isset($updated['timestamp'])) {
            Redis::zadd("{$this->prefix}articles_by_time", [$articleId => $updated['timestamp']]);
        }

        return $updated;
    }

    /**
     * Delete an article from Redis.
     * Called after an article is published or rejected to clean up the cache.
     */
    public function deleteArticle(string $articleId): bool
    {
        $existing = $this->getArticle($articleId);
        if (!$existing) {
            return false;
        }

        // Remove from main article key
        Redis::del("{$this->prefix}article:{$articleId}");

        // Remove from all_articles set
        Redis::srem("{$this->prefix}all_articles", $articleId);

        // Remove from articles_by_time sorted set
        Redis::zrem("{$this->prefix}articles_by_time", $articleId);

        // Remove from country index
        if (!empty($existing['country'])) {
            $countryKey = "{$this->prefix}country:" . $this->slugify($existing['country']);
            Redis::srem($countryKey, $articleId);
        }

        // Remove from category index
        if (!empty($existing['category'])) {
            $categoryKey = "{$this->prefix}category:" . $this->slugify($existing['category']);
            Redis::srem($categoryKey, $articleId);
        }

        \Illuminate\Support\Facades\Log::info("Redis: Deleted article {$articleId}");

        return true;
    }

    /**
     * Fetch multiple articles by their IDs
     */
    protected function fetchArticlesByIds(array $articleIds): array
    {
        $articles = [];
        foreach ($articleIds as $id) {
            $article = $this->getArticle($id);
            if ($article) {
                $articles[] = $article;
            }
        }
        return $articles;
    }

    /**
     * Convert string to slug (matching Python's format)
     * Python does: country.lower().replace(' ', '_')
     */
    protected function slugify(string $text): string
    {
        return str_replace(' ', '_', strtolower($text));
    }

    /**
     * Format article as summary (for list views)
     * Matches Python's ArticleSummary model
     */
    public function formatSummary(array $article): array
    {
        return [
            'id' => $article['id'] ?? '',
            'country' => $article['country'] ?? '',
            'category' => $article['category'] ?? '',
            'title' => $article['title'] ?? '',
            'image_url' => $article['image_url'] ?? '',
        ];
    }

    /**
     * Format multiple articles as summaries
     */
    public function formatSummaries(array $articles): array
    {
        return array_map(fn($a) => $this->formatSummary($a), $articles);
    }
}
