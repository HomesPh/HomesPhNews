<?php

namespace Database\Factories;

use App\Models\Article;
use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ArticleFactory extends Factory
{
    protected $model = Article::class;

    public function definition(): array
    {
        $countries = ['Canada', 'PH', 'USA', 'Dubai', 'Singapore', 'Europe'];
        $categories = ['Real Estate', 'Business', 'Politics', 'Technology', 'Economy', 'Tourism'];

        return [
            'id' => $articleId = $this->faker->uuid(),
            'article_id' => $articleId,
            'title' => $this->faker->sentence(),
            'summary' => $this->faker->paragraph(),
            'content' => $this->faker->paragraphs(3, true),
            'image' => $this->faker->imageUrl(),
            'status' => 'published',
            'views_count' => $this->faker->numberBetween(0, 1000),
            'country' => $this->faker->randomElement($countries),
            'category' => $this->faker->randomElement($categories), // ADDED string
            'published_sites' => [$this->faker->randomElement(['Main News Portal', 'FilipinoHomes', 'Rent.ph', 'Homes', 'Bayanihan'])],
            // 'category_id' => Category::inRandomOrder()->first()->id ?? 1, // REMOVED
            // 'user_id' => User::inRandomOrder()->first()->id ?? User::factory(), // REMOVED
            'created_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'updated_at' => now(),
        ];
    }
}
