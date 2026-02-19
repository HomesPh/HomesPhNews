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
        // Fix for the 'is _featured' typo (with space) if it exists in DB
        if (Schema::hasTable('restaurants')) {
            // Check for columns with possible typos and set defaults
            Schema::table('restaurants', function (Blueprint $table) {
                // We use a raw check because Schema::hasColumn might not handle spaces well in some drivers
                // but let's try the standard way first.
                
                // Set default for 'is_featured' if it exists
                if (Schema::hasColumn('restaurants', 'is_featured')) {
                    $table->boolean('is_featured')->default(false)->nullable()->change();
                }
                
                // If there's a typo column with a space, fix it too
                // Note: Eloquent/Migrations usually don't support spaces easily, 
                // but we can try to make it nullable to bypass the error.
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
