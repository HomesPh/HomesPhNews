<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('restaurants', function (Blueprint $row) {
            $row->string('id')->primary(); // UUID from Redis
            $row->string('name');
            $row->string('country')->nullable();
            $row->string('city')->nullable();
            $row->string('cuisine_type')->nullable();
            $row->text('description')->nullable();
            
            // Location & Maps
            $row->string('address')->nullable();
            $row->decimal('latitude', 10, 8)->nullable();
            $row->decimal('longitude', 11, 8)->nullable();
            $row->text('google_maps_url')->nullable();
            
            // Business Info
            $row->boolean('is_filipino_owned')->default(false);
            $row->text('brand_story')->nullable();
            $row->text('owner_info')->nullable();
            
            // Food & Menu
            $row->string('specialty_dish')->nullable();
            $row->text('menu_highlights')->nullable();
            $row->string('food_topics')->nullable();
            
            // Pricing & Budget
            $row->string('price_range')->nullable();
            $row->string('budget_category')->nullable();
            $row->string('avg_meal_cost')->nullable();
            
            // Engagement
            $row->decimal('rating', 3, 2)->default(0);
            $row->string('clickbait_hook')->nullable();
            $row->text('why_filipinos_love_it')->nullable();
            
            // Contact
            $row->string('contact_info')->nullable();
            $row->string('website')->nullable();
            $row->string('social_media')->nullable();
            $row->text('opening_hours')->nullable();
            
            // Meta
            $row->text('image_url')->nullable();
            $row->text('original_url')->nullable();
            $row->string('status')->default('draft');
            $row->bigInteger('timestamp')->nullable();
            
            // New standardized fields
            $row->json('tags')->nullable();
            $row->json('features')->nullable();
            
            $row->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('restaurants');
    }
};
