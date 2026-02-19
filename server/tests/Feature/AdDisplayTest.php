<?php

namespace Tests\Feature;

use App\Models\AdUnit;
use App\Models\Campaign;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class AdDisplayTest extends TestCase
{
    use RefreshDatabase;

    public function test_ad_unit_display_active_campaign()
    {
        // specific id is needed because campaign_id on Campaign table is foreign key to AdUnit
        $adUnit = AdUnit::factory()->create();
        
        $campaign = Campaign::factory()->create([
            'ad_unit_id' => $adUnit->id,
            'status' => 'active',
            'start_date' => now()->subDay(),
            'end_date' => now()->addDay(),
            'image_url' => 'https://example.com/image.jpg',
            'destination_url' => 'https://example.com',
        ]);

        $response = $this->get(route('ads.show', $adUnit->id));

        $response->assertStatus(200);
        $response->assertViewHas('campaign');
        $this->assertEquals($campaign->id, $response->viewData('campaign')->id);
        
        // Assert impressions incremented
        $this->assertEquals(1, $adUnit->fresh()->impressions);
        $this->assertEquals(1, $campaign->fresh()->impressions);
    }

    public function test_ad_unit_display_no_active_campaign()
    {
        $adUnit = AdUnit::factory()->create();

        // Paused campaign
        Campaign::factory()->create([
            'ad_unit_id' => $adUnit->id,
            'status' => 'paused',
        ]);

        $response = $this->get(route('ads.show', $adUnit->id));

        $response->assertStatus(200);
        $response->assertViewHas('campaign', null);
        
        // Assert impressions NOT incremented
        $this->assertEquals(0, $adUnit->fresh()->impressions);
    }

    public function test_ad_unit_not_found()
    {
        $response = $this->get(route('ads.show', 999));

        $response->assertStatus(404);
    }
}
