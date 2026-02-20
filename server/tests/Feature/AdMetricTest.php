<?php

namespace Tests\Feature;

use App\Models\AdUnit;
use App\Models\Campaign;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class AdMetricTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_record_impression_metric()
    {
        $adUnit = AdUnit::factory()->create();
        $campaign = Campaign::factory()->create();

        $response = $this->postJson('/api/v1/ads/metrics', [
            'ad_unit_id' => $adUnit->id,
            'campaign_id' => $campaign->id,
            'type' => 'impression',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('ad_metrics', [
            'ad_unit_id' => $adUnit->id,
            'campaign_id' => $campaign->id,
            'type' => 'impression',
        ]);

        // Check increments
        $this->assertEquals(1, $adUnit->fresh()->impressions);
        $this->assertEquals(1, $campaign->fresh()->impressions);
    }

    public function test_can_record_click_metric()
    {
        $adUnit = AdUnit::factory()->create();
        $campaign = Campaign::factory()->create();

        $response = $this->postJson('/api/v1/ads/metrics', [
            'ad_unit_id' => $adUnit->id,
            'campaign_id' => $campaign->id,
            'type' => 'click',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('ad_metrics', [
            'ad_unit_id' => $adUnit->id,
            'campaign_id' => $campaign->id,
            'type' => 'click',
        ]);

        // Check increments
        $this->assertEquals(1, $adUnit->fresh()->clicks);
        $this->assertEquals(1, $campaign->fresh()->clicks);
    }

    public function test_can_retrieve_aggregated_metrics()
    {
        $user = User::factory()->create();
        $adminRole = \App\Models\Role::firstOrCreate(['name' => 'admin', 'slug' => 'admin']);
        $user->roles()->attach($adminRole->id);

        $adUnit = AdUnit::factory()->create();

        // Create metrics for today
        \App\Models\AdMetric::create([
            'ad_unit_id' => $adUnit->id,
            'type' => 'impression',
            'created_at' => now(),
        ]);
        \App\Models\AdMetric::create([
            'ad_unit_id' => $adUnit->id,
            'type' => 'click',
            'created_at' => now(),
        ]);

        // Create metrics for yesterday
        \App\Models\AdMetric::create([
            'ad_unit_id' => $adUnit->id,
            'type' => 'impression',
            'created_at' => now()->subDay(),
        ]);

        // Sanctioned actingAs
        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/admin/ad-metrics?period=daily');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'period',
            'from',
            'to',
            'data' => [
                '*' => ['date', 'impressions', 'clicks']
            ]
        ]);
        
        // Basic check that we get data back
        $data = $response->json('data');
        $this->assertGreaterThanOrEqual(2, count($data)); // Today and Yesterday
    }
}
