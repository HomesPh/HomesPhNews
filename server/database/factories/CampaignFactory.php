<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\AdUnit;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Campaign>
 */
class CampaignFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->words(3, true),
            'type' => 'banner',
            'status' => 'active',
            'start_date' => now()->subDay(),
            'end_date' => now()->addMonth(),
            'budget' => $this->faker->randomFloat(2, 100, 1000),
            'impressions' => 0,
            'clicks' => 0,
            'image_url' => $this->faker->imageUrl(),
            'destination_url' => $this->faker->url(),
            'ad_unit_id' => AdUnit::factory(), // This links it to an AdUnit
        ];
    }
}
