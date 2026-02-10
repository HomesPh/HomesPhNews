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
        'company_name',
        'features',
        'time',
        'plan',
        'logo',
        'price',
        'status',
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
