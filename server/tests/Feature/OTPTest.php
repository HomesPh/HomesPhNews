<?php

namespace Tests\Feature;

use App\Models\User;
use App\Services\OTPService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use App\Mail\OTPMail;
use Tests\TestCase;

class OTPTest extends TestCase
{
    use RefreshDatabase;

    protected $otpService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->otpService = app(OTPService::class);
    }

    public function test_send_otp_successfully()
    {
        Queue::fake();

        $user = User::factory()->create([
            'email' => 'test@example.com',
            'name' => 'Test User'
        ]);

        $response = $this->actingAs($user)->postJson('/api/v1/otp/send', [
            'email' => 'test@example.com'
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'message' => 'OTP sent successfully to your email'
            ]);

        $this->assertDatabaseHas('users', [
            'email' => 'test@example.com',
        ]);

        $user->refresh();
        $this->assertNotNull($user->otp);
        $this->assertNotNull($user->otp_expires_at);

        Queue::assertPushed(\App\Jobs\SendMailJob::class);
    }

    public function test_send_otp_user_not_found()
    {
        $user = User::factory()->create();
        
        $response = $this->actingAs($user)->postJson('/api/v1/otp/send', [
            'email' => 'nonexistent@example.com'
        ]);

        $response->assertStatus(422); // Validation fails because of 'exists:users,email' rule in SendOTPRequest
    }

    public function test_verify_otp_successfully()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'otp' => '123456',
            'otp_expires_at' => now()->addMinutes(10)
        ]);

        $response = $this->actingAs($user)->postJson('/api/v1/otp/verify', [
            'email' => 'test@example.com',
            'otp' => '123456'
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'message' => 'OTP verified successfully'
            ]);

        $user->refresh();
        $this->assertNull($user->otp);
        $this->assertNull($user->otp_expires_at);
        $this->assertNotNull($user->email_verified_at);
        $this->assertNotNull($user->otp_verified_at);
    }

    public function test_verify_otp_invalid_code()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'otp' => '123456',
            'otp_expires_at' => now()->addMinutes(10)
        ]);

        $response = $this->actingAs($user)->postJson('/api/v1/otp/verify', [
            'email' => 'test@example.com',
            'otp' => '654321'
        ]);

        $response->assertStatus(400)
            ->assertJson([
                'status' => 'error',
                'message' => 'Invalid or expired OTP'
            ]);
    }
}
