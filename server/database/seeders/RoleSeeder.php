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
        // Define permissions
        $permissions = [
            // users
            'view_users',
            'create_users',
            'edit_users',
            'delete_users',

            // roles
            'view_roles',
            'create_roles',
            'edit_roles',
            'delete_roles',

            // articles
            'view_articles',
            'create_articles',
            'edit_articles',
            'delete_articles',
        ];

        // Create permissions
        foreach ($permissions as $permissionName) {
            \App\Models\Permission::firstOrCreate(['name' => $permissionName]);
        }

        // Create Roles
        $adminRole = Role::firstOrCreate(['name' => 'admin']);

        // Assign all permissions to admin role
        $allPermissions = \App\Models\Permission::all();
        $adminRole->permissions()->sync($allPermissions);

        // Assign admin role to existing admin users if any
        // Example: Assign 'admin' role to user with ID 1
        $user = User::find(1);
        if ($user) {
            $user->roles()->syncWithoutDetaching([$adminRole->id]);
        }
    }
}
