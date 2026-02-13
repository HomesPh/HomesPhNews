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
        if (!is_array($attributeRoles)) {
            $attributeRoles = [];
        }

        // Merge and unique
        $allRoleNames = array_unique(array_merge($relationRoles, $attributeRoles));

        if (empty($allRoleNames)) {
            return false;
        }

        // 3. Check if any of these roles have the permission
        // We use the Role model to check permissions on the roles we found
        return Role::whereIn('name', $allRoleNames)
            ->whereHas('permissions', function($query) use ($permission) {
                $query->where('name', $permission);
            })->exists();
    }
}
