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
            if (!Schema::hasColumn('subscription_details', 'plan')) {
                 $table->string('plan')->nullable()->after('email');
            }
            if (!Schema::hasColumn('subscription_details', 'logo')) {
                 $table->string('logo')->nullable()->after('plan');
            }
            if (!Schema::hasColumn('subscription_details', 'price')) {
                 $table->decimal('price', 10, 2)->default(0.00)->after('logo');
            }
            if (!Schema::hasColumn('subscription_details', 'status')) {
                 $table->string('status')->default('active')->after('price'); // active, cancelled, past_due
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('subscription_details', function (Blueprint $table) {
            $columnsToDrop = [];
            if (Schema::hasColumn('subscription_details', 'plan')) $columnsToDrop[] = 'plan';
            if (Schema::hasColumn('subscription_details', 'logo')) $columnsToDrop[] = 'logo';
            if (Schema::hasColumn('subscription_details', 'price')) $columnsToDrop[] = 'price';
            if (Schema::hasColumn('subscription_details', 'status')) $columnsToDrop[] = 'status';

            if (!empty($columnsToDrop)) {
                $table->dropColumn($columnsToDrop);
            }
        });
    }
};
