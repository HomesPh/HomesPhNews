<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class SubscriptionDetail extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'subscription_details';
    protected $primaryKey = 'sub_Id';
    public $incrementing = false;
    protected $keyType = 'string';
    const UPDATED_AT = null;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'category',
        'country',
        'email',
        'features',
        'time',
        'frequency',
        'company_name',
        'source_site',
        // Target location (content filter)
        'target_province',
        'target_city',
        // User's actual location (delivery settings)
        'user_country',
        'user_province',
        'user_city',
        'province',   // Legacy/Compatibility mapping
        'city',       // Legacy/Compatibility mapping
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'category' => 'json',
        'country' => 'json',
    ];
}
