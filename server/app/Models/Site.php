<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Site extends Model
{
    use HasFactory;

    protected static function booted()
    {
        static::creating(function ($site) {
            if (empty($site->api_key)) {
                $site->api_key = \Illuminate\Support\Str::random(64);
            }
        });
    }

    protected $table = 'sites';

    protected $fillable = [
        'site_name',
        'site_url',
        'site_logo',
        'site_description',
        'site_keywords',
        'site_status',
        'contact_name',
        'contact_email',
        'api_key',
    ];

    protected $casts = [
        'site_keywords' => 'array', // Store categories as JSON array
    ];

    /**
     * Accessor: Get formatted contact string
     */
    public function getContactAttribute(): string
    {
        $name = $this->contact_name ?? 'Unknown';
        $email = $this->contact_email ?? '';
        return $email ? "{$name} ({$email})" : $name;
    }

    /**
     * Relationship: Articles published on this site
     */
    public function articles()
    {
        return $this->belongsToMany(Article::class, 'article_site', 'site_id', 'article_id');
    }

    /**
     * Accessor: Count articles published to this site
     */
    public function getArticlesCountAttribute(): int
    {
        // Check if articles_count was already loaded via withCount()
        if (isset($this->attributes['articles_count'])) {
            return (int) $this->attributes['articles_count'];
        }

        return $this->articles()->count();
    }
}
