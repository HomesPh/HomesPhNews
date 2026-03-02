<?php

namespace App\Http\Resources\Restaurants;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RestaurantResource extends JsonResource
{
    public static $wrap = null;

    public function toArray(Request $request): array
    {
        $res = $this->resource;

        $tags = $res->tags ?? [];
        if (is_string($tags)) {
            $tags = json_decode($tags, true) ?? [];
        }

        $features = $res->features ?? [];
        if (is_string($features)) {
            $features = json_decode($features, true) ?? [];
        }

        return [
            'id'                  => (string)($res->id ?? ''),
            'name'                => (string)($res->name ?? ''),
            'country'             => (string)($res->country ?? ''),
            'city'                => (string)($res->city ?? ''),
            'cuisine_type'        => (string)($res->cuisine_type ?? ''),
            'description'         => (string)($res->description ?? ''),
            'address'             => (string)($res->address ?? ''),
            'latitude'            => $res->latitude,
            'longitude'           => $res->longitude,
            'google_maps_url'     => (string)($res->google_maps_url ?? ''),
            'is_filipino_owned'   => (bool)($res->is_filipino_owned ?? false),
            'brand_story'         => (string)($res->brand_story ?? ''),
            'owner_info'          => (string)($res->owner_info ?? ''),
            'specialty_dish'      => (string)($res->specialty_dish ?? ''),
            'menu_highlights'     => (string)($res->menu_highlights ?? ''),
            'food_topics'         => (string)($res->food_topics ?? ''),
            'price_range'         => (string)($res->price_range ?? ''),
            'budget_category'     => (string)($res->budget_category ?? ''),
            'avg_meal_cost'       => (string)($res->avg_meal_cost ?? ''),
            'rating'              => $res->rating,
            'clickbait_hook'      => (string)($res->clickbait_hook ?? ''),
            'why_filipinos_love_it' => (string)($res->why_filipinos_love_it ?? ''),
            'contact_info'        => (string)($res->contact_info ?? ''),
            'website'             => (string)($res->website ?? ''),
            'social_media'        => (string)($res->social_media ?? ''),
            'opening_hours'       => (string)($res->opening_hours ?? ''),
            'image_url'           => (string)($res->image_url ?? ''),
            'original_url'        => (string)($res->original_url ?? ''),
            'status'              => (string)($res->status ?? ''),
            'timestamp'           => (int)($res->timestamp ?? 0),
            'tags'                => is_array($tags) ? $tags : [],
            'features'            => is_array($features) ? $features : [],
            'is_featured'         => (bool)($res->is_featured ?? false),
            'views_count'         => (int)($res->views_count ?? 0),
            'created_at'          => (string)($res->created_at ?? ''),
        ];
    }
}
