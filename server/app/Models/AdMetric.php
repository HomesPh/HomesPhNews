<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdMetric extends Model
{
    use HasFactory;

    protected $fillable = [
        'ad_unit_id',
        'campaign_id',
        'type',
        'created_at',
    ];

    public function adUnit()
    {
        return $this->belongsTo(AdUnit::class);
    }

    public function campaign()
    {
        return $this->belongsTo(Campaign::class);
    }
}
