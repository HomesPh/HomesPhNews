<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Campaign extends Model
{
    use HasFactory;

    protected $table = 'campaigns';

    protected $fillable = [
        'name',
        'status',               // active, paused, archived
        'start_date',
        'end_date',

        // gen creatives

        'image_url',
        'target_url',
        'headline',             // for text type campaigns

        // banner creatives
        'banner_image_urls',    // array of image urls

        // stats
        'impressions',
        'clicks',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'impressions' => 'integer',
        'clicks' => 'integer',
        'banner_image_urls' => 'array',
    ];

    // Statuses
    public const STATUS_ACTIVE = 'active';
    public const STATUS_PAUSED = 'paused';
    public const STATUS_ARCHIVED = 'archived';

    public static function getStatuses(): array
    {
        return [
            self::STATUS_ACTIVE,
            self::STATUS_PAUSED,
            self::STATUS_ARCHIVED,
        ];
    }



    /**
     * Scope a query to only include active campaigns.
     */
    public function scopeActive($query)
    {
        $today = now()->format('Y-m-d');
        
        return $query->where('status', self::STATUS_ACTIVE)
                     ->where(function ($q) use ($today) {
                         $q->whereNull('start_date')
                           ->orWhere('start_date', '<=', $today);
                     })->where(function ($q) use ($today) {
                         $q->whereNull('end_date')
                           ->orWhere('end_date', '>=', $today);
                     });
    }

    /**
     * Get the campaign's active status based on dates and status field.
     */
    public function getIsRunningAttribute(): bool
    {
        if ($this->status !== self::STATUS_ACTIVE) {
            return false;
        }

        $today = now()->format('Y-m-d');
        $start = $this->start_date ? $this->start_date->format('Y-m-d') : null;
        $end = $this->end_date ? $this->end_date->format('Y-m-d') : null;

        if ($start && $start > $today) {
            return false;
        }

        if ($end && $end < $today) {
            return false;
        }

        return true;
    }

    public function adUnits()
    {
        return $this->belongsToMany(AdUnit::class, 'ad_unit_campaign')
            ->withTimestamps();
    }
}
