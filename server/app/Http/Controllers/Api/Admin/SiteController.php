<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\sites;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use OpenApi\Attributes as OA;

class SiteController extends Controller
{
    #[OA\Get(
        path: "/api/admin/sites-analytics",
        operationId: "getAdminSitesAnalytics",
        summary: "Get site-specific analytics and article details",
        description: "Returns statistics about partners, performance per site, and detailed article listings with site information.",
        security: [['sanctum' => []]],
        tags: ["Admin: Sites"],
        parameters: [
            new OA\Parameter(
                name: "status",
                in: "query",
                description: "Filter by article status (all, active, suspended)",
                required: false,
                schema: new OA\Schema(type: "string", default: "all", enum: ["all", "active", "suspended"])
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Successful operation",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "filter", type: "string", example: "all"),
                        new OA\Property(property: "stats", type: "object"),
                        new OA\Property(property: "sites_performance", type: "array", items: new OA\Items(type: "object")),
                        new OA\Property(property: "article_details", type: "array", items: new OA\Items(type: "object"))
                    ]
                )
            ),
            new OA\Response(response: 401, description: "Unauthenticated")
        ]
    )]
    public function index(Request $request)
    {
        $statusFilter = $request->query('status', 'all'); // Default to 'all'

        // 1. Overview Stats (Global)
        $activePartnersCount = sites::where('site_status', 'active')->count();
        $suspendedArticlesCount = Article::where('status', 'suspended')->count();
        $totalArticleShared = Article::where('status', 'published')->count();
        $totalMonthlyReached = Article::sum('views_count');

        // 2. Sites with Aggregated Data (Filtered by status if not 'all')
        $sitesPerformanceQuery = sites::leftJoin('articles', 'sites.id', '=', 'articles.site_id')
            ->select(
                'sites.*',
                DB::raw('COUNT(articles.id) as total_articles'),
                DB::raw('SUM(articles.views_count) as total_site_views')
            );

        if ($statusFilter !== 'all') {
            $sitesPerformanceQuery->where('articles.status', $statusFilter);
        }

        $sitesPerformance = $sitesPerformanceQuery->groupBy('sites.id')->get();

        // 3. Detailed Articles List with Site Info (Filtered by status if not 'all')
        $articleDetailsQuery = Article::join('sites', 'articles.site_id', '=', 'sites.id')
            ->select(
                'articles.title',
                'articles.status',
                'articles.category',
                'articles.created_at',
                'articles.views_count',
                'sites.site_name',
                'sites.site_url',
                'sites.site_contact',
                'sites.site_description',
                'sites.id as site_id'
            );

        if ($statusFilter !== 'all') {
            $articleDetailsQuery->where('articles.status', $statusFilter);
        }

        $articleDetails = $articleDetailsQuery->orderBy('articles.created_at', 'desc')->get();

        return response()->json([
            'filter' => $statusFilter,
            'stats' => [
                'active_partners_count' => $activePartnersCount,
                'suspended_articles_count' => $suspendedArticlesCount,
                'total_articles_shared' => $totalArticleShared,
                'total_monthly_reached' => $totalMonthlyReached,
            ],
            'sites_performance' => $sitesPerformance,
            'article_details' => $articleDetails
        ]);
    }

    /**
     * Store a newly created site in storage.
     */
    #[OA\Post(
        path: "/api/admin/sites",
        operationId: "storeAdminSite",
        summary: "Create a new partner site",
        description: "Creates a new partner site entry with contact information.",
        security: [['sanctum' => []]],
        tags: ["Admin: Sites"],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["site_name", "domain", "contact_name", "contact_email", "description"],
                properties: [
                    new OA\Property(property: "site_name", type: "string", example: "Tech News Daily"),
                    new OA\Property(property: "domain", type: "string", example: "https://technewsdaily.com"),
                    new OA\Property(property: "logo", type: "string", example: "https://technewsdaily.com/logo.png"),
                    new OA\Property(property: "contact_name", type: "string", example: "John Smith"),
                    new OA\Property(property: "contact_email", type: "string", example: "john@technewsdaily.com"),
                    new OA\Property(property: "description", type: "string", example: "Detailed description of the site partner.")
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: "Site created successfully", content: new OA\JsonContent(type: "object")),
            new OA\Response(response: 422, description: "Validation Error"),
            new OA\Response(response: 401, description: "Unauthenticated")
        ]
    )]
    public function store(Request $request)
    {
        $validated = $request->validate([
            'site_name' => 'required|string|max:255',
            'domain' => 'required|string|url|max:255',
            'logo' => 'nullable|string', // URL or base64
            'contact_name' => 'required|string|max:255',
            'contact_email' => 'required|email|max:255',
            'description' => 'required|string',
        ]);

        $site = sites::create([
            'site_name' => $validated['site_name'],
            'site_url' => $validated['domain'],
            'site_logo' => $validated['logo'] ?? null,
            'contact_name' => $validated['contact_name'],
            'contact_email' => $validated['contact_email'],
            'site_description' => $validated['description'],
            'site_status' => 'active', // Default to active
        ]);

        return response()->json([
            'message' => 'Site created successfully',
            'site' => $site
        ], 201);
    }
}
