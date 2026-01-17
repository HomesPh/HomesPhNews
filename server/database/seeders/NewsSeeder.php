<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\News;
use App\Models\Category;
class NewsSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Find the ID of the 'Global News' category.
        // We find the category by its unique slug and then get its 'id'.
        $globalNewsCategory = Category::where('slug', 'global-news')->first();

        // 2. Find IDs for other categories for variety.
        $otherCategoryIds = Category::where('slug', '!=', 'global-news')->pluck('id');

        // 3. Create 5 news articles and assign them specifically to 'Global News'.
        // We use a 'state' in the factory to override the category_id for these specific articles.
        if ($globalNewsCategory) {
            News::factory()
                ->count(5) // Create 5 global news articles
                ->create([
                    'category_id' => $globalNewsCategory->id,
                ]);
        }

        // 4. Create 20 other news articles and assign them to other categories.
        if ($otherCategoryIds->isNotEmpty()) {
            News::factory()
                ->count(20) // Create 20 other articles
                ->create([
                    'category_id' => function () use ($otherCategoryIds) {
                        return $otherCategoryIds->random();
                    },
                ]);
        }
    }
}

