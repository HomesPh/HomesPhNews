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
        $campaigns = Campaign::withCount('ads')
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
            'name' => ['required', 'string', 'max:255', 'regex:/^\S*$/'],
            'is_active' => 'boolean',
            'rotation_type' => 'required|string|in:random,ordered',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $campaign = Campaign::create($validated);

        return response()->json($campaign, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $campaign = Campaign::with('ads')->findOrFail($id);

        return response()->json($campaign);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $campaign = Campaign::findOrFail($id);

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255', 'regex:/^\S*$/'],
            'is_active' => 'boolean',
            'rotation_type' => 'sometimes|string|in:random,ordered',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $campaign->update($validated);

        return response()->json($campaign);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $campaign = Campaign::findOrFail($id);

        // Optional: Block delete if has ads, or they will be set to null due to nullOnDelete
        // For now, let's allow it, ads will become orphaned (campaign_id = null)

        $campaign->delete();

        return response()->json(null, 204);
    }
}
