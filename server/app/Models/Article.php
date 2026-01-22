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
    ];

    /**
     * Automatic JSON casting for array fields
     */
    protected $casts = [
        'keywords' => 'array',
        'custom_titles' => 'array',
        'topics' => 'array',
        'published_sites' => 'array', // ["FilipinoHomes", "Rent.ph", ...]
        'views_count' => 'integer',
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
        return $this->attributes['image'] ?? null;
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
        return $this->publishedSites()->pluck('site_name')->toArray();
    }

    /**
     * Ensure published_sites is always populated from relationship in JSON
     */
    public function toArray()
    {
        $attributes = parent::toArray();
        
        // Force override published_sites with relationship data
        $attributes['published_sites'] = $this->getPublishedSitesAttribute();
        
        return $attributes;
    }
}
