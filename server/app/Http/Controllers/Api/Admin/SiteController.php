<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Site;
use App\Models\Article;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class SiteController extends Controller
{
    #[OA\Get(
        path: "/api/admin/sites",
        operationId: "getAdminSites",
        summary: "List all partner sites",
        description: "Returns a list of all partner sites with article counts.",
        security: [['sanctum' => []]],
        tags: ["Admin: Sites"],
        parameters: [
            new OA\Parameter(name: "status", in: "query", description: "Filter by status (active, suspended)", schema: new OA\Schema(type: "string")),
            new OA\Parameter(name: "search", in: "query", description: "Search by name or domain", schema: new OA\Schema(type: "string"))
        ],
        responses: [
            new OA\Response(response: 200, description: "Successful operation"),
            new OA\Response(response: 401, description: "Unauthenticated")
        ]
    )]
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

    #[OA\Get(
        path: "/api/admin/sites/{id}",
        operationId: "getAdminSite",
        summary: "Get a single site",
        description: "Returns details of a specific partner site.",
        security: [['sanctum' => []]],
        tags: ["Admin: Sites"],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, description: "Site ID", schema: new OA\Schema(type: "integer"))
        ],
        responses: [
            new OA\Response(response: 200, description: "Successful operation"),
            new OA\Response(response: 404, description: "Site not found")
        ]
    )]
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

    #[OA\Post(
        path: "/api/admin/sites",
        operationId: "createAdminSite",
        summary: "Create a new partner site",
        description: "Creates a new partner site entry.",
        security: [['sanctum' => []]],
        tags: ["Admin: Sites"],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["name", "domain"],
                properties: [
                    new OA\Property(property: "name", type: "string"),
                    new OA\Property(property: "domain", type: "string"),
                    new OA\Property(property: "contact_name", type: "string"),
                    new OA\Property(property: "contact_email", type: "string"),
                    new OA\Property(property: "description", type: "string"),
                    new OA\Property(property: "categories", type: "array", items: new OA\Items(type: "string")),
                    new OA\Property(property: "image", type: "string"),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: "Site created successfully"),
            new OA\Response(response: 422, description: "Validation error")
        ]
    )]
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

    #[OA\Put(
        path: "/api/admin/sites/{id}",
        operationId: "updateAdminSite",
        summary: "Update a partner site",
        description: "Updates an existing partner site.",
        security: [['sanctum' => []]],
        tags: ["Admin: Sites"],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, description: "Site ID", schema: new OA\Schema(type: "integer"))
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: "name", type: "string"),
                    new OA\Property(property: "domain", type: "string"),
                    new OA\Property(property: "contact_name", type: "string"),
                    new OA\Property(property: "contact_email", type: "string"),
                    new OA\Property(property: "description", type: "string"),
                    new OA\Property(property: "categories", type: "array", items: new OA\Items(type: "string")),
                    new OA\Property(property: "image", type: "string"),
                    new OA\Property(property: "status", type: "string", enum: ["active", "suspended"]),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Site updated successfully"),
            new OA\Response(response: 404, description: "Site not found")
        ]
    )]
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

    #[OA\Delete(
        path: "/api/admin/sites/{id}",
        operationId: "deleteAdminSite",
        summary: "Delete a partner site",
        description: "Deletes a partner site.",
        security: [['sanctum' => []]],
        tags: ["Admin: Sites"],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, description: "Site ID", schema: new OA\Schema(type: "integer"))
        ],
        responses: [
            new OA\Response(response: 200, description: "Site deleted successfully"),
            new OA\Response(response: 404, description: "Site not found")
        ]
    )]
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

    #[OA\Patch(
        path: "/api/admin/sites/{id}/toggle-status",
        operationId: "toggleSiteStatus",
        summary: "Toggle site status",
        description: "Toggles a site between active and suspended status.",
        security: [['sanctum' => []]],
        tags: ["Admin: Sites"],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, description: "Site ID", schema: new OA\Schema(type: "integer"))
        ],
        responses: [
            new OA\Response(response: 200, description: "Status toggled successfully"),
            new OA\Response(response: 404, description: "Site not found")
        ]
    )]
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

    #[OA\Get(
        path: "/api/admin/sites/names",
        operationId: "getSiteNames",
        summary: "Get list of site names for publishing",
        description: "Returns a simple list of active site names for the article publish modal.",
        security: [['sanctum' => []]],
        tags: ["Admin: Sites"],
        responses: [
            new OA\Response(response: 200, description: "Successful operation")
        ]
    )]
    public function names()
    {
        $sites = Site::where('site_status', 'active')
            ->orderBy('site_name')
            ->pluck('site_name');

        return response()->json($sites);
    }
}
