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
        Schema::create('campaign_banners', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
            $table->string('image_url');
            $table->string('resolution')->nullable();
            $table->integer('width')->nullable();
            $table->integer('height')->nullable();
            $table->timestamps();
        });

        // Migrate existing banner URLs from the campaigns table to the new campaign_banners table
        // 1. Fetch all existing campaigns
        $campaigns = \Illuminate\Support\Facades\DB::table('campaigns')->get();

        foreach ($campaigns as $campaign) {
            // 2. Check if the campaign has any banner image URLs stored
            if (! empty($campaign->banner_image_urls)) {
                // 3. Decode the JSON string array of URLs into a PHP array
                $urls = json_decode($campaign->banner_image_urls, true);

                // 4. If decoding was successful and resulted in an array, process each URL
                if (is_array($urls)) {
                    foreach ($urls as $url) {
                        // 5. Insert a new record in the campaign_banners table for each individual URL
                        \Illuminate\Support\Facades\DB::table('campaign_banners')->insert([
                            'campaign_id' => $campaign->id,
                            'image_url' => $url,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }
                }
            }
        }

        Schema::table('campaigns', function (Blueprint $table) {
            $table->dropColumn('banner_image_urls');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('campaigns', function (Blueprint $table) {
            $table->json('banner_image_urls')->nullable();
        });

        // Restore banner_image_urls column in campaigns table from the campaign_banners table
        // 1. Fetch all records from the campaign_banners table
        $banners = \Illuminate\Support\Facades\DB::table('campaign_banners')->get();

        // 2. Group the banners by their campaign_id so we have collections of banners per campaign
        $grouped = $banners->groupBy('campaign_id');

        // 3. Iterate through the grouped banners
        foreach ($grouped as $campaignId => $campaignBanners) {
            // 4. Extract only the 'image_url' column from each banner record into a flat array
            $urls = $campaignBanners->pluck('image_url')->toArray();

            // 5. Update the campaigns table by encoding the array of URLs back into a JSON string
            \Illuminate\Support\Facades\DB::table('campaigns')->where('id', $campaignId)->update([
                'banner_image_urls' => json_encode($urls),
            ]);
        }

        Schema::dropIfExists('campaign_banners');
    }
};
