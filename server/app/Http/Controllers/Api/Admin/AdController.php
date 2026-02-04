<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Ad;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $ads = Ad::with('campaign')
            ->latest()
            ->paginate($request->input('per_page', 10));

        return response()->json($ads);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'image_url' => 'required|url',
            'destination_url' => 'required|url',
            'is_active' => 'boolean',
            'campaign_id' => 'nullable|exists:campaigns,id',
        ]);

        $ad = Ad::create($validated);

        return response()->json($ad, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $ad = Ad::with('campaign')->findOrFail($id);

        return response()->json($ad);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $ad = Ad::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'image_url' => 'sometimes|url',
            'destination_url' => 'sometimes|url',
            'is_active' => 'boolean',
            'campaign_id' => 'nullable|exists:campaigns,id',
        ]);

        $ad->update($validated);

        return response()->json($ad);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $ad = Ad::findOrFail($id);
        $ad->delete();

        return response()->json(null, 204);
    }
}
