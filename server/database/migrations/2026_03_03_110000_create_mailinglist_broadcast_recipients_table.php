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
        Schema::create('mailinglist_broadcast_recipients', function (Blueprint $table) {
            $table->id();
            $table->uuid('broadcast_id')->index();
            $table->string('email');
            $table->string('status')->default('sent');
            $table->timestamps();

            // Index for faster lookups when viewing a specific broadcast
            $table->foreign('broadcast_id')->references('id')->on('mailinglist_broadcasts')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mailinglist_broadcast_recipients');
    }
};
