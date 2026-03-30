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
        Schema::table('articles', function (Blueprint $table) {
            $table->dropForeign(['site_id']);
            $table->dropColumn([
                'is_featured',
                'is_live',
                'published_date',
                'site_id',
                'user_id',
                'citations'
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->boolean('is_featured')->default(0);
            $table->boolean('is_live')->default(0);
            $table->timestamp('published_date')->nullable();
            $table->unsignedBigInteger('site_id')->nullable();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->json('citations')->nullable();
        });
    }
};
