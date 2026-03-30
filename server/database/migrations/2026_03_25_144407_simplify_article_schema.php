<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Schema changes
        Schema::table('articles', function (Blueprint $table) {
            // Change image block to string, dropping any JSON constraint
            if (Schema::hasColumn('articles', 'image')) {
                $table->text('image')->nullable()->change();
            }
            // Drop redundant columns
            if (Schema::hasColumn('articles', 'template')) {
                $table->dropColumn('template');
            }
            if (Schema::hasColumn('articles', 'is_deleted')) {
                $table->dropColumn('is_deleted');
            }
        });

        // 2. Data migration: iterate over existing records and convert 'image' array/JSON to a simple string
        $articles = \Illuminate\Support\Facades\DB::table('articles')->whereNotNull('image')->get();
        foreach ($articles as $article) {
            $imageStr = $article->image;
            // if it starts with [ or { attempt decode
            if (str_starts_with($imageStr, '[') || str_starts_with($imageStr, '{')) {
                $imageJson = json_decode($imageStr, true);
                if (is_array($imageJson)) {
                    $newImage = count($imageJson) > 0 ? $imageJson[0] : null;
                    \Illuminate\Support\Facades\DB::table('articles')
                        ->where('id', $article->id)
                        ->update(['image' => $newImage]);
                }
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            if (!Schema::hasColumn('articles', 'template')) {
                $table->string('template')->nullable();
            }
            if (!Schema::hasColumn('articles', 'is_deleted')) {
                $table->boolean('is_deleted')->default(false);
            }
        });

        // Reverting data for `image` implies turning a string into an array
        $articles = \Illuminate\Support\Facades\DB::table('articles')->whereNotNull('image')->get();
        foreach ($articles as $article) {
            // Only format as json array if it doesn't already look like one
            if (!str_starts_with($article->image, '[')) {
                $newImage = json_encode([$article->image]);
                \Illuminate\Support\Facades\DB::table('articles')
                    ->where('id', $article->id)
                    ->update(['image' => $newImage]);
            }
        }
    }
};
