<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

class RbacTest extends TestCase
{
    use RefreshDatabase;



    public function test_user_with_db_permission_can_access_route()
    {
        $this->withoutExceptionHandling();

        // Debug routes


        // Create role with permission in DB
        $role = Role::create([
            'name' => 'test_role',
            'permissions' => ['view_roles'],
        ]);

        // Create user and assign role
        $user = User::factory()->create();
        $user->roles()->attach($role);

        // Authenticate as user
        \Laravel\Sanctum\Sanctum::actingAs($user, ['*']);

        // Access route
        $response = $this->getJson('/api/v2/roles');

        $response->assertStatus(200);
    }

    public function test_user_without_permission_is_denied()
    {
        // Create role without permission
        $role = Role::create([
            'name' => 'test_role',
            'permissions' => ['other_permission'],
        ]);

        $user = User::factory()->create();
        $user->roles()->attach($role);

        $this->actingAs($user);

        $response = $this->getJson('/api/v2/roles');

        $response->assertStatus(403);
    }

    public function test_user_with_wildcard_permission_can_access()
    {
        // Create role with wildcard permission
        $role = Role::create([
            'name' => 'super_admin',
            'permissions' => ['*'],
        ]);

        $user = User::factory()->create();
        $user->roles()->attach($role);

        $this->actingAs($user);

        $response = $this->getJson('/api/v2/roles');

        $response->assertStatus(200);
    }

    public function test_fallback_to_config_works()
    {
        // Set config for a specific role
        config(['permissions.roles.config_role' => ['permissions' => ['view_roles']]]);

        // Create role in DB (without permissions)
        $role = Role::create([
            'name' => 'config_role',
            'permissions' => null,
        ]);

        $user = User::factory()->create();
        $user->roles()->attach($role);

        $this->actingAs($user);

        $response = $this->getJson('/api/v2/roles');

        $response->assertStatus(200);
    }
}
