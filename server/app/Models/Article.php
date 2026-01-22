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
        'title',
        'original_title',
        'summary',
        'content',
        'image',
        'category',
        'country',
        'source',
        'original_url',
        'keywords',
        'topics',
        'status',
        'views_count',
        'site_id',
        'custom_titles',
    ];

    protected $casts = [
        'custom_titles' => 'array',
        'topics' => 'array',
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
