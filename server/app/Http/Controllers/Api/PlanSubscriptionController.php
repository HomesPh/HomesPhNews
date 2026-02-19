<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SubscribePlan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\JsonResponse;

class PlanSubscriptionController extends Controller
{
    /**
     * Store a new plan subscription.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'plan_name' => 'required|string',
            'price' => 'required|numeric',
            'company_name' => 'nullable|string',
            'categories' => 'nullable|array',
            'countries' => 'nullable|array',
            'logo' => 'nullable|image|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = $request->user();
            
            if (!$user) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'User not authenticated'
                ], 401);
            }

            $logoPath = null;
            if ($request->hasFile('logo')) {
                $logoPath = $request->file('logo')->store('plan-logos', 'public');
            }

            $subscription = SubscribePlan::create([
                'user_id' => $user->id,
                'email' => $request->email,
                'plan_name' => $request->plan_name,
                'price' => $request->price,
                'company_name' => $request->company_name,
                'logo' => $logoPath,
                'categories' => $request->categories,
                'countries' => $request->countries,
                'payment_status' => 'pending', // Default to pending
                'status' => 'active',
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Plan subscription created successfully!',
                'data' => $subscription
            ], 201);

        } catch (\Exception $e) {
            \Log::error('Plan Subscription Error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Internal server error occurred.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
