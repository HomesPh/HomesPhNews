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
        // 1. Update existing records
        // Update 'pending review' to 'pending'
        \Illuminate\Support\Facades\DB::table('articles')->where('status', 'pending review')->update(['status' => 'pending']);
        
        // Update 'rejected' to 'deleted'
        \Illuminate\Support\Facades\DB::table('articles')->where('status', 'rejected')->update(['status' => 'deleted']);
        
        // Force any record with is_deleted = true to have the status 'deleted'
        \Illuminate\Support\Facades\DB::table('articles')->where('is_deleted', true)->update(['status' => 'deleted']);

        // 2. Modify Column Default to 'pending' instead of 'published'
        Schema::table('articles', function (Blueprint $table) {
            $table->string('status')->default('pending')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // 1. Revert Column Default to 'published'
        Schema::table('articles', function (Blueprint $table) {
            $table->string('status')->default('published')->change();
        });

        // 2. Revert records (Best effort)
        \Illuminate\Support\Facades\DB::table('articles')->where('status', 'pending')->update(['status' => 'pending review']);
    }
};
