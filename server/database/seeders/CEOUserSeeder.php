<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class CEOUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Ensure CEO role exists
        $ceoRole = Role::firstOrCreate(['name' => 'ceo']);

        // 2. Create the CEO user
        $ceo = User::updateOrCreate(
            ['email' => 'mindworth@gmail.com'],
            [
                'first_name' => 'Mind',
                'last_name' => 'Worth',
                'name' => 'Owner / CEO',
                'password' => Hash::make('mindworth'),
                'email_verified_at' => now(),
            ]
        );

        // 3. Attach the role if not already attached
        if (!$ceo->hasRole('ceo')) {
            $ceo->roles()->syncWithoutDetaching([$ceoRole->id]);
        }
    }
}
