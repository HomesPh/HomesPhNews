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
        Schema::table('articles', function (Blueprint $table) {
            if (! Schema::hasColumn('articles', 'slug')) {
                $table->string('slug')->nullable();
            } else {
                $table->string('slug')->nullable()->change();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            if (Schema::hasColumn('articles', 'slug')) {
                // If we created it, drop it. If we modified it, we can't easily revert without knowing previous state.
                // Assuming we want to drop it if we roll back this specific migration.
                // However, since it might have existed before, dropping it might be dangerous.
                // Safest is to do nothing or try to revert to not nullable if we knew that was the state.
                // Given the error "doesn't have default value", it was likely NOT NULL.
                // $table->string('slug')->nullable(false)->change(); // This might be the revert
            }
        });
    }
};
