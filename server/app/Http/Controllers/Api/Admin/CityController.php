<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\CityResource;
use App\Models\City;
use Illuminate\Http\Request;

class CityController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $cities = City::with('country')->get();
        return CityResource::collection($cities);
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

        $city = City::create($validated);

        return response()->json([
            'message' => 'City created successfully',
            'data' => new CityResource($city)
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $city = City::with('country')->findOrFail($id);
        return new CityResource($city);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $city = City::findOrFail($id);

        $validated = $request->validate([
            'country_id' => 'sometimes|required|string|exists:countries,id',
            'name' => 'sometimes|required|string|max:255',
            'is_active' => 'boolean',
        ]);

        $city->update($validated);

        return response()->json([
            'message' => 'City updated successfully',
            'data' => new CityResource($city)
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $city = City::findOrFail($id);
        $city->delete();

        return response()->json([
            'message' => 'City deleted successfully'
        ]);
    }
}
