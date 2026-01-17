<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Use DB::table()->insert() to add multiple records at once.
        DB::table('categories')->insert([
            [
                'name' => 'Global News',
                'slug' => 'global-news',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Technology',
                'slug' => 'technology',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Local Sports',
                'slug' => 'local-sports',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
