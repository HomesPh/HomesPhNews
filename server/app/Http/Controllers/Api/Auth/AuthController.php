<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Resources\UserResource;
use App\Jobs\SendMailJob;
use App\Models\User;
use App\Services\OTPService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    protected $otpService;

    public function __construct(OTPService $otpService)
    {
        $this->otpService = $otpService;
    }

    /**
     * Authenticate user and return token.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        \Log::info('Login attempt for: '.$request->email);
        $validated = $request->validated();

        $user = User::where('email', $validated['email'])->first();

        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            return response()->json([
                'message' => 'Invalid login details',
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => new UserResource($user->load('roles')),
        ]);
    }

    /**
     * Register a new user
     *
     * Creates a new subscriber account and automatically sends a verification OTP
     * to the user's email address.
     *
     * @group Authentication
     */
    public function register(Request $request): JsonResponse
    {
        // Validate the request
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        \Log::info('Registration attempt for: '.$request->email);

        // Create the user
        $user = User::create([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'name' => $validated['first_name'].' '.$validated['last_name'], // Full name
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'roles' => ['subscriber'], // Save to explicit roles JSON column
        ]);

        // Attach default 'subscriber' role
        $subscriberRole = \App\Models\Role::where('name', 'subscriber')->first();
        if ($subscriberRole) {
            $user->roles()->attach($subscriberRole);
        }

        // generate otp
        $otpData = $this->otpService->generateOTP($user->email, 'verify-email');

        // send email
        SendMailJob::dispatch(
            $user->name,
            $user->email,
            $otpData['otp']
        );

        // create token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'User registered successfully. Please check your email for the verification code.',
            'token' => $token,
            'user' => new UserResource($user->load('roles')),
            'otp_expires_in' => 10,
        ], 201);
    }

    /**
     * Log the user out (Revoke token).
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }

    /**
     * Get the authenticated user.
     */
    public function me(Request $request): UserResource
    {
        return new UserResource($request->user());
    }

    /**
     * Legacy user endpoint.
     */
    public function user(Request $request): UserResource
    {
        return new UserResource($request->user());
    }

    /**
     * Update user profile.
     */
    public function updateProfile(Request $request): UserResource
    {
        $user = $request->user();

        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'avatar' => 'nullable|string', // Expecting base64 string
        ]);

        $user->first_name = $validated['first_name'];
        $user->last_name = $validated['last_name'];
        $user->name = $validated['first_name'].' '.$validated['last_name'];

        if (isset($validated['avatar']) && str_starts_with($validated['avatar'], 'data:image')) {
            // Handle base64 avatar upload
            try {
                $imageData = $validated['avatar'];
                $format = strpos($imageData, 'data:image/png') !== false ? 'png' : 'jpg';
                $imageData = str_replace(['data:image/png;base64,', 'data:image/jpeg;base64,', ' '], ['', '', '+'], $imageData);
                $imageName = \Illuminate\Support\Str::uuid().'.'.$format;

                $path = 'homestv/avatars/'.$imageName;
                \Illuminate\Support\Facades\Storage::disk('s3')->put($path, base64_decode($imageData), 'public');

                $user->avatar = \Illuminate\Support\Facades\Storage::disk('s3')->url($path);
            } catch (\Exception $e) {
                \Log::error('Avatar upload failed: '.$e->getMessage());
            }
        }

        $user->save();

        return new UserResource($user->load('roles'));
    }

    /**
     * Change user password.
     */
    public function changePassword(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        if (! Hash::check($validated['current_password'], $user->password)) {
            return response()->json([
                'message' => 'The provided password does not match your current password.',
                'errors' => [
                    'current_password' => ['The provided password does not match your current password.'],
                ],
            ], 422);
        }

        $user->password = Hash::make($validated['new_password']);
        $user->save();

        return response()->json([
            'message' => 'Password changed successfully.',
        ]);
    }
}
