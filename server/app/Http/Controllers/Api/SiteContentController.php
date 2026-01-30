<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SiteContentController extends Controller
{
    public function getArticles(Request $request)
    {
        // The site is already resolved by the Middleware
        $site = $request->attributes->get('site');

        // Fetch articles intended for this site
        $articles = $site->articles()
            ->where('status', 'published') // Ensure only published articles
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'site' => [
                'name' => $site->site_name,
                'url' => $site->site_url,
                'description' => $site->site_description,
            ],
            'data' => $articles
        ]);
    }
}
