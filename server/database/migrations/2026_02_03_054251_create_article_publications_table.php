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
        Schema::create('article_publications', function (Blueprint $table) {
            $table->id();
            $table->string('article_id')->nullable(); // Redis ID or DB ID
            $table->string('title');
            $table->text('summary')->nullable();
            $table->string('image_url')->nullable();
            $table->string('category')->nullable();
            $table->string('country')->nullable();
            $table->string('source')->nullable();
            $table->dateTime('scheduled_at');
            $table->dateTime('published_at')->nullable();
            $table->enum('status', ['pending', 'published', 'failed'])->default('pending');
            $table->text('error_message')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('article_publications');
    }
};
