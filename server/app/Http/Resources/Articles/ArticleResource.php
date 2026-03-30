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

        $get = function ($key, $default = null) use ($res, $isModel, $data) {
            if ($isModel) {
                return $res->{$key} ?? $data[$key] ?? $default;
            }
            return $data[$key] ?? $default;
        };

        // Handle sites (robust)
        $sites = [];
        if ($isModel) {
            if ($res->relationLoaded('publishedSites')) {
                $rel = $res->getRelation('publishedSites');
                $sites = ($rel instanceof \Illuminate\Support\Collection)
                    ? $rel->pluck('site_name')->toArray()
                    : (is_array($rel) ? $rel : []);
            } else {
                $attr = $res->published_sites;
                $sites = is_array($attr) ? $attr : [];
            }
        } else {
            $sitesData = $get('published_sites', []) ?? $get('sites', []);
            $sites = is_array($sitesData) ? $sitesData : [];
        }

        if ($request->attributes->has('site')) {
            $authenticatedSite = $request->attributes->get('site');
            $authenticatedSiteName = $authenticatedSite->site_name ?? null;
            if ($authenticatedSiteName) {
                $sites = array_values(array_filter($sites, function ($siteName) use ($authenticatedSiteName) {
                    return strval($siteName) === strval($authenticatedSiteName);
                }));
            }
        }

        // Handle images (robust)
        $images = [];
        if ($isModel) {
            if ($res->relationLoaded('images')) {
                $rel = $res->getRelation('images');
                $images = ($rel instanceof \Illuminate\Support\Collection)
                    ? $rel->pluck('image_path')->toArray()
                    : (is_array($rel) ? $rel : []);
            }
        } else {
            $imgs = $get('galleryImages', []) ?? $get('gallery_images', []) ?? [];
            $images = is_array($imgs) ? $imgs : [];
        }

        // Date logic: Prioritize published_at, fallback to created_at
        $date = $get('published_at') ?? $get('created_at', null);
        if (empty($date) && isset($data['timestamp'])) {
            $ts = $data['timestamp'];
            $date = is_numeric($ts) ? date('Y-m-d H:i:s', (int) $ts) : (string) $ts;
        }

        // Topics logic
        $topics = $get('topics', []);
        if (is_string($topics)) {
            $decoded = json_decode($topics, true);
            $topics = is_array($decoded) ? $decoded : [];
        }

        $status = (string) $get('status', 'pending');

        // Content is retrieved from content_blocks in modern flow
        $summary = (string) $get('summary', '');
        $description = (string) $get('summary', '');

        // Resolve primary image values once so we can reuse them and dedupe blocks against them
        $rawImageUrl = $data['image_url'] ?? $data['image'] ?? '';
        $rawImage = $data['image'] ?? $data['image_url'] ?? '';
        $primaryImageUrl = $this->sanitizeImageUrl($rawImageUrl);
        $primaryImage = $this->sanitizeImageUrl($rawImage);
        $heroImage = $primaryImageUrl !== '' ? $primaryImageUrl : $primaryImage;

        // Decode content blocks
        $rawBlocks = $get('content_blocks', []);
        if (is_string($rawBlocks)) {
            $decodedBlocks = json_decode($rawBlocks, true);
            $contentBlocks = is_array($decodedBlocks) ? $decodedBlocks : [];
        } elseif (is_array($rawBlocks)) {
            $contentBlocks = $rawBlocks;
        } else {
            $contentBlocks = [];
        }

        $result = [
            'id' => (string) $get('id', ''),
            'slug' => (string) $get('slug', ''),
            'title' => (string) $get('title', ''),
            'summary' => $summary,
            'category' => (string) $get('category', 'All'),
            'country' => (string) $get('country', $get('location', 'Global')),
            'status' => $status,
            'created_at' => (string) $date,
            'views_count' => (int) $get('views_count', 0),
            'image_url' => $primaryImageUrl,
            'image' => $primaryImage,
            'location' => (string) $get('country', $get('location', 'Global')),
            'description' => $description,
            'views' => number_format((int) $get('views_count', 0)) . ' views',
            'published_sites' => array_map('strval', $sites),
            'sites' => array_map('strval', $sites),
            'topics' => array_map('strval', is_array($topics) ? $topics : []),
            'galleryImages' => array_map('strval', $images),
            'keywords' => is_array($get('keywords', [])) ? implode(', ', $get('keywords', [])) : (string) $get('keywords', ''),
            'original_url' => (string) $get('original_url', ''),
            'is_redis' => !$isModel,
            'content_blocks' => $contentBlocks,
            'content' => (string) $get('content', ''),
            'author' => (string) $get('author', ''),
            'province_id' => $get('province_id'),
            'city_id' => $get('city_id'),
            'province_name' => $isModel ? ($this->province->name ?? null) : null,
            'city_name' => $isModel ? ($this->city->name ?? null) : null,
            'editor_first_name' => $isModel ? ($this->editor->first_name ?? null) : null,
            'editor_last_name' => $isModel ? ($this->editor->last_name ?? null) : null,
            'editor_name' => $isModel ? ($this->editor->name ?? null) : null,
            'published_at' => (string) $date,
        ];

        // Conditional cleanup for non-admin consumers
        // - Admin requests (Sanctum auth with admin/ceo/editor role) keep all metadata
        // - Public/External requests get a streamlined payload
        $user = $request->user();
        $isAdmin = $user && ($user->isAdmin() || $user->isCeo() || $user->isEditor());

        if (!$isAdmin) {
            // Remove legacy/internal metadata
            unset($result['created_at']);
            unset($result['date']);
            unset($result['source']);
            unset($result['original_url']);
            unset($result['is_redis']);

            // Remove redundant primary image fields as images are now in content_blocks
            unset($result['image_url']);

            // Note: published_at remains as the primary timestamp
        }

        return $result;
    }

    /**
     * Sanitize image URL that may be stored as a JSON array string.
     * e.g. '["https://example.com/img.png"]' → 'https://example.com/img.png'
     */
    protected function sanitizeImageUrl(mixed $value): string
    {
        if (is_array($value)) {
            return (string) ($value[0] ?? '');
        }

        $str = trim((string) $value);

        // Case 1: JSON array string '["url"]'
        if (str_starts_with($str, '["') && str_ends_with($str, '"]')) {
            $decoded = json_decode($str, true);
            if (is_array($decoded) && !empty($decoded)) {
                return (string) ($decoded[0] ?? '');
            }
        }

        // Case 2: Quoted JSON string '"url"' (happens with MySQL JSON columns)
        if (str_starts_with($str, '"') && str_ends_with($str, '"')) {
            $decoded = json_decode($str);
            if (is_string($decoded)) {
                return $decoded;
            }
            return trim($str, '"');
        }

        return $str;
    }

}
