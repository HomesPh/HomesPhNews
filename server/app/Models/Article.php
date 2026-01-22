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
        'original_title',
        'original_title',  // From Scraper
        'summary',
        'content',
        'image',
        'status',
        'views_count',
        // 'category_id', // REMOVED
        'category', // ADDED
        // 'user_id', // REMOVED
        'country',
        'site_id',
    ];

    /**
     * Automatic JSON casting for array fields
     */
    protected $casts = [
        'keywords' => 'array',
        'custom_titles' => 'array',
        'topics' => 'array',
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
