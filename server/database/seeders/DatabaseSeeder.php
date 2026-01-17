<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Schema::disableForeignKeyConstraints();


        // Clear the tables first to avoid duplicate data on re-seeding
        // Note: Use this only in development.
        \App\Models\News::truncate();
        \App\Models\Category::truncate();


        Schema::enableForeignKeyConstraints();

        // We call the CategorySeeder first to populate the categories table.
        $this->call([
            CategorySeeder::class,
        ]);

        // Now that we have categories, we can call the NewsSeeder
        // which will link news articles to those categories.
        $this->call([
            NewsSeeder::class,
        ]);
    }
}
