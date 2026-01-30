<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Add column as nullable first to allow existing rows
        Schema::table('sites', function (Blueprint $table) {
            $table->string('api_key', 64)->nullable()->after('site_url');
        });

        // 2. Generate API keys for existing sites
        $sites = DB::table('sites')->get();
        foreach ($sites as $site) {
            DB::table('sites')
                ->where('id', $site->id)
                ->update(['api_key' => Str::random(64)]);
        }

        // 3. Make column NOT NULL and UNIQUE now that all rows have data
        Schema::table('sites', function (Blueprint $table) {
            $table->string('api_key', 64)->nullable(false)->unique()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sites', function (Blueprint $table) {
            $table->dropColumn('api_key');
        });
    }
};
