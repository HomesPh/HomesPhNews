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

        // Date logic
        $date = $get('created_at', null);
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

        $isDeleted = (bool) $get('is_deleted', false);
        $status = (string) $get('status', 'pending');

        // Get content values - Use raw content (HTML) for all consumers
        // User requested "pure HTML" so external consumers don't have to manually adjust paragraphs
        $content = (string) $get('content', '');
        $summary = (string) $get('summary', $content);
        $description = (string) $get('summary', $content);

        // Resolve primary image values once so we can reuse them and dedupe blocks against them
        $rawImageUrl = $data['image_url'] ?? $data['image'] ?? '';
        $rawImage = $data['image'] ?? $data['image_url'] ?? '';
        $primaryImageUrl = $this->sanitizeImageUrl($rawImageUrl);
        $primaryImage = $this->sanitizeImageUrl($rawImage);
        $heroImage = $primaryImageUrl !== '' ? $primaryImageUrl : $primaryImage;

        // Decode content blocks and remove any image blocks that duplicate the hero image URL
        $rawBlocks = $get('content_blocks', []);
        if (is_string($rawBlocks)) {
            $decodedBlocks = json_decode($rawBlocks, true);
            $contentBlocks = is_array($decodedBlocks) ? $decodedBlocks : [];
        } elseif (is_array($rawBlocks)) {
            $contentBlocks = $rawBlocks;
        } else {
            $contentBlocks = [];
        }

        if ($heroImage && is_array($contentBlocks)) {
            $contentBlocks = array_values(array_filter($contentBlocks, function ($block) use ($heroImage) {
                if (!is_array($block)) {
                    return true;
                }
                if (($block['type'] ?? '') !== 'image') {
                    return true;
                }
                $src = $block['content']['src'] ?? null;
                if (!$src) {
                    return true;
                }
                return (string) $src !== (string) $heroImage;
            }));
        }

        $result = [
            'id' => (string) $get('id', ''),
            'slug' => (string) $get('slug', ''),
            'article_id' => (string) $get('article_id', $get('id', '')),
            'title' => (string) $get('title', ''),
            'summary' => $summary,
            'content' => $content,
            'category' => (string) $get('category', 'All'),
            'country' => (string) $get('country', $get('location', 'Global')),
            'status' => $isDeleted ? 'deleted' : $status,
            'created_at' => (string) $date,
            'views_count' => (int) $get('views_count', 0),
            'image_url' => $primaryImageUrl,
            'image' => $primaryImage,
            'location' => (string) $get('country', $get('location', 'Global')),
            'description' => $description,
            'date' => (string) $date,
            'views' => number_format((int) $get('views_count', 0)) . ' views',
            'published_sites' => array_map('strval', $sites),
            'sites' => array_map('strval', $sites),
            'topics' => array_map('strval', is_array($topics) ? $topics : []),
            'galleryImages' => array_map('strval', $images),
            'keywords' => is_array($get('keywords', [])) ? implode(', ', $get('keywords', [])) : (string) $get('keywords', ''),
            'source' => (string) $get('source', ''),
            'original_url' => (string) $get('original_url', ''),
            'is_deleted' => $isDeleted,
            'is_redis' => !$isModel,
            'content_blocks' => $contentBlocks,
            'template' => (string) $get('template', ''),
            'author' => (string) $get('author', ''),
        ];

        // For external API consumers (e.g. /api/external/articles), avoid duplicate images.
        // 1) If image and image_url are the same, drop image (keep image_url as primary).
        // 2) If the first content_blocks image matches image_url, drop that first image block
        //    so external frontends that render a hero image + content_blocks won't show it twice.
        // 3) If the HTML content starts with a <figure> that uses the same hero image URL,
        //    strip that leading figure so the hero image is only shown once.
        if ($request->is('api/external/*')) {
            $imgUrl = (string) ($result['image_url'] ?? '');
            $img = (string) ($result['image'] ?? '');

            if ($imgUrl !== '' && $img !== '' && $imgUrl === $img) {
                unset($result['image']);
            }

            // Remove duplicate hero image in content_blocks
            if (
                $imgUrl !== '' &&
                isset($result['content_blocks'][0]) &&
                is_array($result['content_blocks'][0]) &&
                ($result['content_blocks'][0]['type'] ?? null) === 'image'
            ) {
                $firstBlock = $result['content_blocks'][0];
                $firstSrc = $firstBlock['content']['src'] ?? null;

                if (is_string($firstSrc) && $firstSrc === $imgUrl) {
                    // Drop the first image block and reindex the array
                    array_shift($result['content_blocks']);
                    $result['content_blocks'] = array_values($result['content_blocks']);
                }
            }

            // Remove leading <figure> wrapper in HTML content if it uses the same hero image URL
            if ($imgUrl !== '' && !empty($result['content'])) {
                $contentHtml = $result['content'];
                $trimmed = ltrim($contentHtml);

                if (str_starts_with($trimmed, '<figure')) {
                    // Only attempt removal if this figure actually references the hero image URL
                    if (strpos($trimmed, $imgUrl) !== false) {
                        $closingPos = stripos($trimmed, '</figure>');
                        if ($closingPos !== false) {
                            $afterFigure = substr($trimmed, $closingPos + strlen('</figure>'));
                            // Preserve original leading whitespace before <figure>
                            $leadingWhitespaceLen = strlen($contentHtml) - strlen(ltrim($contentHtml, " \t\n\r\0\x0B"));
                            $leadingWhitespace = substr($contentHtml, 0, $leadingWhitespaceLen);
                            $result['content'] = $leadingWhitespace . ltrim($afterFigure);
                        }
                    }
                }
            }
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
