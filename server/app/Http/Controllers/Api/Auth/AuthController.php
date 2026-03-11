<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Controller to manage user authentication, registration, and profile updates.
 */
class AuthController extends Controller
{
    /** @var AuthService */
    protected $authService;

    /**
     * Create a new AuthController instance.
     */
    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    /**
     * Authenticate user and return token.
     *
     * @group Authentication
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $result = $this->authService->login($validated['email'], $validated['password']);

        if (! $result) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        return response()->json($result);
    }

    /**
     * Register a new user
     *
     * Creates a new subscriber account and automatically sends a verification OTP
     * to the user's email address.
     *
     * @group Authentication
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $result = $this->authService->register($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'User registered successfully. Please check your email for the verification code.',
            ...$result,
        ], 201);
    }

    /**
     * Log the user out (Revoke token).
     *
     * @group Authentication
     */
    public function logout(Request $request): JsonResponse
    {
        $this->authService->logout($request->user());

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }

    /**
     * Get the currently authenticated user's information.
     *
     * @group User Profile
     */
    public function me(Request $request): UserResource
    {
        return new UserResource($request->user());
    }

    /**
     * Return user details for legacy client compatibility.
     *
     * @group User Profile
     */
    public function user(Request $request): UserResource
    {
        return new UserResource($request->user());
    }

    /**
     * Update the authenticated user's profile information.
     *
     * @return UserResource Updated user resource.
     *
     * @group User Profile
     */
    public function updateProfile(Request $request): UserResource
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'avatar' => 'nullable|string', // Expecting base64 string
        ]);

        return $this->authService->updateProfile($request->user(), $validated);
    }

    /**
     * Update the authenticated user's password.
     *
     * @group User Profile
     */
    public function changePassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        $success = $this->authService->changePassword($request->user(), $validated['current_password'], $validated['new_password']);

        if (! $success) {
            return response()->json([
                'message' => 'The provided password does not match your current password.',
                'errors' => [
                    'current_password' => ['The provided password does not match your current password.'],
                ],
            ], 422);
        }

        return response()->json([
            'message' => 'Password changed successfully.',
        ]);
    }
}
