<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\SiteResource;
use App\Models\Site;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class SiteController extends Controller
{
    /**
     * Display a listing of the sites.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Site::query();

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('site_status', $request->status);
        }

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('site_name', 'LIKE', "%{$search}%")
                    ->orWhere('site_url', 'LIKE', "%{$search}%")
                    ->orWhere('contact_name', 'LIKE', "%{$search}%");
            });
        }

        $sites = $query->withCount([
            'articles' => function ($q) {
                $q->where('articles.is_deleted', false);
            }
        ])
            ->orderBy('created_at', 'desc')
            ->get();

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
            'data' => SiteResource::collection($sites),
            'counts' => $counts,
        ]);
    }

    /**
     * Display the specified site.
     */
    public function show(string $id): JsonResponse|SiteResource
    {
        $site = Site::find($id);

        if (!$site) {
            return response()->json(['error' => 'Site not found'], 404);
        }

        return new SiteResource($site);
    }

    /**
     * Store a newly created site.
     */
    public function store(Request $request): JsonResponse|SiteResource
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'domain' => 'required|string|max:255',
            'contact_name' => 'nullable|string|max:255',
            'contact_email' => 'nullable|email|max:255',
            'description' => 'nullable|string',
            'categories' => 'nullable|array',
            'image' => 'nullable|string',
            'original_logo' => 'nullable|string',
            'dark_logo' => 'nullable|string',
            'light_logo' => 'nullable|string',
        ]);

        $site = Site::create([
            'site_name' => $validated['name'],
            'site_url' => $validated['domain'],
            'original_logo' => $validated['original_logo'] ?? $validated['image'] ?? null,
            'dark_logo' => $validated['dark_logo'] ?? null,
            'light_logo' => $validated['light_logo'] ?? null,
            'site_description' => $validated['description'] ?? null,
            'site_keywords' => $validated['categories'] ?? [],
            'site_status' => 'active',
            'contact_name' => $validated['contact_name'] ?? null,
            'contact_email' => $validated['contact_email'] ?? null,
        ]);

        return (new SiteResource($site))->response()->setStatusCode(201);
    }

    /**
     * Update the specified site.
     */
    public function update(Request $request, string $id): JsonResponse|SiteResource
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
            'original_logo' => 'nullable|string',
            'dark_logo' => 'nullable|string',
            'light_logo' => 'nullable|string',
            'status' => 'sometimes|in:active,suspended',
        ]);

        $site->update([
            'site_name' => $validated['name'] ?? $site->site_name,
            'site_url' => $validated['domain'] ?? $site->site_url,
            'original_logo' => array_key_exists('original_logo', $validated) ? $validated['original_logo'] : (array_key_exists('image', $validated) ? $validated['image'] : $site->original_logo),
            'dark_logo' => array_key_exists('dark_logo', $validated) ? $validated['dark_logo'] : $site->dark_logo,
            'light_logo' => array_key_exists('light_logo', $validated) ? $validated['light_logo'] : $site->light_logo,
            'site_description' => $validated['description'] ?? $site->site_description,
            'site_keywords' => $validated['categories'] ?? $site->site_keywords,
            'site_status' => $validated['status'] ?? $site->site_status,
            'contact_name' => $validated['contact_name'] ?? $site->contact_name,
            'contact_email' => $validated['contact_email'] ?? $site->contact_email,
        ]);

        return new SiteResource($site->fresh());
    }

    /**
     * Remove the specified site.
     */
    public function destroy(string $id): JsonResponse
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

    /**
     * Toggle the status of a site.
     */
    public function toggleStatus(string $id): JsonResponse|SiteResource
    {
        $site = Site::find($id);

        if (!$site) {
            return response()->json(['error' => 'Site not found'], 404);
        }

        $site->site_status = $site->site_status === 'active' ? 'suspended' : 'active';
        $site->save();

        return new SiteResource($site);
    }

    /**
     * Get a list of all active site names.
     */
    public function names(): JsonResponse
    {
        $sites = Site::where('site_status', 'active')
            ->orderBy('site_name')
            ->pluck('site_name');

        return response()->json($sites);
    }
    /**
     * Refresh the API Key for a site.
     */
    public function refreshKey(string $id): JsonResponse|SiteResource
    {
        $site = Site::find($id);

        if (!$site) {
            return response()->json(['error' => 'Site not found'], 404);
        }

        $site->api_key = \Illuminate\Support\Str::random(64);
        $site->save();

        return new SiteResource($site);
    }
}
