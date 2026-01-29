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
        $data = $isModel ? $this->resource->toArray() : $this->resource;

        $publishedSites = ($isModel && $this->resource->relationLoaded('publishedSites')) 
            ? $this->resource->getRelation('publishedSites')->pluck('site_name')->toArray() 
            : ($data['published_sites'] ?? []);

        return [
            // Core fields
            'id' => (string) ($data['id'] ?? ''),
            'title' => $data['title'] ?? '',
            'summary' => $data['summary'] ?? ($data['content'] ?? ''),
            'content' => $data['content'] ?? '',
            'category' => $data['category'] ?? '',
            'country' => $data['country'] ?? ($data['location'] ?? 'Global'),
            'status' => $data['status'] ?? 'pending',
            'created_at' => $data['created_at'] ?? ($data['timestamp'] ?? null),
            'views_count' => (int) ($data['views_count'] ?? 0),
            
            // Image handling
            'image_url' => $data['image_url'] ?? ($data['image'] ?? ''),
            'image' => $data['image'] ?? ($data['image_url'] ?? ''),
            
            // Aliases for frontend compatibility
            'location' => $data['country'] ?? ($data['location'] ?? 'Global'),
            'description' => $data['summary'] ?? ($data['content'] ?? ''),
            'date' => $data['created_at'] ?? ($data['timestamp'] ?? null),
            'views' => number_format((int) ($data['views_count'] ?? 0)) . ' views',
            
            // Sites and Topics
            'published_sites' => $publishedSites,
            'sites' => $publishedSites, // Used by BaseArticleCard
            'topics' => is_string($data['topics'] ?? null) ? json_decode($data['topics'], true) : ($data['topics'] ?? []),
            
            // Optional/Metadata
            'keywords' => $data['keywords'] ?? '',
            'source' => $data['source'] ?? '',
            'original_url' => $data['original_url'] ?? '',
        ];
    }
}
