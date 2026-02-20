<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AdMetricQueryRequest;
use App\Models\AdMetric;
use App\Models\AdUnit;
use App\Models\Campaign;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdMetricController extends Controller
{
    /**
     * Record a new ad metric (impression or click).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'ad_unit_id' => 'required|exists:ad_units,id',
            'campaign_id' => 'nullable|exists:campaigns,id',
            'type' => 'required|in:impression,click',
        ]);

        $metric = AdMetric::create($validated);

        // Increment counts on related models for quick access
        $adUnit = AdUnit::find($validated['ad_unit_id']);
        if ($validated['type'] === 'impression') {
            $adUnit->increment('impressions');
        } else {
            $adUnit->increment('clicks');
        }

        if (!empty($validated['campaign_id'])) {
            $campaign = Campaign::find($validated['campaign_id']);
            if ($validated['type'] === 'impression') {
                $campaign->increment('impressions');
            } else {
                $campaign->increment('clicks');
            }
        }

        return response()->json([
            'message' => 'Metric recorded successfully',
            'data' => $metric
        ], 201);
    }

    /**
     * Get aggregated analytics for all ads.
     */
    public function index(AdMetricQueryRequest $request)
    {
        return $this->getAggregatedMetrics($request);
    }

    /**
     * Get metrics for a specific ad unit.
     */
    public function showByAdUnit(AdMetricQueryRequest $request, AdUnit $adUnit)
    {
        return $this->getAggregatedMetrics($request, $adUnit->id, null);
    }

    /**
     * Get metrics for a specific campaign.
     */
    public function showByCampaign(AdMetricQueryRequest $request, Campaign $campaign)
    {
        return $this->getAggregatedMetrics($request, null, $campaign->id);
    }

    /**
     * Private helper to fetch aggregated metrics with optional filters.
     */
    private function getAggregatedMetrics(AdMetricQueryRequest $request, $adUnitId = null, $campaignId = null)
    {
        $period = $request->input('period', 'daily');
        $startDate = $request->input('from', now()->subDays(30)->toDateString());
        $endDate = $request->input('to', now()->toDateString());
        $groupBy = $request->input('group_by', 'date');
        $sortBy = $request->input('sort_by', 'date');
        $sortOrder = $request->input('sort_order', 'asc');
        $perPage = $request->input('per_page', 15);

        $driver = DB::connection()->getDriverName();
        
        if ($driver === 'sqlite') {
            $dateExpression = match ($period) {
                'hourly' => "strftime('%Y-%m-%d %H:00', created_at)",
                'monthly' => "strftime('%Y-%m', created_at)",
                'weekly' => "strftime('%Y-%W', created_at)",
                default => "strftime('%Y-%m-%d', created_at)",
            };
        } else {
            $dateExpression = match ($period) {
                'hourly' => "DATE_FORMAT(created_at, '%Y-%m-%d %H:00')",
                'monthly' => "DATE_FORMAT(created_at, '%Y-%m')",
                'weekly' => "DATE_FORMAT(created_at, '%x-%v')", // ISO Year and Week
                default => "DATE_FORMAT(created_at, '%Y-%m-%d')",
            };
        }

        $query = AdMetric::select(
            DB::raw("$dateExpression as date"),
            DB::raw("SUM(CASE WHEN type = 'impression' THEN 1 ELSE 0 END) as impressions"),
            DB::raw("SUM(CASE WHEN type = 'click' THEN 1 ELSE 0 END) as clicks")
        )
        ->whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59']);

        // Filter by entity if provided via route
        if ($adUnitId) {
            $query->where('ad_unit_id', $adUnitId);
        }
        if ($campaignId) {
            $query->where('campaign_id', $campaignId);
        }

        // Apply grouping
        if ($groupBy === 'ad_unit_id') {
            $query->addSelect('ad_unit_id')->groupBy('ad_unit_id');
        } elseif ($groupBy === 'campaign_id') {
            $query->addSelect('campaign_id')->groupBy('campaign_id');
        } else {
            $query->groupBy('date');
        }

        // Apply sorting
        $query->orderBy($sortBy, $sortOrder);

        $metrics = $query->paginate($perPage);

        return response()->json([
            'filters' => [
                'period' => $period,
                'from' => $startDate,
                'to' => $endDate,
                'group_by' => $groupBy,
                'ad_unit_id' => $adUnitId,
                'campaign_id' => $campaignId,
            ],
            'analytics' => $metrics
        ]);
    }
}
