<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class CampaignValidationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Create an admin user for authentication if needed, 
        // assuming the controller is protected. 
        // If not, we can skip this. 
        // Based on file path `Api/Admin/CampaignController`, it likely requires admin.
        $this->actingAs(User::factory()->create(['roles' => ['admin']]));
    }

    /** @test */
    public function it_can_create_campaign_with_only_banner_image_urls()
    {
        $data = [
            'name' => 'Banner Only Campaign',
            'status' => 'active',
            'target_url' => 'https://example.com',
            'start_date' => now()->format('Y-m-d'),
            // No image_url, No headline
            'banner_image_urls' => [
                'https://example.com/banner1.jpg',
                'https://example.com/banner2.jpg',
            ],
        ];

        $response = $this->postJson('/api/v1/admin/campaigns', $data);

        $response->assertStatus(201);
        $this->assertDatabaseHas('campaigns', [
            'name' => 'Banner Only Campaign',
        ]);
    }

    /** @test */
    public function it_requires_at_least_one_creative_field()
    {
        $data = [
            'name' => 'Invalid Campaign',
            'status' => 'active',
            'target_url' => 'https://example.com',
            'start_date' => now()->format('Y-m-d'),
            // Missing all creative fields
        ];

        $response = $this->postJson('/api/v1/admin/campaigns', $data);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['image_url', 'headline', 'banner_image_urls']);
    }

    /** @test */
    public function it_validates_banner_image_urls_are_urls()
    {
        $data = [
            'name' => 'Invalid Banner Campaign',
            'status' => 'active',
            'target_url' => 'https://example.com',
            'banner_image_urls' => [
                'not-a-url',
            ],
        ];

        $response = $this->postJson('/api/v1/admin/campaigns', $data);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['banner_image_urls.0']);
    }

    /** @test */
    public function it_can_create_campaign_with_headline_only()
    {
        $data = [
            'name' => 'Headline Only Campaign',
            'status' => 'active',
            'target_url' => 'https://example.com',
            'headline' => 'Great Offer',
        ];

        $response = $this->postJson('/api/v1/admin/campaigns', $data);

        $response->assertStatus(201);
    }
    
    /** @test */
    public function it_can_create_campaign_with_image_url_only()
    {
        $data = [
            'name' => 'Image Only Campaign',
            'status' => 'active',
            'target_url' => 'https://example.com',
            'image_url' => 'https://example.com/image.jpg',
        ];

        $response = $this->postJson('/api/v1/admin/campaigns', $data);

        $response->assertStatus(201);
    }
}
