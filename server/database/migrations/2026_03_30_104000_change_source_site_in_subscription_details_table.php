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
        if (Schema::hasTable('subscription_details')) {
            // 1. Data Cleaning: Convert existing string values to IDs or NULL
            $mainSite = DB::table('sites')->where('site_name', 'Main News Portal')->first();
            $rentSite = DB::table('sites')->where('site_name', 'Rent.ph')->first();
            $fhSite = DB::table('sites')->where('site_name', 'FilipinoHomes')->first();

            // Set default if not a valid ID
            DB::table('subscription_details')
                ->whereNotNull('source_site')
                ->get()
                ->each(function ($sub) use ($mainSite, $rentSite, $fhSite) {
                    $newVal = null;
                    $current = strtolower($sub->source_site);

                    if (is_numeric($current)) {
                        return; // Already an ID
                    }

                    if (str_contains($current, 'main')) {
                        $newVal = optional($mainSite)->id;
                    } elseif (str_contains($current, 'rent')) {
                        $newVal = optional($rentSite)->id;
                    } elseif (str_contains($current, 'filipino')) {
                        $newVal = optional($fhSite)->id;
                    } else {
                        // Default to main site if we can't determine it
                        $newVal = optional($mainSite)->id;
                    }

                    DB::table('subscription_details')
                        ->where('sub_Id', $sub->sub_Id)
                        ->update(['source_site' => $newVal]);
                });

            // 2. Change column type
            Schema::table('subscription_details', function (Blueprint $table) {
                // Change source_site to unsignedBigInteger to store Site PK
                $table->unsignedBigInteger('source_site')->nullable()->change();

                // Add foreign key
                if (Schema::hasTable('sites')) {
                    $table->foreign('source_site')
                          ->references('id')
                          ->on('sites')
                          ->onDelete('set null');
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
                if (Schema::hasTable('sites')) {
                    $table->dropForeign(['source_site']);
                }
                
                $table->string('source_site')->nullable()->change();
            });
        }
    }
};
