<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'summary',
        'content',
        'image',
        'status',
        'views_count',
        // 'category_id', // REMOVED
        'category', // ADDED
        // 'user_id', // REMOVED
        'country',
        'distributed_in',
    ];

    // public function category()
    // {
    //     return $this->belongsTo(Category::class);
    // }

    // public function author()
    // {
    //     return $this->belongsTo(User::class, 'user_id');
    // }
}
