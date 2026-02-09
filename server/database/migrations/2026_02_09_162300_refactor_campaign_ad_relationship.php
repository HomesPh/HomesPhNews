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
        // 1. Create pivot table
        Schema::create('ad_campaign', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ad_id')->constrained()->cascadeOnDelete();
            $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
        });

        // 2. Remove campaign_id from ads table
        Schema::table('ads', function (Blueprint $table) {
            $table->dropForeign(['campaign_id']);
            $table->dropColumn('campaign_id');
        });

        // 3. Remove is_active from campaigns table
        Schema::table('campaigns', function (Blueprint $table) {
            $table->dropColumn('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // 1. Add is_active back to campaigns
        Schema::table('campaigns', function (Blueprint $table) {
            $table->boolean('is_active')->default(true);
        });

        // 2. Add campaign_id back to ads
        Schema::table('ads', function (Blueprint $table) {
            $table->foreignId('campaign_id')->nullable()->constrained('campaigns')->nullOnDelete();
        });

        // 3. Drop pivot table
        Schema::dropIfExists('ad_campaign');
    }
};
