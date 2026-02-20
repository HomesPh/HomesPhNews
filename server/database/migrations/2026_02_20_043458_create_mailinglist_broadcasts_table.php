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
        Schema::create('mailinglist_broadcasts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->json('article_ids');
            $table->integer('recipient_count');
            $table->string('status')->default('completed');
            $table->string('type')->default('manual');
            $table->timestamp('sent_at')->useCurrent();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mailinglist_broadcasts');
    }
};
