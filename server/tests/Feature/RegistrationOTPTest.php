<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use App\Jobs\SendMailJob;
use Tests\TestCase;

class RegistrationOTPTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Ensure subscriber role exists
        Role::create(['name' => 'subscriber']);
    }

    public function test_registration_automatically_sends_otp()
    {
        Queue::fake();

        $registrationData = [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
        ];

        $response = $this->postJson('/api/v1/auth/register', $registrationData);

        $response->assertStatus(201);

        $this->assertDatabaseHas('users', [
            'email' => 'john@example.com',
        ]);

        $user = User::where('email', 'john@example.com')->first();
        $this->assertNotNull($user->otp);
        $this->assertNotNull($user->otp_expires_at);

        Queue::assertPushed(SendMailJob::class);
    }
}
