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
        Schema::table('campaigns', function (Blueprint $table) {
            // Rename destination_url to target_url
            if (Schema::hasColumn('campaigns', 'destination_url')) {
                $table->renameColumn('destination_url', 'target_url');
            }
            
            // Add headline
            if (!Schema::hasColumn('campaigns', 'headline')) {
                $table->string('headline')->nullable()->after('target_url');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('campaigns', function (Blueprint $table) {
            // Reverse rename
            if (Schema::hasColumn('campaigns', 'target_url')) {
                $table->renameColumn('target_url', 'destination_url');
            }

            // Drop headline
            if (Schema::hasColumn('campaigns', 'headline')) {
                $table->dropColumn('headline');
            }
        });
    }
};
