<?php

namespace App\Http\Controllers;

use App\Models\AdUnit;
use App\Models\Campaign;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AdDisplayController extends Controller
{
    /**
     * Display the specified resource.
     */
    public function show(Request $request, string $id)
    {
        // Find the AdUnit
        $adUnit = AdUnit::findOrFail($id);

        $sizeParam = $request->query('size');
        $width = null;
        $height = null;

        // Parse requested dimensions from the 'size' parameter (e.g., ?size=728x90)
        // or from explicit 'width' and 'height' parameters
        if ($sizeParam && $sizeParam !== 'responsive' && str_contains($sizeParam, 'x')) {
            $parts = explode('x', $sizeParam);
            $width = (int) $parts[0];
            $height = (int) $parts[1];
        } elseif ($request->query('width') && $request->query('height')) {
            $width = (int) $request->query('width');
            $height = (int) $request->query('height');
        }

        $campaignQuery = $adUnit->campaigns()->active();

        // If specific dimensions are requested, filter campaigns that possess matching banners.
        // We use a 10px tolerance to allow slightly mismatched banners to still display gracefully.
        if ($width && $height) {
            $campaignQuery->whereHas('banners', function ($query) use ($width, $height) {
                $query->whereBetween('width', [$width - 10, $width + 10])
                    ->whereBetween('height', [$height - 10, $height + 10]);
            });
        }

        // Get an active campaign for this ad unit that satisfies the dimension constraints
        $campaign = $campaignQuery->inRandomOrder()->first();

        $bannerUrl = null;

        if ($campaign) {
            Log::info('Ad Display - Campaign Selected', [
                'ad_unit_id' => $adUnit->id,
                'campaign_id' => $campaign->id,
                'requested_width' => $width,
                'requested_height' => $height,
            ]);

            if ($adUnit->type === 'image') {
                if ($width && $height) {
                    // Find a specific banner within the campaign that matches the requested dimensions
                    $banner = $campaign->banners()
                        ->whereBetween('width', [$width - 10, $width + 10])
                        ->whereBetween('height', [$height - 10, $height + 10])
                        ->inRandomOrder()
                        ->first();
                    $bannerUrl = $banner ? $banner->image_url : null;

                    Log::info('Ad Display - Exact banner match evaluated', [
                        'banner_found' => (bool) $banner,
                        'banner_url' => $bannerUrl,
                    ]);
                } else {
                    // If no dimensions are specified, pick any random banner or fallback to the campaign's main image
                    $banner = $campaign->banners()->inRandomOrder()->first();
                    $bannerUrl = $banner ? $banner->image_url : $campaign->image_url;

                    Log::info('Ad Display - Fallback banner or image selected', [
                        'banner_url' => $bannerUrl,
                    ]);
                }
            } else {
                // For text ads, use the campaign's main image as the background
                $bannerUrl = $campaign->image_url;
                Log::info('Ad Display - Text ad selected', [
                    'image_url' => $bannerUrl,
                ]);
            }
        } else {
            Log::warning('Ad Display - No active campaign matched the constraints', [
                'ad_unit_id' => $adUnit->id,
                'requested_width' => $width,
                'requested_height' => $height,
            ]);
        }

        return view('ads.show', compact('campaign', 'adUnit', 'bannerUrl'));
    }
}
