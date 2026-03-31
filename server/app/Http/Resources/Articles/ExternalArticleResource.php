<?php

namespace App\Http\Resources\Articles;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

/**
 * External partner API payload: dedicated shape (no ArticleResource).
 * Primary image unwraps JSON string/array wrappers only (fixes doubled quotes in DB).
 */
class ExternalArticleResource extends JsonResource
{
    public static $wrap = null;

    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $res = $this->resource;
        $isModel = $res instanceof \Illuminate\Database\Eloquent\Model;

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

        $publishedRaw = $get('published_at');
        $createdRaw = $get('created_at');
        $displayDate = $publishedRaw ?? $createdRaw ?? null;
        if (empty($displayDate) && isset($data['timestamp'])) {
            $ts = $data['timestamp'];
            $displayDate = is_numeric($ts) ? date('Y-m-d H:i:s', (int) $ts) : (string) $ts;
        }

        $topics = $get('topics', []);
        if (is_string($topics)) {
            $decoded = json_decode($topics, true);
            $topics = is_array($decoded) ? $decoded : [];
        }

        $status = (string) $get('status', 'pending');

        $summary = (string) $get('summary', '');
        $description = (string) $get('summary', '');

        if ($isModel) {
            $rawImage = $data['image'] ?? null;
        } else {
            $rawImage = $data['image'] ?? $data['image_url'] ?? null;
        }
        $image = $this->unwrapStoredImage($rawImage);

        $rawBlocks = $get('content_blocks', []);
        if (is_string($rawBlocks)) {
            $decodedBlocks = json_decode($rawBlocks, true);
            $contentBlocks = is_array($decodedBlocks) ? $decodedBlocks : [];
        } elseif (is_array($rawBlocks)) {
            $contentBlocks = $rawBlocks;
        } else {
            $contentBlocks = [];
        }

        $categoryName = (string) $get('category', '');
        $categorySlugMap = Cache::remember('external_api_category_slug_by_name_v1', 300, function () {
            return \App\Models\Category::where('is_active', true)->pluck('slug', 'name')->all();
        });
        $categorySlug = $categoryName !== '' ? ($categorySlugMap[$categoryName] ?? null) : null;

        $provinceSlug = null;
        $citySlug = null;
        if ($isModel) {
            if ($res->relationLoaded('province') && $res->province) {
                $provinceSlug = Str::slug($res->province->name);
            }
            if ($res->relationLoaded('city') && $res->city) {
                $citySlug = Str::slug($res->city->name);
            }
        }

        return [
            'id' => (string) $get('id', ''),
            'slug' => (string) $get('slug', ''),
            'title' => (string) $get('title', ''),
            'summary' => $summary,
            'category' => (string) $get('category', 'All'),
            'country' => (string) $get('country', $get('location', 'Global')),
            'status' => $status,
            'published_at' => $this->formatExternalDateTime($publishedRaw),
            'created_at' => $this->formatExternalDateTime($createdRaw),
            'views_count' => (int) $get('views_count', 0),
            'image' => $image,
            'location' => (string) $get('country', $get('location', 'Global')),
            'description' => $description,
            'date' => $this->formatExternalDateTime($displayDate),
            'views' => number_format((int) $get('views_count', 0)) . ' views',
            'published_sites' => array_map('strval', $sites),
            'topics' => array_map('strval', is_array($topics) ? $topics : []),
            'keywords' => is_array($get('keywords', [])) ? implode(', ', $get('keywords', [])) : (string) $get('keywords', ''),
            'content_blocks' => $contentBlocks,
            'category_slug' => $categorySlug,
            'province_slug' => $provinceSlug,
            'city_slug' => $citySlug,
            'author' => (string) $get('author', ''),
            'province_id' => $get('province_id'),
            'city_id' => $get('city_id'),
            'province_name' => $isModel ? ($this->province->name ?? null) : null,
            'city_name' => $isModel ? ($this->city->name ?? null) : null,
        ];
    }

    protected function formatExternalDateTime(mixed $value): string
    {
        if ($value === null || $value === '') {
            return '';
        }
        if ($value instanceof \DateTimeInterface) {
            return $value->format('Y-m-d H:i:s');
        }

        return (string) $value;
    }

    /**
     * Unwrap image values stored as JSON string/array (e.g. MySQL JSON or legacy encoding).
     */
    protected function unwrapStoredImage(mixed $value): string
    {
        if ($value === null || $value === '') {
            return '';
        }

        if (is_array($value)) {
            return (string) ($value[0] ?? '');
        }

        $str = trim((string) $value);

        if (str_starts_with($str, '["') && str_ends_with($str, '"]')) {
            $decoded = json_decode($str, true);
            if (is_array($decoded) && !empty($decoded)) {
                return (string) ($decoded[0] ?? '');
            }
        }

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
