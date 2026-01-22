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
        
        $sites = \App\Models\Site::all();

        // Create 50 articles
        Article::factory()
            ->count(50)
            ->create()
            ->each(function ($article) use ($sites) {
                // Attach random 1-3 sites if sites exist
                if ($sites->isNotEmpty()) {
                    $article->publishedSites()->attach(
                        $sites->random(rand(1, 3))->pluck('id')
                    );
                }
            });
    }
}
