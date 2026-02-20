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
        Schema::table('ad_units', function (Blueprint $table) {
            $table->string('type')->default('image')->after('name'); // image or text
        });

        Schema::table('campaigns', function (Blueprint $table) {
            $table->dropColumn('type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('campaigns', function (Blueprint $table) {
            $table->string('type')->default('image'); // Restore column
        });

        Schema::table('ad_units', function (Blueprint $table) {
            $table->dropColumn('type');
        });
    }
};
