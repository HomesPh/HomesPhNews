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
            $table->string('title');
            $table->text('summary');
            $table->longText('content')->nullable(); // Changed to longText for article body
            $table->string('image')->nullable();
            
            // Replaces 'category' string column with actual relation if desired, 
            // but sticking to user request to add categories to table, likely via foreign key.
            // However, previous code also had a string 'category' and a foreign key. 
            // I will use foreign key as primary categorization.
            // $table->foreignId('category_id')->constrained()->onDelete('cascade'); // REMOVED
            $table->string('category')->nullable(); // RE-ADDED as string
            
            // New Fields
            $table->string('country')->nullable(); // canada, ph, usa, etc.
            
            // Existing fields from previous migrations
            // $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade'); // REMOVED
            $table->string('status')->default('published');
            $table->unsignedBigInteger('views_count')->default(0);
            $table->string('tags')->nullable();
            
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
