<?php

// routes/api.php
use Illuminate\Support\Facades\Route;
// ✅ CORRECT CONTROLLER: Import the Admin Article Controller
use App\Http\Controllers\Api\Admin\ArticleController as AdminArticleController;
use App\Http\Controllers\Api\User\ArticleController as UserArticleController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SystemController;
use App\Http\Controllers\Api\Admin\AnalyticsController;
use App\Http\Controllers\Api\Admin\SiteController;
use App\Http\Controllers\Api\Admin\EventController;
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

// Single article by ID (UUID from Python)
Route::get('/articles/{id}', [UserArticleController::class, 'show'])
    ->where('id', '[a-f0-9\-]{36}'); // UUID pattern




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

        // Reports & Dashboards (Non-CRUD)
        Route::get('/stats', [DashboardController::class, 'getStats'])->name('stats');
        Route::get('/analytics', [AnalyticsController::class, 'index'])->name('analytics');

        // CRUD Resources
        Route::apiResource('events', EventController::class);

        Route::get('sites/names', [SiteController::class, 'names']);
        Route::patch('sites/{id}/toggle-status', [SiteController::class, 'toggleStatus']);
        Route::apiResource('sites', SiteController::class);
        Route::apiResource('articles', AdminArticleController::class)->except(['destroy']);

        // Custom Article Actions
        Route::patch('articles/{article}/titles', [AdminArticleController::class, 'updateTitles']);
        // Edit pending (Redis) article without touching the main database
        Route::patch('articles/{id}/pending', [AdminArticleController::class, 'updatePending']);
        // Publish pending article (Redis → MySQL, then delete from Redis)
        Route::post('articles/{id}/publish', [AdminArticleController::class, 'publish']);
        // Reject pending article (Redis → MySQL with rejected status, then delete from Redis)
        Route::post('articles/{id}/reject', [AdminArticleController::class, 'reject']);
    });