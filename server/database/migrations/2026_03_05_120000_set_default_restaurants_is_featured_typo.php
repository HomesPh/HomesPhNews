<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Set default for 'is _featured' typo column so INSERT without it no longer fails.
     */
    public function up(): void
    {
        if (!Schema::hasTable('restaurants')) {
            return;
        }

        $driver = Schema::getConnection()->getDriverName();
        if ($driver === 'mysql') {
            $cols = DB::select("SHOW COLUMNS FROM restaurants LIKE 'is _featured'");
            if (!empty($cols)) {
                DB::statement("ALTER TABLE restaurants MODIFY COLUMN `is _featured` TINYINT(1) DEFAULT 0 NULL");
            }
        }
    }

    public function down(): void
    {
        // no-op
    }
};
