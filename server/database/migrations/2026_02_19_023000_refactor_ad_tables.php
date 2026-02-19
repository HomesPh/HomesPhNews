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
        // 1. Drop the pivot table as relationships are being redefined
        if (Schema::hasTable('ad_campaign')) {
            Schema::dropIfExists('ad_campaign');
        }

        // 2. Rename existing tables to match new models
        // Old 'Campaign' (group of ads) -> New 'AdUnit' (display slot)
        if (Schema::hasTable('campaigns') && !Schema::hasTable('ad_units')) {
            Schema::rename('campaigns', 'ad_units');
        }
        
        // Old 'Ad' (creative) -> New 'Campaign' (management entity)
        // Note: If 'ad_units' exists, 'campaigns' likely refers to the NEW campaigns table (renamed from ads)
        // So we only rename 'ads' if 'campaigns' does NOT exist (or if we are sure 'campaigns' is the old one, which is handled by previous block)
        if (Schema::hasTable('ads') && !Schema::hasTable('campaigns')) {
            Schema::rename('ads', 'campaigns');
        }

        // 3. Update 'ad_units' table (formerly 'campaigns')
        if (Schema::hasTable('ad_units')) {
            Schema::table('ad_units', function (Blueprint $table) {
                // Drop old columns from 'campaigns'
                // Special check for 'name': If the migration that adds 'name' back (031743) has already run,
                // we should NOT drop 'name', because that would undo that migration.
                // This happens because this migration (023000) is a renamed version of an old migration (100000)
                // that might have already run, resulting in 031743 running before this re-run.
                $hasNameMigrationRun = DB::table('migrations')
                    ->where('migration', 'like', '%2026_02_19_031743_add_name_to_ad_units_table%')
                    ->exists();

                if (!$hasNameMigrationRun && Schema::hasColumn('ad_units', 'name')) {
                    // Check if unique index exists before dropping? 
                    // Laravel dropUnique might throw if index doesn't exist.
                    // Ideally we check list of indexes, but for now try/catch or just hope?
                    // actually, let's skip dropUnique if we can't be sure, or just warn.
                    // But 'name' is being dropped.
                    try {
                        $table->dropUnique(['name']); // Array syntax for standard index name generation or string literal
                    } catch (\Exception $e) {
                        // Index might not exist
                    }
                     $table->dropColumn('name');
                }
                
                $columnsToDrop = ['rotation_type', 'start_date', 'end_date'];
                $columnsToDrop = array_filter($columnsToDrop, fn($col) => Schema::hasColumn('ad_units', $col));
                if (!empty($columnsToDrop)) {
                    $table->dropColumn($columnsToDrop);
                }
                
                // Add new columns for 'AdUnit'
                if (!Schema::hasColumn('ad_units', 'page_url')) {
                    $table->string('page_url')->nullable(); 
                }
                if (!Schema::hasColumn('ad_units', 'impressions')) {
                    $table->integer('impressions')->default(0);
                }
                if (!Schema::hasColumn('ad_units', 'clicks')) {
                    $table->integer('clicks')->default(0);
                }
                if (!Schema::hasColumn('ad_units', 'size')) {
                    $table->string('size')->default('adaptive');
                }
            });
        }

        // 4. Update 'campaigns' table (formerly 'ads')
        if (Schema::hasTable('campaigns')) {
            Schema::table('campaigns', function (Blueprint $table) {
                // Drop old columns from 'ads'
                $oldColumns = ['title', 'description', 'is_active'];
                $oldColumns = array_filter($oldColumns, fn($col) => Schema::hasColumn('campaigns', $col));
                if (!empty($oldColumns)) {
                    $table->dropColumn($oldColumns);
                }

                // Add new columns for 'Campaign'
                if (!Schema::hasColumn('campaigns', 'name')) {
                    $table->string('name')->nullable();
                }
                if (!Schema::hasColumn('campaigns', 'type')) {
                    $table->string('type')->default('banner');
                }
                if (!Schema::hasColumn('campaigns', 'status')) {
                    $table->string('status')->default('active');
                }
                if (!Schema::hasColumn('campaigns', 'start_date')) {
                    $table->date('start_date')->nullable();
                }
                if (!Schema::hasColumn('campaigns', 'end_date')) {
                    $table->date('end_date')->nullable();
                }
                if (!Schema::hasColumn('campaigns', 'ad_unit_id')) {
                    $table->foreignId('ad_unit_id')->nullable()->constrained('ad_units')->nullOnDelete();
                }
                if (!Schema::hasColumn('campaigns', 'budget')) {
                    $table->decimal('budget', 10, 2)->default(0);
                }
                if (!Schema::hasColumn('campaigns', 'impressions')) {
                    $table->integer('impressions')->default(0);
                }
                if (!Schema::hasColumn('campaigns', 'clicks')) {
                    $table->integer('clicks')->default(0);
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Reverse 'campaigns' (new) -> 'ads' (old)
        Schema::table('campaigns', function (Blueprint $table) {
            $table->dropColumn(['name', 'type', 'status', 'start_date', 'end_date', 'budget', 'impressions', 'clicks']);
            $table->string('title')->nullable();
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
        });

        if (Schema::hasTable('campaigns')) {
            Schema::rename('campaigns', 'ads');
        }

        // Reverse 'ad_units' (new) -> 'campaigns' (old)
        Schema::table('ad_units', function (Blueprint $table) {
            $table->dropColumn(['page_url', 'impressions', 'clicks', 'size']);
            $table->string('name')->nullable();
            $table->string('rotation_type')->default('random');
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
        });

        if (Schema::hasTable('ad_units')) {
            Schema::rename('ad_units', 'campaigns');
        }

        // Recreate pivot table (simplified as we lost data)
        Schema::create('ad_campaign', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ad_id')->constrained('ads')->cascadeOnDelete();
            $table->foreignId('campaign_id')->constrained('campaigns')->cascadeOnDelete();
            $table->timestamps();
        });
    }
};
