<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ArticlePublication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ArticlePublicationController extends Controller
{
    /**
     * Display a listing of scheduled publications.
     */
    public function index(Request $request)
    {
        $query = ArticlePublication::query();

        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('scheduled_at', [$request->start_date, $request->end_date]);
        }

        return response()->json($query->orderBy('scheduled_at', 'asc')->get());
    }

    /**
     * Store newly scheduled article publications.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'time' => 'required|string',
            'articles' => 'required|array|min:1',
            'articles.*.id' => 'required|string',
            'articles.*.title' => 'required|string',
            'articles.*.image' => 'nullable|string',
            'articles.*.category' => 'nullable|string',
            'articles.*.country' => 'nullable|string',
            'articles.*.summary' => 'nullable|string',
            'articles.*.source' => 'nullable|string',
        ]);

        $scheduledAt = $validated['date'] . ' ' . $validated['time'];
        $publications = [];

        DB::transaction(function () use ($validated, $scheduledAt, &$publications) {
            foreach ($validated['articles'] as $articleData) {
                $publications[] = ArticlePublication::create([
                    'article_id' => $articleData['id'],
                    'title' => $articleData['title'],
                    'summary' => $articleData['summary'] ?? null,
                    'image_url' => $articleData['image'] ?? null,
                    'category' => $articleData['category'] ?? null,
                    'country' => $articleData['country'] ?? null,
                    'source' => $articleData['source'] ?? null,
                    'scheduled_at' => $scheduledAt,
                    'status' => 'pending',
                ]);
            }
        });

        return response()->json([
            'message' => count($publications) . ' articles scheduled successfully.',
            'data' => $publications
        ], 201);
    }

    /**
     * Display the specified scheduled article.
     */
    public function show(ArticlePublication $articlePublication)
    {
        return response()->json($articlePublication);
    }

    /**
     * Update the specified scheduled publication.
     */
    public function update(Request $request, ArticlePublication $articlePublication)
    {
        $validated = $request->validate([
            'scheduled_at' => 'nullable|date',
            'status' => 'nullable|string|in:pending,published,failed',
            'title' => 'nullable|string',
        ]);

        $articlePublication->update($validated);

        return response()->json($articlePublication);
    }

    /**
     * Remove the specified scheduled publication.
     */
    public function destroy(ArticlePublication $articlePublication)
    {
        $articlePublication->delete();
        return response()->json(null, 204);
    }
}
