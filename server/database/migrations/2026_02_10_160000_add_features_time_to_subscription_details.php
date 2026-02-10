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
                if (!Schema::hasColumn('subscription_details', 'features')) {
                    $table->string('features')->nullable();
                }
                if (!Schema::hasColumn('subscription_details', 'time')) {
                    $table->string('time')->nullable();
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
                $columnsToDrop = [];
                if (Schema::hasColumn('subscription_details', 'features')) {
                    $columnsToDrop[] = 'features';
                }
                if (Schema::hasColumn('subscription_details', 'time')) {
                    $columnsToDrop[] = 'time';
                }
                
                if (!empty($columnsToDrop)) {
                    $table->dropColumn($columnsToDrop);
                }
            });
        }
    }
};
