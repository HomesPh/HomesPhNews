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

        $isPartnerRequest = $request->attributes->has('site');

        // Partner (external) API: keep content_blocks as stored — no paragraph HTML rewriting.
        if (!$isPartnerRequest) {
            foreach ($contentBlocks as &$block) {
                if (($block['type'] ?? '') === 'text') {
                    if (isset($block['content']['text'])) {
                        $block['content']['text'] = $this->formatParagraphsPhp($block['content']['text']);
                    } elseif (is_string($block['content'])) {
                        $block['content'] = $this->formatParagraphsPhp($block['content']);
                    }
                } elseif (in_array(($block['type'] ?? ''), ['left-image', 'right-image', 'split-left', 'split-right'])) {
                    if (isset($block['content']['text'])) {
                        $block['content']['text'] = $this->formatParagraphsPhp($block['content']['text']);
                    }
                }
            }
            unset($block);
        }

        $user = $request->user();
        $isAdmin = $user && ($user->isAdmin() || $user->isCeo() || $user->isEditor());

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
            'content' => $isPartnerRequest
                ? $this->flattenContentBlocksRaw($contentBlocks, (string) $get('content', ''))
                : $this->flattenContentBlocks($contentBlocks, (string) $get('content', '')),
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

        // Enrich description with the actual content for non-admins
        if (!$isAdmin) {
            $result['description'] = $this->stripAndSummarize($result['content'], (string) $get('summary', ''));
        }

        if (!$isAdmin) {
            // Remove legacy/internal metadata
            unset($result['created_at']);
            unset($result['date']);
            unset($result['source']);
            unset($result['original_url']);
            unset($result['is_redis']);

            // Remove redundant primary image fields as images are now in content_blocks
            unset($result['image_url']);
            unset($result['image']);

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

    /**
     * Flattens content blocks into a single string.
     * Includes both text and images for a full "RAW HTML" experience.
     */
    protected function flattenContentBlocks(array $blocks, string $legacyContent): string
    {
        if (empty($blocks)) {
            return $this->formatParagraphsPhp($legacyContent);
        }

        $htmlChunks = [];
        foreach ($blocks as $block) {
            $type = $block['type'] ?? '';
            $content = $block['content'] ?? [];

            if ($type === 'text') {
                $text = $content['text'] ?? $content ?? '';
                if (!empty($text)) {
                    $htmlChunks[] = $this->formatParagraphsPhp((string) $text);
                }
            } elseif (in_array($type, ['image', 'centered-image', 'left-image', 'right-image'])) {
                $src = $content['src'] ?? $content['image'] ?? $block['image'] ?? '';
                $caption = $content['caption'] ?? $block['caption'] ?? '';
                if (!empty($src)) {
                    $htmlChunks[] = "<figure style='margin: 20px 0; text-align: center;'><img src='{$src}' style='max-width: 100%; height: auto; border-radius: 12px; shadow: 0 4px 6px rgba(0,0,0,0.1);' />" .
                        (!empty($caption) ? "<figcaption style='font-style: italic; color: #666; margin-top: 8px;'>{$caption}</figcaption>" : "") .
                        "</figure>";
                }

                // If it's a side-image, it might also have text
                if (in_array($type, ['left-image', 'right-image']) && !empty($content['text'])) {
                    $htmlChunks[] = $this->formatParagraphsPhp((string) $content['text']);
                }
            } elseif ($type === 'grid' || $type === 'dynamic-images') {
                $images = $content['images'] ?? [];
                if (!empty($images)) {
                    $gridHtml = "<div style='display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin: 20px 0;'>";
                    foreach ($images as $img) {
                        $gridHtml .= "<img src='{$img}' style='width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 8px;' />";
                    }
                    $gridHtml .= "</div>";
                    $htmlChunks[] = $gridHtml;
                }
            } elseif (str_starts_with($type, 'split-')) {
                $src = $content['image'] ?? $block['image'] ?? '';
                $text = $content['text'] ?? '';
                if (!empty($src)) {
                    $htmlChunks[] = "<img src='{$src}' style='width: 100%; border-radius: 12px; margin: 20px 0;' />";
                }
                if (!empty($text)) {
                    $htmlChunks[] = $this->formatParagraphsPhp((string) $text);
                }
            }
        }

        if (empty($htmlChunks)) {
            return $this->formatParagraphsPhp($legacyContent);
        }

        return implode("", $htmlChunks);
    }

    /**
     * Minimal HTML concat for external partners: no smart paragraphs, no styled figures.
     */
    protected function flattenContentBlocksRaw(array $blocks, string $legacyContent): string
    {
        if (empty($blocks)) {
            return $legacyContent;
        }

        $htmlChunks = [];
        foreach ($blocks as $block) {
            $type = $block['type'] ?? '';
            $content = $block['content'] ?? [];

            if ($type === 'text') {
                $text = $content['text'] ?? $content ?? '';
                if ($text !== '' && $text !== null) {
                    $htmlChunks[] = (string) $text;
                }
            } elseif (in_array($type, ['image', 'centered-image', 'left-image', 'right-image'])) {
                $src = $content['src'] ?? $content['image'] ?? $block['image'] ?? '';
                $caption = $content['caption'] ?? $block['caption'] ?? '';
                if ($src !== '' && $src !== null) {
                    $srcEsc = htmlspecialchars((string) $src, ENT_QUOTES | ENT_HTML5, 'UTF-8');
                    $altEsc = htmlspecialchars((string) $caption, ENT_QUOTES | ENT_HTML5, 'UTF-8');
                    $htmlChunks[] = '<img src="' . $srcEsc . '" alt="' . $altEsc . '" />';
                }
                if (in_array($type, ['left-image', 'right-image'], true) && !empty($content['text'])) {
                    $htmlChunks[] = (string) $content['text'];
                }
            } elseif ($type === 'grid' || $type === 'dynamic-images') {
                $images = $content['images'] ?? [];
                foreach ($images as $img) {
                    if ($img !== '' && $img !== null) {
                        $srcEsc = htmlspecialchars((string) $img, ENT_QUOTES | ENT_HTML5, 'UTF-8');
                        $htmlChunks[] = '<img src="' . $srcEsc . '" alt="" />';
                    }
                }
            } elseif (str_starts_with((string) $type, 'split-')) {
                $src = $content['image'] ?? $block['image'] ?? '';
                $text = $content['text'] ?? '';
                if ($src !== '' && $src !== null) {
                    $srcEsc = htmlspecialchars((string) $src, ENT_QUOTES | ENT_HTML5, 'UTF-8');
                    $htmlChunks[] = '<img src="' . $srcEsc . '" alt="" />';
                }
                if ($text !== '' && $text !== null) {
                    $htmlChunks[] = (string) $text;
                }
            }
        }

        if (empty($htmlChunks)) {
            return $legacyContent;
        }

        return implode('', $htmlChunks);
    }

    /**
     * Provide a meaningful description if summary is missing, or vice versa.
     */
    protected function stripAndSummarize(string $content, string $summary): string
    {
        if (!empty($summary)) {
            return $summary;
        }

        $stripped = strip_tags($content);
        return mb_strlen($stripped) > 160 ? mb_substr($stripped, 0, 160) . '...' : $stripped;
    }

    /**
     * Smart Paragraphs (PHP Version)
     * Splits text into multiple paragraphs if there are more than 5 sentences.
     * Returns HTML (<p> tags).
     */
    protected function formatParagraphsPhp(string $content, int $maxSentences = 5): string
    {
        if (empty($content)) {
            return "";
        }

        // Check if already contains block-level HTML tags
        if (preg_match('/<(p|div|ul|ol|table|blockquote|h[1-6])[\s>]/i', $content)) {
            return $content;
        }

        // Split into chunks by double newline or single newline
        $paras = preg_split('/\n\s*\n|\n/', $content, -1, PREG_SPLIT_NO_EMPTY);
        $result = [];

        foreach ($paras as $p) {
            $formattedChunks = $this->processParagraphSentencesHtml(trim($p), $maxSentences);
            foreach ($formattedChunks as $chunk) {
                $result[] = "<p>" . $chunk . "</p>";
            }
        }

        return implode("", $result);
    }

    /**
     * Sub-logic for formatting a single paragraph block into multiple if sentences exceed threshold.
     * Returns an array of formatted strings (each to be wrapped in <p>).
     */
    protected function processParagraphSentencesHtml(string $text, int $maxSentences): array
    {
        $abbreviations = [
            'Mr',
            'Ms',
            'Mrs',
            'Dr',
            'Prof',
            'Sr',
            'Jr',
            'Co',
            'Inc',
            'Ltd',
            'Corp',
            'St',
            'Ave',
            'Rd',
            'approx',
            'est',
            'misc',
            'vs',
            'e.g',
            'i.e',
            'etc',
            'Ph.D',
            'M.D',
            'B.A',
            'M.A',
            'U.S',
            'U.K',
            'A.M',
            'P.M',
            'Phil',
            'Gov',
            'Dept',
            'Adm',
            'Atty',
            'Capt',
            'Col',
            'Gen',
            'Hon',
            'Lt',
            'Maj',
            'Rev',
            'Sgt'
        ];

        $rawSentences = preg_split('/(?<=[.!?])(?:\s+|$)/', $text, -1, PREG_SPLIT_NO_EMPTY);

        $sentences = [];
        $temp = "";

        foreach ($rawSentences as $s) {
            $current = trim($s);
            if (empty($current))
                continue;

            $combined = $temp !== "" ? $temp . " " . $current : $current;

            $isAbbr = false;
            foreach ($abbreviations as $abbr) {
                if (preg_match('/' . preg_quote($abbr, '/') . '$/i', rtrim($current, '.'))) {
                    $isAbbr = true;
                    break;
                }
            }

            if ($isAbbr || (strlen($current) <= 2 && preg_match('/[a-z]/i', $current))) {
                $temp = $combined;
            } else {
                $sentences[] = $combined;
                $temp = "";
            }
        }

        if ($temp !== "") {
            if (!empty($sentences)) {
                $sentences[count($sentences) - 1] .= " " . $temp;
            } else {
                $sentences[] = $temp;
            }
        }

        $count = count($sentences);
        if ($count <= $maxSentences + 1) {
            return [implode(" ", $sentences)];
        }

        $numChunks = (int) ceil($count / $maxSentences);
        $targetSize = (int) floor($count / $numChunks);
        $extra = $count % $numChunks;

        $chunks = [];
        $currentIdx = 0;
        for ($i = 0; $i < $numChunks; $i++) {
            $size = $targetSize + ($extra > 0 ? 1 : 0);
            $chunks[] = implode(" ", array_slice($sentences, $currentIdx, $size));
            $currentIdx += $size;
            $extra--;
        }

        return $chunks;
    }
}
