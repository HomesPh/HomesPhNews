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
        $ads = Ad::with('campaigns')
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
            'description' => 'nullable|string',
            'image_url' => 'required|url',
            'destination_url' => 'required|url',
            'is_active' => 'boolean',
            'campaign_ids' => 'nullable|array',
            'campaign_ids.*' => 'exists:campaigns,id',
        ]);

        $ad = Ad::create($validated);

        if (!empty($validated['campaign_ids'])) {
            $ad->campaigns()->sync($validated['campaign_ids']);
        }

        return response()->json($ad->load('campaigns'), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $ad = Ad::with('campaigns')->findOrFail($id);

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
            'description' => 'nullable|string',
            'image_url' => 'sometimes|url',
            'destination_url' => 'sometimes|url',
            'is_active' => 'boolean',
            'campaign_ids' => 'nullable|array',
            'campaign_ids.*' => 'exists:campaigns,id',
        ]);

        $ad->update($validated);

        if (isset($validated['campaign_ids'])) {
            $ad->campaigns()->sync($validated['campaign_ids']);
        }

        return response()->json($ad->load('campaigns'));
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
