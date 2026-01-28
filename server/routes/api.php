<?php

// routes/api.php
use App\Http\Controllers\Api\Admin\AnalyticsController;
// ✅ CORRECT CONTROLLER: Import the Admin Article Controller
use App\Http\Controllers\Api\Admin\ArticleController as AdminArticleController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\EventController;
use App\Http\Controllers\Api\Admin\SiteController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SystemController;
use App\Http\Controllers\Api\UploadController;
use App\Http\Controllers\Api\User\ArticleController as UserArticleController;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Route;

// ═══════════════════════════════════════════════════════════════
// SYSTEM ROUTES (Redis Test, Health Check)
// ═══════════════════════════════════════════════════════════════
Route::get('/redis-test', [SystemController::class, 'redisTest']);
Route::get('/db-test', [SystemController::class, 'dbTest']);

// Public login route
Route::post('/login', [AuthController::class, 'login']);
Route::get('/login', [AuthController::class, 'me'])->middleware('auth:sanctum')->name('login');

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']); // Explicit logout route
});

// ═══════════════════════════════════════════════════════════════
// PUBLIC USER ROUTES (Mixed Database and Redis)
// ═══════════════════════════════════════════════════════════════

// Public User Routes
Route::prefix('articles')->name('articles.')->group(function () {
    Route::get('/', [UserArticleController::class, 'index'])->name('index');
    Route::get('/feed', [UserArticleController::class, 'feed'])->name('feed');
    Route::get('/{id}', [UserArticleController::class, 'show'])->name('show');
    Route::post('/{id}/view', [UserArticleController::class, 'incrementViews'])->name('view');
});

// Alias for backward compatibility if needed, or just redirect
Route::get('/article', [UserArticleController::class, 'index']);

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

        // Upload Routes
        Route::post('upload/image', [UploadController::class, 'uploadImage'])->name('upload.image');
    });
