<?php

namespace App\Http\Controllers\v2;

use App\Http\Controllers\Controller;
use App\Models\Role;
use Illuminate\Http\Request;

class RoleController extends Controller
{   
    /**
     * (v2) Display a listing of the resource.
     */
    public function index()
    {
        $roles = Role::with('permissions')->paginate(10);
        return response()->json($roles);
    }

    /**
     * (v2) Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:roles,name|max:255',
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,name',
        ]);

        $role = new Role();
        $role->name = $validated['name'];
        $role->save();

        if (isset($validated['permissions'])) {
            $permissions = \App\Models\Permission::whereIn('name', $validated['permissions'])->pluck('id');
            $role->permissions()->sync($permissions);
        }

        return response()->json($role->load('permissions'), 201);
    }

    /**
     * (v2) Display the specified resource.
     */
    public function show(string $id)
    {
        $role = Role::with('permissions')->findOrFail($id);
        return response()->json($role);
    }

    /**
     * (v2) Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $role = Role::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name,' . $role->id,
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,name',
        ]);

        $role->name = $validated['name'];
        $role->save();

        if (isset($validated['permissions'])) {
            $permissions = \App\Models\Permission::whereIn('name', $validated['permissions'])->pluck('id');
            $role->permissions()->sync($permissions);
        }

        return response()->json($role->load('permissions'));
    }

    /**
     * (v2) Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $role = Role::findOrFail($id);
        $role->delete();

        return response()->json(null, 204);
    }
}
