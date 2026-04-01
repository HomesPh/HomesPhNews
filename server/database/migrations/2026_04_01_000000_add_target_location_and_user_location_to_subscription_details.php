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
        Schema::table('subscription_details', function (Blueprint $table) {
            // News interests — target location for content filtering
            if (!Schema::hasColumn('subscription_details', 'target_province')) {
                $table->string('target_province')->nullable()->after('country');
            }
            if (!Schema::hasColumn('subscription_details', 'target_city')) {
                $table->string('target_city')->nullable()->after('target_province');
            }
            // Delivery settings — subscriber's actual location
            if (!Schema::hasColumn('subscription_details', 'user_country')) {
                $table->string('user_country')->nullable()->after('target_city');
            }
            if (!Schema::hasColumn('subscription_details', 'user_province')) {
                $table->string('user_province')->nullable()->after('user_country');
            }
            if (!Schema::hasColumn('subscription_details', 'user_city')) {
                $table->string('user_city')->nullable()->after('user_province');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('subscription_details', function (Blueprint $table) {
            $table->dropColumn([
                'target_province',
                'target_city',
                'user_country',
                'user_province',
                'user_city',
            ]);
        });
    }
};
