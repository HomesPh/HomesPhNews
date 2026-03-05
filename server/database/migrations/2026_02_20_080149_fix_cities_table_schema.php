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
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Schema::dropIfExists('cities');
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        Schema::create('cities', function (Blueprint $table) {
            $table->id('city_id');
            $table->string('country_id', 10)->index();
            $table->string('name');
            $table->boolean('is_active')->default(true);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cities');
    }
};
