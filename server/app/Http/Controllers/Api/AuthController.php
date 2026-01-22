<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use OpenApi\Attributes as OA;

class AuthController extends Controller
{
    #[OA\Post(
        path: "/api/login",
        operationId: "authLogin",
        summary: "Log in a user",
        description: "Authenticates a user with email and password and returns a Sanctum token.",
        tags: ["Authentication"],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["email", "password"],
                properties: [
                    new OA\Property(property: "email", type: "string", format: "email", example: "admin@example.com"),
                    new OA\Property(property: "password", type: "string", format: "password", example: "password")
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: "Successful login",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "access_token", type: "string", example: "1|abcdef12345..."),
                        new OA\Property(property: "token_type", type: "string", example: "Bearer")
                    ]
                )
            ),
            new OA\Response(response: 401, description: "Invalid login details"),
            new OA\Response(response: 422, description: "Validation error")
        ]
    )]
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid login details'
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    #[OA\Post(
        path: "/api/logout",
        operationId: "authLogout",
        summary: "Log out the authenticated user",
        description: "Revokes the current user's access token.",
        security: [['sanctum' => []]],
        tags: ["Authentication"],
        responses: [
            new OA\Response(
                response: 200,
                description: "Successfully logged out",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "message", type: "string", example: "Logged out successfully")
                    ]
                )
            ),
            new OA\Response(response: 401, description: "Unauthenticated")
        ]
    )]
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }

    #[OA\Get(
        path: "/api/user",
        operationId: "getAuthenticatedUser",
        summary: "Get authenticated user details",
        description: "Returns the details of the currently authenticated user.",
        security: [['sanctum' => []]],
        tags: ["Authentication"],
        responses: [
            new OA\Response(
                response: 200,
                description: "User details retrieved successfully",
                content: new OA\JsonContent(type: "object")
            ),
            new OA\Response(response: 401, description: "Unauthenticated")
        ]
    )]
    public function user(Request $request)
    {
        return response()->json($request->user());
    }
}
