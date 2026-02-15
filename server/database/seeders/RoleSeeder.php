<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\User;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $userRole = Role::firstOrCreate(['name' => 'user']);

        // Assign admin role to existing admin users if any
        // Assuming there is an is_admin column or similar based on previous context
        // But for now, just creating the roles is enough, or potentially assigning to the first user.
        
        // Example: Assign 'admin' role to user with ID 1
        $user = User::find(1);
        if ($user) {
            $user->roles()->syncWithoutDetaching([$adminRole->id]);
        }
    }
}
