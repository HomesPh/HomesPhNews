<?php

namespace App\Http\Resources\Articles;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ArticleResource extends JsonResource
{
    /**
     * Disable wrapping to allow manual control in controller responses.
     */
    public static $wrap = null;

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Handle both Model (Eloquent) and Array (Redis) data
        $isModel = $this->resource instanceof \Illuminate\Database\Eloquent\Model;
        
        // For models, extract raw attributes ONLY - no relationships
        if ($isModel) {
            $data = $this->resource->getAttributes();
        } else {
            $data = $this->resource;
        }

        // Get published sites - use raw query to avoid model references
        $publishedSites = [];
        if ($isModel && $this->resource->id) {
            // Query directly instead of using relationship to avoid model serialization
            $publishedSites = \App\Models\Site::query()
                ->join('article_site', 'sites.id', '=', 'article_site.site_id')
                ->where('article_site.article_id', $this->resource->id)
                ->pluck('sites.site_name')
                ->map(fn($name) => (string) $name)
                ->toArray();
        } elseif (isset($data['published_sites']) && is_array($data['published_sites'])) {
            $publishedSites = array_map('strval', $data['published_sites']);
        }

        // Get gallery images - use raw query to avoid model references
        $galleryImages = [];
        if ($isModel && $this->resource->id) {
            // Query directly instead of using relationship
            $galleryImages = \App\Models\ArticleImage::query()
                ->where('article_id', $this->resource->id)
                ->pluck('image_path')
                ->map(fn($path) => (string) $path)
                ->toArray();
        } elseif (isset($data['galleryImages']) && is_array($data['galleryImages'])) {
            $galleryImages = array_map('strval', $data['galleryImages']);
        } elseif (isset($data['gallery_images']) && is_array($data['gallery_images'])) {
            $galleryImages = array_map('strval', $data['gallery_images']);
        }

        // Parse topics if it's a JSON string
        $topics = [];
        if (isset($data['topics'])) {
            if (is_string($data['topics'])) {
                $decoded = json_decode($data['topics'], true);
                $topics = is_array($decoded) ? array_map('strval', $decoded) : [];
            } elseif (is_array($data['topics'])) {
                $topics = array_map('strval', $data['topics']);
            }
        }

        return [
            // Core fields - all scalar, no objects
            'id' => (string) ($data['id'] ?? ''),
            'title' => (string) ($data['title'] ?? ''),
            'summary' => (string) ($data['summary'] ?? ($data['content'] ?? '')),
            'content' => (string) ($data['content'] ?? ''),
            'category' => (string) ($data['category'] ?? ''),
            'country' => (string) ($data['country'] ?? ($data['location'] ?? 'Global')),
            'status' => (string) ($data['status'] ?? 'pending'),
            'created_at' => isset($data['created_at']) ? (string) $data['created_at'] : null,
            'views_count' => (int) ($data['views_count'] ?? 0),
            
            // Image handling - scalar strings only
            'image_url' => (string) ($data['image'] ?? ($data['image_url'] ?? '')),
            'image' => (string) ($data['image'] ?? ($data['image_url'] ?? '')),
            
            // Aliases for frontend compatibility - scalar strings only
            'location' => (string) ($data['country'] ?? ($data['location'] ?? 'Global')),
            'description' => (string) ($data['summary'] ?? ($data['content'] ?? '')),
            'date' => isset($data['created_at']) ? (string) $data['created_at'] : null,
            'views' => number_format((int) ($data['views_count'] ?? 0)) . ' views',
            
            // Array fields - array of strings ONLY, no objects
            'published_sites' => $publishedSites,
            'sites' => $publishedSites,
            'topics' => $topics,
            'galleryImages' => $galleryImages,

            // Optional/Metadata - scalar strings only
            'keywords' => (string) ($data['keywords'] ?? ''),
            'source' => (string) ($data['source'] ?? ''),
            'original_url' => (string) ($data['original_url'] ?? ''),
        ];
    }
}
