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
        if (Schema::hasTable('subscription_details')) {
            Schema::table('subscription_details', function (Blueprint $table) {
                if (!Schema::hasColumn('subscription_details', 'source_site')) {
                    $table->string('source_site')->nullable()->after('company_name');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('subscription_details')) {
            Schema::table('subscription_details', function (Blueprint $table) {
                if (Schema::hasColumn('subscription_details', 'source_site')) {
                    $table->dropColumn('source_site');
                }
            });
        }
    }
};
