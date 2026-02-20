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
        'id',              // UUID from Redis (primary key)
        'article_id',      // UUID from Scraper (legacy, keeping for compatibility)
        'title',
        'original_title',
        'summary',
        'content',
        'image',
        'status',
        'views_count',
        'category',
        'country',
        'source',
        'original_url',
        'keywords',
        'topics',          // JSON array of topics
        'published_sites', // JSON array of site names
        'content_blocks',  // Structured block data
        'template',        // Visual template name
        'author',          // Author name
        'is_deleted',
        'slug',
    ];

    /**
     * Automatic JSON casting for array fields
     */
    protected $casts = [
        'keywords' => 'array',
        'custom_titles' => 'array',
        'topics' => 'array',
        'published_sites' => 'array', // ["FilipinoHomes", "Rent.ph", ...]
        'content_blocks' => 'array',
        'image' => 'array',
        'views_count' => 'integer',
        'is_deleted' => 'boolean',
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
