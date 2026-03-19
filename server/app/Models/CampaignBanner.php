<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CampaignBanner extends Model
{
    protected $fillable = [
        'campaign_id',
        'image_url',
        'resolution',
        'width',
        'height',
    ];

    public function campaign()
    {
        return $this->belongsTo(Campaign::class);
    }
}
