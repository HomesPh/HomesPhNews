<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CampaignController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $campaigns = Campaign::with('adUnits')
            ->latest()
            ->paginate($request->input('per_page', 10));

        return response()->json($campaigns);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'status' => 'required|string|in:active,paused,archived',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'image_url' => 'nullable|url|required_without_all:headline,banner_image_urls',
            'target_url' => 'required|url', // Renamed from destination_url
            'headline' => 'nullable|string|max:255|required_without_all:image_url,banner_image_urls',
            'banner_image_urls' => 'nullable|array|required_without_all:image_url,headline',
            'banner_image_urls.*' => 'url',
            'ad_units' => 'nullable|array',
            'ad_units.*' => 'exists:ad_units,id',
        ]);

        $campaign = Campaign::create($validated);

        if ($request->has('ad_units')) {
            $campaign->adUnits()->sync($request->input('ad_units'));
        }

        return response()->json($campaign->load('adUnits'), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $campaign = Campaign::with('adUnits')->findOrFail($id);

        return response()->json($campaign);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $campaign = Campaign::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'status' => 'sometimes|string|in:active,paused,archived',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'image_url' => 'sometimes|url',
            'target_url' => 'sometimes|url',
            'headline' => 'nullable|string|max:255',
            'banner_image_urls' => 'nullable|array',
            'banner_image_urls.*' => 'url',
            'ad_units' => 'nullable|array',
            'ad_units.*' => 'exists:ad_units,id',
        ]);

        $campaign->update($validated);

        if ($request->has('ad_units')) {
            $campaign->adUnits()->sync($request->input('ad_units'));
        }

        return response()->json($campaign->load('adUnits'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $campaign = Campaign::findOrFail($id);
        $campaign->delete();

        return response()->json(null, 204);
    }
}
