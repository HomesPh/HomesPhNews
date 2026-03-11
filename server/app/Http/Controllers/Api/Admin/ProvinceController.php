<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProvinceResource;
use App\Models\Province;
use Illuminate\Http\Request;

class ProvinceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Province::with('country');
        
        if ($request->has('country_id')) {
            $query->where('country_id', $request->country_id);
        }
        
        $provinces = $query->get();
        return ProvinceResource::collection($provinces);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'country_id' => 'required|string|exists:countries,id',
            'name' => 'required|string|max:255',
            'is_active' => 'boolean',
        ]);

        $province = Province::create($validated);

        return response()->json([
            'message' => 'Province created successfully',
            'data' => new ProvinceResource($province)
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $province = Province::with('country')->findOrFail($id);
        return new ProvinceResource($province);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $province = Province::findOrFail($id);

        $validated = $request->validate([
            'country_id' => 'sometimes|required|string|exists:countries,id',
            'name' => 'sometimes|required|string|max:255',
            'is_active' => 'boolean',
        ]);

        $province->update($validated);

        return response()->json([
            'message' => 'Province updated successfully',
            'data' => new ProvinceResource($province)
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $province = Province::findOrFail($id);
        $province->delete();

        return response()->json([
            'message' => 'Province deleted successfully'
        ]);
    }
}
