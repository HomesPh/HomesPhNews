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
        // Create article_images table for gallery images (if not exists)
        if (!Schema::hasTable('article_images')) {
            Schema::create('article_images', function (Blueprint $table) {
                $table->id();
                $table->string('article_id', 36); // UUID from articles table
                $table->string('image_path'); // S3 URL or path
                $table->string('caption')->nullable();
                $table->integer('order')->default(0);
                $table->timestamps();

                $table->foreign('article_id')
                      ->references('id')
                      ->on('articles')
                      ->onDelete('cascade');
                
                $table->index('article_id');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('article_images');
    }
};
