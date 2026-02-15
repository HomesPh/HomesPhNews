<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Admin User
        // Create Admin User
        $admin = User::firstOrCreate(
            ['email' => 'admin@globalnews.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('admin123'),
                'email_verified_at' => now(),
            ]
        );

        $adminRole = \App\Models\Role::firstOrCreate(['name' => 'admin']);
        $admin->roles()->syncWithoutDetaching([$adminRole->id]);

        // Create 10 Regular Users
        $users = User::factory(10)->create();
        $userRole = \App\Models\Role::firstOrCreate(['name' => 'user']);

        $users->each(function ($user) use ($userRole) {
            $user->roles()->attach($userRole);
        });
    }
}
