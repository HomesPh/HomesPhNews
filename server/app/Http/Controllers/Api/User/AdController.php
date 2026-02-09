<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use Illuminate\Http\JsonResponse;

class AdController extends Controller
{
    /**
     * Get a list of active campaigns with their ads.
     */
    public function index(): JsonResponse
    {
        $campaigns = Campaign::where(function ($query) {
            // Check if campaign is within date range (if set)
            $query->where(function ($q) {
                $q->whereNull('start_date')
                    ->orWhere('start_date', '<=', now());
            })->where(function ($q) {
                $q->whereNull('end_date')
                    ->orWhere('end_date', '>=', now());
            });
        })
            ->with('ads')
            ->get()
            ->map(function ($campaign) {
                // Apply rotation logic if needed
                // For now, we return all active ads for the campaign
                // The frontend can handle display rotation based on 'rotation_type'

                $ads = $campaign->ads;

                if ($campaign->rotation_type === 'random') {
                    $ads = $ads->shuffle();
                }

                return [
                    'id' => $campaign->id,
                    'name' => $campaign->name,
                    'rotation_type' => $campaign->rotation_type,
                    'ads' => $ads->values(),
                ];
            });

        return response()->json([
            'data' => $campaigns,
        ]);
    }

    /**
     * Get a specific campaign by name with its active ads.
     */
    public function showByName(string $name): JsonResponse
    {
        $campaign = Campaign::where('name', $name)
            ->where(function ($query) {
                // Check if campaign is within date range (if set)
                $query->where(function ($q) {
                    $q->whereNull('start_date')
                        ->orWhere('start_date', '<=', now());
                })->where(function ($q) {
                    $q->whereNull('end_date')
                        ->orWhere('end_date', '>=', now());
                });
            })
            ->with('ads')
            ->firstOrFail();

        $ads = $campaign->ads;

        if ($campaign->rotation_type === 'random') {
            $ads = $ads->shuffle();
        }

        return response()->json([
            'id' => $campaign->id,
            'name' => $campaign->name,
            'rotation_type' => $campaign->rotation_type,
            'ads' => $ads->values(),
        ]);
    }
}
