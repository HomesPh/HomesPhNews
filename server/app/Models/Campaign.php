<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Campaign extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'rotation_type',
        'start_date',
        'end_date',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    protected $appends = ['is_active'];

    public function ads(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Ad::class, 'ad_campaign');
    }

    public function scopeActive($query)
    {
        $today = now()->format('Y-m-d');
        
        return $query->where(function ($q) use ($today) {
            $q->whereNull('start_date')
              ->orWhere('start_date', '<=', $today);
        })->where(function ($q) use ($today) {
            $q->whereNull('end_date')
              ->orWhere('end_date', '>=', $today);
        });
    }

    public function getIsActiveAttribute(): bool
    {
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
}
