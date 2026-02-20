<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;


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
            'status' => 'active',
            'start_date' => now()->subDay(),
            'end_date' => now()->addMonth(),
            'impressions' => 0,
            'clicks' => 0,
            'image_url' => $this->faker->imageUrl(),
            'target_url' => $this->faker->url(),
            'headline' => $this->faker->sentence(),
            // 'banner_image_urls' => [], // Optional
        ];
    }
}
