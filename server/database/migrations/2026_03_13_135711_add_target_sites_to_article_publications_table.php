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
        Schema::table('article_publications', function (Blueprint $table) {
            $table->json('target_sites')->nullable()->after('article_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('article_publications', function (Blueprint $table) {
            $table->dropColumn('target_sites');
        });
    }
};
