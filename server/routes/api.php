<?php

// routes/api.php
use App\Http\Controllers\Api\Admin\AdController as AdminAdController;
// ✅ CORRECT CONTROLLER: Import the Admin Article Controller
use App\Http\Controllers\Api\Admin\AnalyticsController;
use App\Http\Controllers\Api\Admin\ArticleController as AdminArticleController;
use App\Http\Controllers\Api\Admin\ArticlePublicationController;
// use App\Http\Controllers\Api\Admin\EventController;
use App\Http\Controllers\Api\Admin\CampaignController as AdminCampaignController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\RestaurantController;
use App\Http\Controllers\Api\Admin\SiteController;
use App\Http\Controllers\Api\PlanSubscriptionController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SubscriptionController;
use App\Http\Controllers\Api\SystemController;
use App\Http\Controllers\Api\UploadController;
use App\Http\Controllers\Api\User\AdController as UserAdController;
use App\Http\Controllers\Api\User\ArticleController as UserArticleController;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Route;

// ═══════════════════════════════════════════════════════════════
// PUBLIC SUBSCRIPTION ROUTE
// ═══════════════════════════════════════════════════════════════
Route::post('/subscribe', [SubscriptionController::class, 'store']);
Route::get('/subscribe/{id}', [SubscriptionController::class, 'show']);
Route::patch('/subscribe/{id}', [SubscriptionController::class, 'update']);
// External Site Content API (Protected by API Key)
Route::middleware('site.auth')->get('/external/articles', [\App\Http\Controllers\Api\SiteContentController::class, 'getArticles']);

// ═══════════════════════════════════════════════════════════════
// SYSTEM ROUTES (Redis Test, Health Check)
// ═══════════════════════════════════════════════════════════════
Route::get('/redis-test', [SystemController::class, 'redisTest']);
Route::get('/db-test', [SystemController::class, 'dbTest']);

// ═══════════════════════════════════════════════════════════════
// SCHEDULER ROUTE (For Cloud Run / Cron Jobs)
// ═══════════════════════════════════════════════════════════════
Route::get('/scheduler/run', function () {
    // ⚠️ Security Note: In production, you should protect this route!
    // Example: if (request('key') !== env('CRON_KEY')) abort(403);

    \Illuminate\Support\Facades\Artisan::call('schedule:run');

    return response()->json([
        'message' => 'Schedule executed',
        'output' => \Illuminate\Support\Facades\Artisan::output(),
    ]);
});

// Public login route
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:login');
Route::get('/login', [AuthController::class, 'me'])->middleware('auth:sanctum')->name('login');

// Public registration route
Route::post('/auth/register', [AuthController::class, 'register']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']); // Explicit logout route
    
    // Plan Subscriptions
    Route::post('/plans/subscribe', [PlanSubscriptionController::class, 'store']);
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

// Ads (Public)
Route::get('/ads', [UserAdController::class, 'index']);
Route::get('/ads/{name}', [UserAdController::class, 'showByName']);

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
        // Route::apiResource('events', EventController::class);
        Route::apiResource('article-publications', ArticlePublicationController::class);

        Route::get('sites/names', [SiteController::class, 'names']);
        Route::patch('sites/{id}/toggle-status', [SiteController::class, 'toggleStatus']);
        Route::patch('sites/{id}/refresh-key', [SiteController::class, 'refreshKey']);
        Route::apiResource('sites', SiteController::class);
        Route::apiResource('articles', AdminArticleController::class);
        Route::apiResource('ads', AdminAdController::class);
        Route::apiResource('campaigns', AdminCampaignController::class);

        // Custom Article Actions
        Route::patch('articles/{article}/titles', [AdminArticleController::class, 'updateTitles']);
        // Edit pending (Redis) article without touching the main database
        Route::patch('articles/{id}/pending', [AdminArticleController::class, 'updatePending']);
        // Publish pending article (Redis → MySQL, then delete from Redis)
        Route::post('articles/{id}/publish', [AdminArticleController::class, 'publish']);
        // Restore soft-deleted article
        Route::post('articles/{id}/restore', [AdminArticleController::class, 'restore']);

        // ═══════════════════════════════════════════════════════════════
        // RESTAURANT ROUTES (Redis-based & Database Persistence)
        // ═══════════════════════════════════════════════════════════════
        Route::get('restaurants/stats', [RestaurantController::class, 'stats'])->name('restaurants.stats');
        Route::get('restaurants/country/{country}', [RestaurantController::class, 'byCountry'])->name('restaurants.byCountry');
        Route::post('restaurants/{id}/publish', [RestaurantController::class, 'publish'])->name('restaurants.publish');
        Route::apiResource('restaurants', RestaurantController::class);

        // Upload Routes
        Route::post('upload/image', [UploadController::class, 'uploadImage'])->name('upload.image');
    });
