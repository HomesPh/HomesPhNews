<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\News>
 */
class NewsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // Use the built-in faker library to generate realistic data
            'title' => $this->faker->sentence(), // Generates a fake sentence for the title
            'content' => $this->faker->paragraphs(3, true), // Generates 3 paragraphs of text
            'summary' => $this->faker->paragraph(),
            'author' => $this->faker->name(), // Generates a fake name
            'views_count' => $this->faker->numberBetween(0, 5000), // Generates a random number of views
            'created_at' => $this->faker->dateTimeThisYear(), // A random date/time within the current year
            'updated_at' => now(),
        ];
    }
}
