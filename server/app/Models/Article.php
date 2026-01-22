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
        'article_id',      // UUID from Scraper
        'title',
        'original_title',  // From Scraper
        'summary',
        'content',
        'image',           // Maps to image_url in scraper
        'status',
        'views_count',
        'category',
        'country',
        'source',          // Scraper source (e.g. CNN)
        'original_url',    // Original news link
        'keywords',        // AI Generated keywords
        'distributed_in',
        'custom_titles',   // Admin custom headlines
        'site_id',
        'custom_titles',
    ];

    protected $casts = [
        'custom_titles' => 'array',
    ];

    /**
     * Automatic JSON casting for array fields
     */
    protected $casts = [
        'keywords' => 'array',
        'custom_titles' => 'array',
        'distributed_in' => 'array', // Usually a string of comma-separated values, but can be array
        'views_count' => 'integer',
        'site_id' => 'integer',
    ];

    public function site()
    {
        return $this->belongsTo(sites::class, 'site_id');
    }

    // public function author()
    // {
    //     return $this->belongsTo(User::class, 'user_id');
    // }
}
