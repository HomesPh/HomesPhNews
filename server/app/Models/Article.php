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

    public function site()
    {
        return $this->belongsTo(sites::class, 'site_id');
    }


    // public function author()
    // {
    //     return $this->belongsTo(User::class, 'user_id');
    // }
}
