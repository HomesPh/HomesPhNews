<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdUnit extends Model
{
    use HasFactory;

    protected $table = 'ad_units';

    protected $fillable = [
        'name',
        'page_url',
        'impressions',
        'clicks',
        'type', // image or text
    ];

    protected $casts = [
        'impressions' => 'integer',
        'clicks' => 'integer',
    ];

    // Types
    public const TYPE_IMAGE = 'image';
    public const TYPE_TEXT = 'text';

    public static function getTypes(): array
    {
        return [
            self::TYPE_IMAGE,
            self::TYPE_TEXT,
        ];
    }



    public function campaigns()
    {
        return $this->belongsToMany(Campaign::class, 'ad_unit_campaign')
            ->withTimestamps();
    }
}
