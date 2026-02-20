<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use Illuminate\Http\JsonResponse;

class AdController extends Controller
{
    /**
     * Get a list of active campaigns (ads).
     */
    public function index(): JsonResponse
    {
        $campaigns = Campaign::active()->get();

        return response()->json([
            'data' => $campaigns,
        ]);
    }

    /**
     * Get a specific campaign by name (if relevant) or random by type? 
     * Keeping showByName for now but adapting to Campaign model.
     */
    public function showByName(string $name): JsonResponse
    {
        $campaign = Campaign::where('name', $name)
            ->active()
            ->firstOrFail();

        return response()->json($campaign);
    }
}
