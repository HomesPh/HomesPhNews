<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'name',
        'email',
        'password',
        'google_id',
        'avatar',
        'roles',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'roles' => 'array',
        ];
    }

    /**
     * The roles that belong to the user.
     */
    public function roles()
    {
        return $this->belongsToMany(Role::class);
    }

    /**
     * Check if the user has a specific role.
     */
    public function hasRole(string $role): bool
    {
        // 1. Check relationship (pivot table)
        if ($this->roles()->where('name', $role)->exists()) {
            return true;
        }

        // 2. Check the JSON 'roles' column in the users table
        // Avoid using $this->roles as it conflicts with the relationship name
        $rawRoles = $this->getRawOriginal('roles');

        // Handle case where rawRoles might be already decoded or still a JSON string
        $jsonRoles = is_string($rawRoles) ? json_decode($rawRoles, true) : $rawRoles;

        if (is_array($jsonRoles) && in_array($role, $jsonRoles)) {
            return true;
        }

        return false;
    }

    /**
     * Check if the user has a specific permission.
     */
    public function hasPermission(string $permission): bool
    {
        // 1. Get role names from relationship (if loaded or via query)
        $relationRoles = $this->roles()->pluck('name')->toArray();

        // 2. Get role names from attribute (JSON column)
        $attributeRoles = $this->getRawOriginal('roles');
        $attributeRoles = is_string($attributeRoles) ? json_decode($attributeRoles, true) : $attributeRoles;
        if (! is_array($attributeRoles)) {
            $attributeRoles = [];
        }

        // Merge and unique
        $allRoleNames = array_unique(array_merge($relationRoles, $attributeRoles));

        if (empty($allRoleNames)) {
            return false;
        }

        // 3. Check permissions from Database Roles
        $dbRoles = Role::whereIn('name', $allRoleNames)->get();

        foreach ($dbRoles as $role) {
            $permissions = $role->permissions;

            if (empty($permissions)) {
                continue;
            }

            // If role has all permissions (stored as "*" or ["*"])
            if ($permissions === '*' || (is_array($permissions) && in_array('*', $permissions))) {
                return true;
            }

            // If role has specific permission
            if (is_array($permissions) && in_array($permission, $permissions)) {
                return true;
            }
        }


        // 4. Check permissions from config file (Fallback)
        foreach ($allRoleNames as $roleName) {
            $roleConfig = config('permissions.roles.' . $roleName);

            if (! $roleConfig) {
                continue;
            }

            // If role has all permissions
            if ($roleConfig['permissions'] === '*') {
                return true;
            }

            // If role has specific permission
            if (is_array($roleConfig['permissions']) && in_array($permission, $roleConfig['permissions'])) {
                return true;
            }
        }

        return false;
    }
}
