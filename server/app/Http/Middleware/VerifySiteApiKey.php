<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Site;

class VerifySiteApiKey
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $apiKey = $request->header('X-Site-Api-Key');
        $origin = $request->header('Origin'); // Browser sends this for CORS requests

        if (!$apiKey) {
            return response()->json(['error' => 'API Key missing'], 401);
        }

        $site = Site::where('api_key', $apiKey)->where('site_status', 'active')->first();

        if (!$site) {
            return response()->json(['error' => 'Invalid or Suspended API Key'], 403);
        }

        // --- PRODUCTION ORIGIN VALIDATION ---
        // In production, we ensure the request comes from the registered site_url
        if (app()->environment('production') && $origin) {
            $cleanSiteUrl = str_replace(['http://', 'https://', 'www.'], '', strtolower($site->site_url));
            $cleanOrigin = str_replace(['http://', 'https://', 'www.'], '', strtolower($origin));

            // Basic check: Origin should contain or match the registered site domain
            if (!str_contains($cleanOrigin, $cleanSiteUrl)) {
                return response()->json([
                    'error' => 'Unauthorized Origin',
                    'message' => 'This API key is strictly for ' . $site->site_url
                ], 403);
            }
        }

        // Attach site to request for the controller to use
        $request->attributes->add(['site' => $site]);

        return $next($request);
    }
}
