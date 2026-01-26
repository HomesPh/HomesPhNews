<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Site;
use App\Models\Article;
use Illuminate\Http\Request;

class SiteController extends Controller
{
        public function index(Request $request)
    {
        $query = Site::query();

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('site_status', $request->status);
        }

        // Search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('site_name', 'LIKE', "%{$search}%")
                  ->orWhere('site_url', 'LIKE', "%{$search}%")
                  ->orWhere('contact_name', 'LIKE', "%{$search}%");
            });
        }

        $sites = $query->withCount('articles')
            ->orderBy('created_at', 'desc')
            ->get();

        // Transform to frontend format
        $transformed = $sites->map(function ($site) {
            return [
                'id' => $site->id,
                'name' => $site->site_name,
                'domain' => $site->site_url,
                'status' => $site->site_status,
                'image' => $site->site_logo ?? '/images/HomesTV.png',
                'contact' => $site->contact,
                'description' => $site->site_description ?? '',
                'categories' => $site->site_keywords ?? [],
                'requested' => $site->created_at?->format('Y-m-d') ?? '',
                'articles' => $site->articles_count,
                'monthlyViews' => '0', // Placeholder for future analytics
            ];
        });

        // Calculate counts - Single query group by is faster
        $statusCounts = Site::selectRaw('site_status, count(*) as total')
            ->groupBy('site_status')
            ->pluck('total', 'site_status')
            ->toArray();

        $counts = [
            'all' => array_sum($statusCounts),
            'active' => $statusCounts['active'] ?? 0,
            'suspended' => $statusCounts['suspended'] ?? 0,
        ];

        return response()->json([
            'data' => $transformed,
            'counts' => $counts,
        ]);
    }

        public function show(int $id)
    {
        $site = Site::find($id);

        if (!$site) {
            return response()->json(['error' => 'Site not found'], 404);
        }

        return response()->json([
            'id' => $site->id,
            'name' => $site->site_name,
            'domain' => $site->site_url,
            'status' => $site->site_status,
            'image' => $site->site_logo ?? '/images/HomesTV.png',
            'contact_name' => $site->contact_name,
            'contact_email' => $site->contact_email,
            'description' => $site->site_description ?? '',
            'categories' => $site->site_keywords ?? [],
            'created_at' => $site->created_at,
        ]);
    }

        public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'domain' => 'required|string|max:255',
            'contact_name' => 'nullable|string|max:255',
            'contact_email' => 'nullable|email|max:255',
            'description' => 'nullable|string',
            'categories' => 'nullable|array',
            'image' => 'nullable|string',
        ]);

        $site = Site::create([
            'site_name' => $validated['name'],
            'site_url' => $validated['domain'],
            'site_logo' => $validated['image'] ?? null,
            'site_description' => $validated['description'] ?? null,
            'site_keywords' => $validated['categories'] ?? [],
            'site_status' => 'active',
            'contact_name' => $validated['contact_name'] ?? null,
            'contact_email' => $validated['contact_email'] ?? null,
        ]);

        return response()->json([
            'message' => 'Site created successfully',
            'site' => $site,
        ], 201);
    }

        public function update(Request $request, int $id)
    {
        $site = Site::find($id);

        if (!$site) {
            return response()->json(['error' => 'Site not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'domain' => 'sometimes|string|max:255',
            'contact_name' => 'nullable|string|max:255',
            'contact_email' => 'nullable|email|max:255',
            'description' => 'nullable|string',
            'categories' => 'nullable|array',
            'image' => 'nullable|string',
            'status' => 'sometimes|in:active,suspended',
        ]);

        $site->update([
            'site_name' => $validated['name'] ?? $site->site_name,
            'site_url' => $validated['domain'] ?? $site->site_url,
            'site_logo' => $validated['image'] ?? $site->site_logo,
            'site_description' => $validated['description'] ?? $site->site_description,
            'site_keywords' => $validated['categories'] ?? $site->site_keywords,
            'site_status' => $validated['status'] ?? $site->site_status,
            'contact_name' => $validated['contact_name'] ?? $site->contact_name,
            'contact_email' => $validated['contact_email'] ?? $site->contact_email,
        ]);

        return response()->json([
            'message' => 'Site updated successfully',
            'site' => $site->fresh(),
        ]);
    }

        public function destroy(int $id)
    {
        $site = Site::find($id);

        if (!$site) {
            return response()->json(['error' => 'Site not found'], 404);
        }

        $site->delete();

        return response()->json([
            'message' => 'Site deleted successfully',
        ]);
    }

        public function toggleStatus(int $id)
    {
        $site = Site::find($id);

        if (!$site) {
            return response()->json(['error' => 'Site not found'], 404);
        }

        $site->site_status = $site->site_status === 'active' ? 'suspended' : 'active';
        $site->save();

        return response()->json([
            'message' => 'Site status toggled successfully',
            'site' => $site,
        ]);
    }

        public function names()
    {
        $sites = Site::where('site_status', 'active')
            ->orderBy('site_name')
            ->pluck('site_name');

        return response()->json($sites);
    }
}
