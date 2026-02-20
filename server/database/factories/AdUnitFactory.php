<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AdUnit>
 */
class AdUnitFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'page_url' => $this->faker->url(),
            'impressions' => 0,
            'clicks' => 0,
            'size' => 'adaptive',
        ];
    }
}
