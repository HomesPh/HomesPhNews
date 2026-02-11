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
            if (!Schema::hasColumn('subscription_details', 'company_name')) {
                 $table->string('company_name')->nullable()->after('email');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('subscription_details', function (Blueprint $table) {
            if (Schema::hasColumn('subscription_details', 'company_name')) {
                $table->dropColumn('company_name');
            }
        });
    }
};
