<?php

// routes/api.php
use Illuminate\Support\Facades\Route;
// ✅ CORRECT CONTROLLER: Import the Admin Article Controller
use App\Http\Controllers\Api\Admin\ArticleController as AdminArticleController;
use App\Http\Controllers\Api\User\ArticleController as UserArticleController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SystemController;
<<<<<<< HEAD
=======
use App\Http\Controllers\Api\Admin\AnalyticsController;
use App\Http\Controllers\Api\Admin\SiteController;
>>>>>>> 3e458db86278defe7c34f434fba335bbe52f034d
use Illuminate\Support\Facades\Redis;


// ═══════════════════════════════════════════════════════════════
// SYSTEM ROUTES (Redis Test, Health Check)
// ═══════════════════════════════════════════════════════════════
Route::get('/redis-test', [SystemController::class, 'redisTest']);
Route::get('/db-test', [SystemController::class, 'dbTest']);


// Public login route
Route::post('/login', [AuthController::class, 'login']);

Route::get('/login', function (Illuminate\Http\Request $request) {
    // Check if the request has a valid token
    $user = Auth::guard('sanctum')->user();

    if ($user) {
        return response()->json($user);
    }

    return response()->json(['message' => 'Unauthenticated.'], 401);
})->name('login');

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
});


// ═══════════════════════════════════════════════════════════════
// PUBLIC USER ROUTES (Redis-based - Python Script is Source of Truth)
// ═══════════════════════════════════════════════════════════════

// Main feed endpoint with filtering
Route::get('/article', [UserArticleController::class, 'feed']);

// All articles with pagination
Route::get('/articles', [UserArticleController::class, 'index']);

// Single article by ID (UUID from Python)
Route::get('/articles/{id}', [UserArticleController::class, 'show'])
    ->where('id', '[a-f0-9\-]{36}'); // UUID pattern

// Articles by country (e.g., /api/articles/country/Philippines)
Route::get('/articles/country/{country}', [UserArticleController::class, 'byCountry']);

// Articles by category (e.g., /api/articles/category/Real Estate)
Route::get('/articles/category/{category}', [UserArticleController::class, 'byCategory'])
    ->where('category', '[a-zA-Z0-9\s]+'); // Allow spaces

// Latest articles sorted by time
Route::get('/latest', [UserArticleController::class, 'latest']);

// Search articles
Route::get('/search', [UserArticleController::class, 'search']);

// Metadata: List all countries
Route::get('/countries', [UserArticleController::class, 'countries']);

// Metadata: List all categories
Route::get('/categories', [UserArticleController::class, 'categories']);

// Statistics
Route::get('/stats', [UserArticleController::class, 'stats']);


// ═══════════════════════════════════════════════════════════════
// ADMIN ROUTES (Database-based for article management)
// ═══════════════════════════════════════════════════════════════
/*  middleware(['auth:sanctum', 'is.admin']): This is the security. It says a user must first be authenticated via Sanctum 
 (logged in with a token) AND they must pass our is.admin check. */
// This group protects all routes within it.
Route::middleware(['auth:sanctum', 'is.admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

        // Example Route: GET /api/admin/stats
        Route::get('/stats', [DashboardController::class, 'getStats'])->name('stats');
        Route::get('/analytics', [AnalyticsController::class, 'index'])->name('analytics');
        Route::get('/sites-analytics', [SiteController::class, 'index'])->name('sites-analytics');
        Route::post('/sites', [SiteController::class, 'store'])->name('sites.store');

        Route::get('articles', [AdminArticleController::class, 'index']);
        // You can add more admin-only routes here in the future
        // For example:
        // Route::post('/news/{news}/publish', ...);
        // Route::get('/users', ...);
        Route::post('articles', [AdminArticleController::class, 'store']);

        // The {article} wildcard name must match the variable name in the show() method
        Route::get('articles/{article}', [AdminArticleController::class, 'show']);
        Route::patch('articles/{article}', [AdminArticleController::class, 'update']);
        Route::patch('articles/{article}/titles', [AdminArticleController::class, 'updateTitles']);
    });