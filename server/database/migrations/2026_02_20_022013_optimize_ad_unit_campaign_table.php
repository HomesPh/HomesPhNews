<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('ad_unit_campaign', function (Blueprint $table) {
            if (DB::getDriverName() !== 'sqlite') {
                $table->dropColumn('id');
            }
            $table->unique(['ad_unit_id', 'campaign_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ad_unit_campaign', function (Blueprint $table) {
            if (!Schema::hasColumn('ad_unit_campaign', 'id')) {
                $table->id();
            }
            $table->dropUnique(['ad_unit_id', 'campaign_id']);
        });
    }
};
