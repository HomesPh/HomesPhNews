<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Restaurant extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'name',
        'country',
        'city',
        'cuisine_type',
        'description',
        'address',
        'latitude',
        'longitude',
        'google_maps_url',
        'is_filipino_owned',
        'brand_story',
        'owner_info',
        'specialty_dish',
        'menu_highlights',
        'food_topics',
        'price_range',
        'budget_category',
        'avg_meal_cost',
        'rating',
        'clickbait_hook',
        'why_filipinos_love_it',
        'contact_info',
        'website',
        'social_media',
        'opening_hours',
        'image_url',
        'original_url',
        'status',
        'timestamp',
        'tags',
        'features',
        'views_count',
    ];

    /**
     * Automatic JSON casting for array fields
     */
    protected $casts = [
        'is_filipino_owned' => 'boolean',
        'rating' => 'float',
        'timestamp' => 'integer',
        'tags' => 'array',
        'features' => 'array',
        'latitude' => 'float',
        'longitude' => 'float',
        'views_count' => 'integer',
    ];
}
