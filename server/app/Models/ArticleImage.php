<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ArticleImage extends Model
{
    use HasFactory;

    protected $table = 'article_images'; // Needs to match your existing table

    protected $fillable = [
        'article_id',
        'image_path',
        // 'caption', // Add if your table supports it, otherwise remove
        // 'order',   // Add if your table supports it
    ];

    /**
     * Relationship: An image belongs to an article
     */
    public function article()
    {
        return $this->belongsTo(Article::class, 'article_id');
    }
}
