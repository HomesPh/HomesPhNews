<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // create roles from config
        foreach (array_keys(config('permissions.roles')) as $roleName) {
            Role::firstOrCreate(['name' => $roleName]);
        }

        $adminRole = Role::where('name', 'admin')->first();
        if ($adminRole) {
            $user = User::find(1);
            if ($user) {
                $user->roles()->syncWithoutDetaching([$adminRole->id]);
            }
        }
    }
}
