<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Country;
use Illuminate\Http\Request;

class CountryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $countries = Country::all();
        return response()->json($countries);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|string|max:50|unique:countries,id',
            'name' => 'required|string|max:255',
            'gl' => 'nullable|string|max:50',
            'h1' => 'nullable|string|max:50',
            'ceid' => 'nullable|string|max:50',
            'is_active' => 'boolean',
        ]);

        $country = Country::create($validated);

        return response()->json([
            'message' => 'Country created successfully',
            'data' => $country
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $country = Country::findOrFail($id);
        return response()->json($country);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $country = Country::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'gl' => 'nullable|string|max:50',
            'h1' => 'nullable|string|max:50',
            'ceid' => 'nullable|string|max:50',
            'is_active' => 'boolean',
        ]);

        $country->update($validated);

        return response()->json([
            'message' => 'Country updated successfully',
            'data' => $country
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $country = Country::findOrFail($id);
        $country->delete();

        return response()->json([
            'message' => 'Country deleted successfully'
        ]);
    }
}
