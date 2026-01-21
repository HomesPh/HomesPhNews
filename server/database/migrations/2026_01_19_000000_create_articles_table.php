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
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->uuid('article_id')->unique()->nullable(); // Matches Python UUID
            $table->string('title');
            $table->string('original_title')->nullable();
            $table->text('summary')->nullable();
            $table->longText('content')->nullable();
            $table->string('image')->nullable();
            
            $table->string('category')->nullable();
            $table->string('country')->nullable();
            $table->string('source')->nullable();
            $table->string('original_url', 1000)->nullable();
            
            $table->json('keywords')->nullable(); // AI Keywords as JSON
            $table->string('status')->default('published');
            $table->unsignedBigInteger('views_count')->default(0);
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
