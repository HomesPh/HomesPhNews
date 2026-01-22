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
}
