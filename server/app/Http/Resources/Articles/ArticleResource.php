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
        $res = $this->resource;
        $isModel = $res instanceof \Illuminate\Database\Eloquent\Model;
        
        // Extract raw data safely
        if ($isModel) {
            $data = $res->getAttributes();
        } else {
            $data = (array) $res;
        }
        
        $get = function($key, $default = null) use ($data) {
            return $data[$key] ?? $default;
        };

        // Handle sites (robust)
        // If it's a model, check for the relation FIRST to avoid accessor interference
        $sites = [];
        if ($isModel) {
            if ($res->relationLoaded('publishedSites')) {
                $rel = $res->getRelation('publishedSites');
                $sites = ($rel instanceof \Illuminate\Support\Collection) 
                    ? $rel->pluck('site_name')->toArray() 
                    : (is_array($rel) ? $rel : []);
            } else {
                // Use the accessor if relation not loaded, ensuring we treat it as an array
                $attr = $res->published_sites; // Accessor returns array
                $sites = is_array($attr) ? $attr : [];
            }
        } else {
            $sitesData = $get('published_sites') ?? $get('sites', []);
            $sites = is_array($sitesData) ? $sitesData : [];
        }

        // Handle images (robust)
        $images = [];
        if ($isModel) {
            if ($res->relationLoaded('images')) {
                $rel = $res->getRelation('images');
                $images = ($rel instanceof \Illuminate\Support\Collection) 
                    ? $rel->pluck('image_path')->toArray() 
                    : (is_array($rel) ? $rel : []);
            } else {
                $images = []; // Not loaded
            }
        } else {
            $imgs = $get('galleryImages') ?? $get('gallery_images') ?? [];
            $images = is_array($imgs) ? $imgs : [];
        }

        // Date logic (Redis uses 'timestamp', DB uses 'created_at')
        $date = $get('created_at');
        if (empty($date) && isset($data['timestamp'])) {
            $ts = $data['timestamp'];
            $date = is_numeric($ts) ? date('Y-m-d H:i:s', (int)$ts) : (string)$ts;
        }

        // Topics logic
        $topics = $get('topics', []);
        if (is_string($topics)) {
            $decoded = json_decode($topics, true);
            $topics = is_array($decoded) ? $decoded : [];
        }

        $isDeleted = (bool) $get('is_deleted', false);
        $status = (string) $get('status', 'pending');

        return [
            'id' => (string) $get('id', ''),
            'slug' => (string) $get('slug', ''),
            'article_id' => (string) $get('article_id', $get('id', '')),
            'title' => (string) $get('title', ''),
            'summary' => (string) $get('summary', $get('content', '')),
            'content' => (string) $get('content', ''),
            'category' => (string) $get('category', 'General'),
            'country' => (string) $get('country', $get('location', 'Global')),
            'status' => $isDeleted ? 'deleted' : $status,
            'created_at' => (string) $date,
            'views_count' => (int) $get('views_count', 0),
            'image_url' => (string) ($get('image_url') ?? $get('image', '')),
            'image' => (string) ($get('image') ?? $get('image_url', '')),
            'location' => (string) $get('country', $get('location', 'Global')),
            'description' => (string) $get('summary', $get('content', '')),
            'date' => (string) $date,
            'views' => number_format((int) $get('views_count', 0)) . ' views',
            'published_sites' => array_map('strval', $sites),
            'sites' => array_map('strval', $sites),
            'topics' => array_map('strval', is_array($topics) ? $topics : []),
            'galleryImages' => array_map('strval', $images),
            'keywords' => (string) $get('keywords', ''),
            'source' => (string) $get('source', ''),
            'original_url' => (string) $get('original_url', ''),
            'is_deleted' => $isDeleted,
            'is_redis' => !$isModel,
        ];
    }
}
