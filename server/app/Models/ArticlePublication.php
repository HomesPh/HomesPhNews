<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ArticlePublication extends Model
{
    use HasFactory;

    protected $fillable = [
        'article_id',
        'title',
        'summary',
        'image_url',
        'category',
        'country',
        'source',
        'scheduled_at',
        'published_at',
        'status',
        'error_message',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
        'published_at' => 'datetime',
    ];
}
