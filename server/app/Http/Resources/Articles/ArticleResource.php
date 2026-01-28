<?php

namespace App\Http\Resources\Articles;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ArticleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Handle both Model (Eloquenet) and Array (Redis) data
        $data = is_array($this->resource) ? $this->resource : $this->resource->toArray();

        return [
            'id' => $data['id'] ?? null,
            'title' => $data['title'] ?? '',
            'summary' => $data['summary'] ?? ($data['content'] ?? ''),
            'content' => $data['content'] ?? '',
            'image' => $data['image'] ?? ($data['image_url'] ?? ''),
            'category' => $data['category'] ?? '',
            'country' => $data['country'] ?? ($data['location'] ?? ''),
            'status' => $data['status'] ?? 'pending',
            'views_count' => (int) ($data['views_count'] ?? 0),
            'topics' => is_string($data['topics'] ?? null) ? json_decode($data['topics'], true) : ($data['topics'] ?? []),
            'keywords' => $data['keywords'] ?? '',
            'source' => $data['source'] ?? '',
            'original_url' => $data['original_url'] ?? '',
            'created_at' => $data['created_at'] ?? ($data['timestamp'] ?? null),
            'published_sites' => $this->whenLoaded('publishedSites', function() {
                 return $this->resource->getRelation('publishedSites')->pluck('site_name');
            }, $data['published_sites'] ?? []),
        ];
    }
}
