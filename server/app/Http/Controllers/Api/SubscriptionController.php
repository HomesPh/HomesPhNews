<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SubscriptionDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\JsonResponse;

class SubscriptionController extends Controller
{
    /**
     * Fetch a subscription by its UUID (sub_Id).
     */
    public function show($id): JsonResponse
    {
        $subscription = SubscriptionDetail::find($id);

        if (!$subscription) {
            return response()->json([
                'status' => 'error',
                'message' => 'Subscription not found.'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $subscription
        ]);
    }

    /**
     * Update an existing subscription.
     */
    public function update(Request $request, $id): JsonResponse
    {
        $subscription = SubscriptionDetail::find($id);

        if (!$subscription) {
            return response()->json([
                'status' => 'error',
                'message' => 'Subscription not found.'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'categories' => 'required|array',
            'countries' => 'required|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $subscription->update([
                'category' => $request->categories,
                'country' => $request->countries,
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Subscription updated successfully!',
                'data' => $subscription
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update subscription.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a new subscription and send a welcome email.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'categories' => 'required|array',
            'countries' => 'required|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Check if email already exists
            $existing = SubscriptionDetail::where('email', $request->email)->first();

            if ($existing) {
                // Determine the front-end edit URL (assuming it's a query param or route)
                $editUrl = env('APP_URL_CLIENT', 'http://localhost:3000') . "/subscribe/edit?id=" . $existing->sub_Id;

                // Send "Already Subscribed" email
                try {
                    Mail::raw(
                        "You are already subscribed to HomesTV Daily News!\n\n" .
                        "To manage your preferences or edit your subscription, please click the link below:\n\n" .
                        $editUrl . "\n\n" .
                        "Thank you for being part of our community!",
                        function ($message) use ($request) {
                            $message->to($request->email)
                                ->subject('Subscription Already Exists - HomesTV');
                        }
                    );
                } catch (\Exception $e) {
                    \Log::error('Existing Subscription Email Failed: ' . $e->getMessage());
                }

                // Return success to the front-end as requested
                return response()->json([
                    'status' => 'success',
                    'message' => 'Subscription successful!',
                    'data' => $existing,
                    'is_existing' => true
                ], 200);
            }

            // Save new subscription to database
            $subscription = SubscriptionDetail::create([
                'email' => $request->email,
                'category' => $request->categories,
                'country' => $request->countries,
            ]);

            // Fetch matching articles
            $matchingArticles = \App\Models\Article::whereIn('category', $request->categories)
                ->whereIn('country', $request->countries)
                ->where('status', 'published')
                ->latest()
                ->limit(5)
                ->get();

            $articleList = "";
            if ($matchingArticles->isEmpty()) {
                // Try broader search if no exact match (optional, but good for UX)
                $matchingArticles = \App\Models\Article::whereIn('category', $request->categories)
                    ->orWhereIn('country', $request->countries)
                    ->where('status', 'published')
                    ->latest()
                    ->limit(5)
                    ->get();
            }

            if ($matchingArticles->isNotEmpty()) {
                $articleList = "\nLatest News for You:\n";
                foreach ($matchingArticles as $article) {
                    $articleUrl = env('APP_URL_CLIENT', 'http://localhost:3000') . "/article?id=" . $article->id;
                    $articleList .= "- " . $article->title . ": " . $articleUrl . "\n";
                }
            } else {
                $articleList = "\nCheck out all the latest updates on our homepage: " . env('APP_URL_CLIENT', 'http://localhost:3000') . "\n";
            }

            // Send dynamic welcome email
            try {
                Mail::raw(
                    "Thank you for subscribing to HomesTV Daily News!\n\n" .
                    "Details of your subscription:\n" .
                    "- Email: {$request->email}\n" .
                    "- Categories: " . implode(', ', $request->categories) . "\n" .
                    "- Countries: " . implode(', ', $request->countries) . "\n\n" .
                    "Check out matching articles tailored for you:\n" .
                    $articleList . "\n" .
                    "You will now receive the latest real estate updates based on your preferences.",
                    function ($message) use ($request) {
                        $message->to($request->email)
                            ->subject('Welcome to HomesTV Subscription!');
                    }
                );
            } catch (\Exception $e) {
                \Log::error('Subscription Email Failed: ' . $e->getMessage());
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Subscription successful!',
                'data' => $subscription
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Internal server error occurred.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
