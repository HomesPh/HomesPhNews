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
        Schema::create('mailing_list_groups', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('description')->nullable();
            $table->timestamps();
        });

        Schema::create('mailing_list_group_subscriber', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('group_id')->constrained('mailing_list_groups')->onDelete('cascade');
            $table->string('subscriber_id', 100)->collation('utf8mb4_zh_0900_as_cs'); 
            $table->foreign('subscriber_id')->references('sub_Id')->on('subscription_details')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mailing_list_group_subscriber');
        Schema::dropIfExists('mailing_list_groups');
    }
};
