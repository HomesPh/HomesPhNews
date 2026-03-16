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
        Schema::table('sites', function (Blueprint $table) {
            $table->renameColumn('site_logo', 'original_logo');
        });

        Schema::table('sites', function (Blueprint $table) {
            $table->string('dark_logo')->nullable()->after('original_logo');
            $table->string('light_logo')->nullable()->after('dark_logo');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sites', function (Blueprint $table) {
            $table->dropColumn(['dark_logo', 'light_logo']);
        });

        Schema::table('sites', function (Blueprint $table) {
            $table->renameColumn('original_logo', 'site_logo');
        });
    }
};
