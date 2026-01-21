<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
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
        User::firstOrCreate(
            ['email' => 'admin@globalnews.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('admin123'),
                'is_admin' => true,
                'email_verified_at' => now(),
            ]
        );

        // Create 10 Regular Users
        User::factory(10)->create([
            'is_admin' => false,
        ]);
    }
}
