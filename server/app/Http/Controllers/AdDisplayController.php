<?php

namespace App\Http\Controllers;

use App\Models\AdUnit;
use App\Models\Campaign;
use Illuminate\Http\Request;

class AdDisplayController extends Controller
{
    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // Find the AdUnit
        $adUnit = AdUnit::findOrFail($id);

        $adUnit->increment('impressions');

        // Get an active campaign for this ad unit
        // For now, let's just pick one random active campaign
        $campaign = $adUnit->campaigns()->active()->inRandomOrder()->first();

        if ($campaign) {
            $campaign->increment('impressions');
        }

        return view('ads.show', compact('campaign', 'adUnit'));
    }
}
