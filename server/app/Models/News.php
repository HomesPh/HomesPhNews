<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class News extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'summary',
        'category',
        'tags',
        'country',
        'image',
        'status',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
