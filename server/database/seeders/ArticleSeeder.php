<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Article;
use App\Models\Category;
use App\Models\User;

class ArticleSeeder extends Seeder
{
    public function run(): void
    {
        // Ensure we have users to assign as authors
        $users = User::all();
        if ($users->isEmpty()) {
            $users = User::factory(5)->create();
        }
        
        // $categories = Category::all();

        // if ($categories->isEmpty()) {
        //    return; // Should run CategorySeeder first
        // }

        // Create 50 articles distributed across categories and countries (handled by Factory)
        Article::factory()
            ->count(50)
            // ->recycle($categories) // Randomly assign one of existing categories
            ->create();
    }
}
