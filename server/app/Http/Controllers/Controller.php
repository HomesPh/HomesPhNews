<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use OpenApi\Attributes as OA;

#[OA\Info(
    version: "1.0.0",
    title: "Laravel Article API Documentation",
    description: "This is the central API documentation for the article management system, including both user and admin endpoints.",
    contact: new OA\Contact(email: "support@yourapi.com")
)]
#[OA\Server(
    url: "http://localhost:8000",
    description: "Local Development Server"
)]
#[OA\SecurityScheme(
    securityScheme: "sanctum",
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
    description: "Enter your Bearer token in the format 'Bearer {token}'"
)]
#[OA\Get(
    path: "/api/health",
    summary: "Health check",
    responses: [
        new OA\Response(response: 200, description: "OK")
    ]
)]
class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;
}
