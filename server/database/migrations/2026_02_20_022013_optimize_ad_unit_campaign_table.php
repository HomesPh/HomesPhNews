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
        Schema::table('ad_unit_campaign', function (Blueprint $table) {
            $table->dropColumn('id');
            $table->unique(['ad_unit_id', 'campaign_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ad_unit_campaign', function (Blueprint $table) {
            $table->id();
            $table->dropUnique(['ad_unit_id', 'campaign_id']);
        });
    }
};
