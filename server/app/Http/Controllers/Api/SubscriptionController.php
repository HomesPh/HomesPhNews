<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SubscriptionDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
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
        // Try finding by the defined primary key column 'sub_Id'
        $subscription = SubscriptionDetail::where('sub_Id', $id)->first();

        if (!$subscription) {
            // Log the failure for debugging
            \Log::warning("Subscription not found for ID: " . $id);

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
        $subscription = SubscriptionDetail::where('sub_Id', $id)->first();

        if (!$subscription) {
            return response()->json([
                'status' => 'error',
                'message' => 'Subscription not found.'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'categories' => 'required|array',
            'countries' => 'required|array',
            'features' => 'nullable|string',
            'time' => 'nullable|string',
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
                'features' => $request->features,
                'time' => $request->time,
            ]);

            // Store in cache for algorithm purpose only
            Cache::put("user_preferences:{$subscription->sub_Id}", [
                'categories' => $request->categories,
                'countries' => $request->countries,
            ], now()->addDays(30));

            // Fetch matching articles based on NEW preferences
            $matchingArticles = \App\Models\Article::whereIn('category', $request->categories)
                ->whereIn('country', $request->countries)
                ->where('status', 'published')
                ->latest()
                ->limit(3)
                ->get();

            if ($matchingArticles->isEmpty()) {
                $matchingArticles = \App\Models\Article::whereIn('category', $request->categories)
                    ->orWhereIn('country', $request->countries)
                    ->where('status', 'published')
                    ->latest()
                    ->limit(3)
                    ->get();
            }

            // Send confirmation email with new news
            try {
                $clientUrl = env('APP_URL_CLIENT', 'http://localhost:3000');
                Mail::send('emails.subscription', [
                    'subject' => 'Preferences Updated - HomesTV',
                    'title' => 'Preferences Saved!',
                    'messageText' => 'Your subscription preferences have been updated successfully. We\'ve selected these latest news pieces based on your new interests.',
                    'email' => $subscription->email,
                    'categories' => $request->categories,
                    'countries' => $request->countries,
                    'articles' => $matchingArticles,
                    'clientUrl' => $clientUrl,
                    'actionUrl' => $clientUrl . "/subscribe/edit?id=" . $subscription->sub_Id,
                    'actionText' => 'Manage Preferences',
                    'subId' => $subscription->sub_Id
                ], function ($message) use ($subscription) {
                    $message->to($subscription->email)
                        ->subject('Preferences Updated - HomesTV');
                });
            } catch (\Exception $e) {
                \Log::error('Preference Update Email Failed: ' . $e->getMessage());
            }

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
            'company_name' => 'nullable|string',
            'categories' => 'required|array',
            'countries' => 'required|array',
            'features' => 'nullable|string',
            'time' => 'nullable|string',
            'plan' => 'nullable|string',
            'price' => 'nullable|numeric',
            'logo' => 'nullable|image|max:2048', // 2MB max
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
                    Mail::send('emails.subscription', [
                        'subject' => 'Subscription Already Exists - HomesTV',
                        'title' => 'Welcome back!',
                        'messageText' => 'You are already subscribed to HomesTV Daily News. We noticed you tried to sign up again, so we\'ve provided a link to manage your current preferences below.',
                        'email' => $request->email,
                        'categories' => $existing->category ?? [],
                        'countries' => $existing->country ?? [],
                        'articles' => [], // Don't need articles for this one
                        'clientUrl' => env('APP_URL_CLIENT', 'http://localhost:3000'),
                        'actionUrl' => $editUrl,
                        'actionText' => 'Edit your Preferences',
                        'subId' => $existing->sub_Id
                    ], function ($message) use ($request) {
                        $message->to($request->email)
                            ->subject('Subscription Already Exists - HomesTV');
                    });
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
            $logoPath = null;
            if ($request->hasFile('logo')) {
                $logoPath = $request->file('logo')->store('subscription-logos', 'public');
            }

            // Save new subscription to database
            $subscription = SubscriptionDetail::create([
                'email' => $request->email,
                'company_name' => $request->company_name,
                'category' => $request->categories,
                'country' => $request->countries,
                'features' => $request->features,
                'time' => $request->time,
                'plan' => $request->plan,
                'price' => $request->price ?? 0.00,
                'logo' => $logoPath,
                'status' => 'active',
            ]);

            // Store in cache for algorithm purpose only
            Cache::put("user_preferences:{$subscription->sub_Id}", [
                'categories' => $request->categories,
                'countries' => $request->countries,
            ], now()->addDays(30));

            // Fetch matching articles
            $matchingArticles = \App\Models\Article::whereIn('category', $request->categories)
                ->whereIn('country', $request->countries)
                ->where('status', 'published')
                ->latest()
                ->limit(3)
                ->get();

            if ($matchingArticles->isEmpty()) {
                $matchingArticles = \App\Models\Article::whereIn('category', $request->categories)
                    ->orWhereIn('country', $request->countries)
                    ->where('status', 'published')
                    ->latest()
                    ->limit(3)
                    ->get();
            }

            // Send dynamic welcome email
            try {
                $clientUrl = env('APP_URL_CLIENT', 'http://localhost:3000');
                Mail::send('emails.subscription', [
                    'subject' => 'Welcome to HomesTV Subscription!',
                    'title' => 'Successfully Subscribed!',
                    'messageText' => 'Thank you for joining HomesTV Daily News. You will now receive the latest real estate updates tailored to your interests.',
                    'email' => $request->email,
                    'categories' => $request->categories,
                    'countries' => $request->countries,
                    'articles' => $matchingArticles,
                    'clientUrl' => $clientUrl,
                    'actionUrl' => $clientUrl . "/subscribe/edit?id=" . $subscription->sub_Id,
                    'actionText' => 'Edit Preferences',
                    'subId' => $subscription->sub_Id
                ], function ($message) use ($request) {
                    $message->to($request->email)
                        ->subject('Welcome to HomesTV Subscription!');
                });
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
