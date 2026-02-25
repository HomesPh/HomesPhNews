<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        // --- Standard Properties ---
        'title',
        'original_title',
        'summary',
        'content',
        'status',
        'views_count',
        'category',
        'country',
        'source',
        'original_url',
        'keywords',
        'author',          // Author name
        'is_deleted',

        // --- Modern Properties ---
        'id',              // UUID from Redis (primary key)
        'topics',          // JSON array of topics
        'content_blocks',  // Structured block data
        'template',        // Visual template name
        'slug',
        'is_legacy',
        'thumbnail_url',

        // --- Legacy Properties (Kept for compatibility) ---
        'article_id',      // UUID from Scraper (legacy, keeping for compatibility)
        'image',           // Legacy fallback for array image structure
        'published_sites', // JSON array of site names
    ];

    /**
     * Automatic JSON casting for array fields
     */
    protected $casts = [
        // --- Standard Properties ---
        'keywords' => 'array',
        'custom_titles' => 'array',
        'views_count' => 'integer',
        'is_deleted' => 'boolean',

        // --- Modern Properties ---
        'topics' => 'array',
        'content_blocks' => 'array',
        'is_legacy' => 'boolean',

        // --- Legacy Properties (Kept for compatibility) ---
        'published_sites' => 'array', // ["FilipinoHomes", "Rent.ph", ...]
        'image' => 'array',
    ];

    /**
     * Append these virtual attributes to JSON responses
     */
    protected $appends = ['image_url'];

    /**
     * Accessor: Provide image_url as alias for image column
     * This ensures frontend compatibility (expects image_url, DB has image)
     */
    public function getImageUrlAttribute(): ?string
    {
        $image = $this->image; // Uses automatic casting
        if (is_array($image)) {
            return $image[0] ?? null;
        }
        return is_string($image) ? $image : null;
    }

    /**
     * Relationship: An article has many gallery images
     */
    public function images()
    {
        return $this->hasMany(ArticleImage::class, 'article_id');
    }

    /**
     * Relationship: Sites where this article is published
     */
    public function publishedSites()
    {
        return $this->belongsToMany(Site::class, 'article_site', 'article_id', 'site_id');
    }

    /**
     * Accessor: Overrides the JSON column to return site names from relationship
     */
    public function getPublishedSitesAttribute(): array
    {
        // Use the loaded relationship if available to avoid N+1 queries
        // We use getRelation() directly to avoid infinite recursion with the accessor name
        if ($this->relationLoaded('publishedSites')) {
            return $this->getRelation('publishedSites')->pluck('site_name')->toArray();
        }

        // Fallback for single record access
        return $this->publishedSites()->pluck('site_name')->toArray();
    }
}
