<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Adds a JSON column to store which sites an article is published to.
     * Example: ["FilipinoHomes", "Rent.ph", "Homes"]
     */
    public function up(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->json('published_sites')->nullable()->after('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->dropColumn('published_sites');
        });
    }
};
