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
            if (!Schema::hasColumn('subscription_details', 'phone_no')) {
                $table->string('phone_no')->nullable()->after('email');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('subscription_details', function (Blueprint $table) {
            if (Schema::hasColumn('subscription_details', 'phone_no')) {
                $table->dropColumn('phone_no');
            }
        });
    }
};
