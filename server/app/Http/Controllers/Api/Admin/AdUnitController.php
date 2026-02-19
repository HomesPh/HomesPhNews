<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdUnit;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdUnitController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $adUnits = AdUnit::with('campaigns')
            ->latest()
            ->paginate($request->input('per_page', 10));

        return response()->json($adUnits);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'nullable|string|in:image,text',
            'page_url' => 'nullable|string|max:255',
            'size' => 'nullable|string|in:adaptive',
            'campaigns' => 'nullable|array',
            'campaigns.*' => 'exists:campaigns,id',
        ]);

        $adUnit = AdUnit::create($validated);

        if ($request->has('campaigns')) {
            $adUnit->campaigns()->sync($request->input('campaigns'));
        }

        return response()->json($adUnit->load('campaigns'), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $adUnit = AdUnit::with('campaigns')->findOrFail($id);

        return response()->json($adUnit);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $adUnit = AdUnit::findOrFail($id);

        if ($request->isJson()) {
            json_decode($request->getContent());
            if (json_last_error() !== JSON_ERROR_NONE) {
                return response()->json(['message' => 'Invalid JSON payload'], 400);
            }
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'type' => 'sometimes|string|in:image,text',
            'page_url' => 'nullable|string|max:255',
            'size' => 'nullable|string|in:adaptive',
            'campaigns' => 'nullable|array',
            'campaigns.*' => 'exists:campaigns,id',
        ]);

        $adUnit->update($validated);

        if ($request->has('campaigns')) {
            $adUnit->campaigns()->sync($request->input('campaigns'));
        }

        return response()->json($adUnit->load('campaigns'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $adUnit = AdUnit::findOrFail($id);
        $adUnit->delete();

        return response()->json(null, 204);
    }
}
