<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    /**
     * Run the migrations.
     * Cities table without FK to countries to avoid 1215 (type/collation/order).
     * Application can still use Country/City relationships; add FK later if DB matches.
     */
    public function up(): void
    {
        // Drop the FK on articles that references cities.city_id (MySQL 8 enforces type compat on CREATE)
        if (Schema::hasTable('articles')) {
            try {
                Schema::table('articles', function (Blueprint $table) {
                    $table->dropForeign('articles_ibfk_1');
                });
            } catch (\Throwable $e) {
                // FK may not exist — ignore
            }
        }

        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Schema::dropIfExists('cities');

        Schema::create('cities', function (Blueprint $table) {
            $table->unsignedInteger('city_id')->autoIncrement()->primary();
            $table->string('country_id', 10)->index();
            $table->string('name');
            $table->boolean('is_active')->default(true);
        });

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cities');
    }
};
