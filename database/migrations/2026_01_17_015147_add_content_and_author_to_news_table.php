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
        Schema::table('news', function (Blueprint $table) {
            // Add the new columns. Using after() keeps the table organized.
            $table->text('content')->after('title');
            $table->string('author')->after('content');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('news', function (Blueprint $table) {
            // Define how to reverse the change (by dropping the columns)
            $table->dropColumn('content');
            $table->dropColumn('author');
        });
    }
};
