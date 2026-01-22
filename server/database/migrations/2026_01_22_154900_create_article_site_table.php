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
        Schema::create('article_site', function (Blueprint $table) {
            $table->id();
            $table->string('article_id', 36);
            $table->foreignId('site_id')->constrained()->onDelete('cascade');
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('article_id')->references('id')->on('articles')->onDelete('cascade');
            $table->unique(['article_id', 'site_id']);
            $table->index('site_id'); // Optimization for filtering by site
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('article_site');
    }
};
