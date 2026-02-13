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
use App\Http\Controllers\Api\Admin\CategoryController;
use App\Http\Controllers\Api\Admin\CountryController;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\PlanSubscriptionController;
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
Route::post('/subscribe', [SubscriptionController::class , 'store']);
Route::get('/subscribe/{id}', [SubscriptionController::class , 'show']);
Route::patch('/subscribe/{id}', [SubscriptionController::class , 'update']);
// External Site Content API (Protected by API Key)
Route::middleware('site.auth')->get('/external/articles', [\App\Http\Controllers\Api\SiteContentController::class , 'getArticles']);

// ═══════════════════════════════════════════════════════════════
// SYSTEM ROUTES (Redis Test, Health Check)
// ═══════════════════════════════════════════════════════════════
Route::get('/redis-test', [SystemController::class , 'redisTest']);
Route::get('/db-test', [SystemController::class , 'dbTest']);

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
Route::post('/login', [AuthController::class , 'login'])->middleware('throttle:login');
Route::get('/login', [AuthController::class , 'me'])->middleware('auth:sanctum')->name('login');

// Public registration route
Route::post('/auth/register', [AuthController::class , 'register']);

// Socialite Routes
Route::get('/auth/google/redirect', [\App\Http\Controllers\Api\Auth\SocialAuthController::class , 'redirectToGoogle']);
Route::get('/auth/google/callback', [\App\Http\Controllers\Api\Auth\SocialAuthController::class , 'handleGoogleCallback']);
// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class , 'me']);
    Route::post('/logout', [AuthController::class , 'logout']); // Explicit logout route

    // Plan Subscriptions
    Route::post('/plans/subscribe', [PlanSubscriptionController::class , 'store']);
});

// ═══════════════════════════════════════════════════════════════
// PUBLIC USER ROUTES (Mixed Database and Redis)
// ═══════════════════════════════════════════════════════════════

// Public User Routes
Route::prefix('articles')->name('articles.')->group(function () {
    Route::get('/', [UserArticleController::class , 'index'])->name('index');
    Route::get('/feed', [UserArticleController::class , 'feed'])->name('feed');
    Route::get('/{id}', [UserArticleController::class , 'show'])->name('show');
    Route::post('/{id}/view', [UserArticleController::class , 'incrementViews'])->name('view');
});

// Alias for backward compatibility if needed, or just redirect
Route::get('/article', [UserArticleController::class , 'index']);

// Statistics
Route::get('/stats', [UserArticleController::class , 'stats']);

// Ads (Public)
Route::get('/ads', [UserAdController::class , 'index']);
Route::get('/ads/{name}', [UserAdController::class , 'showByName']);

// ═══════════════════════════════════════════════════════════════
// ADMIN ROUTES (Database-based for article management)
// ═══════════════════════════════════════════════════════════════
/*  middleware(['auth:sanctum', 'is.admin']): This is the security. It says a user must first be authenticated via Sanctum
 (logged in with a token) AND they must pass our is.admin check. */
// This group protects all routes within it.
Route::middleware(['auth:sanctum'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        
        // ═══════════════════════════════════════════════════════════════
        // SHARED ROUTES (Admin & Subscriber)
        // ═══════════════════════════════════════════════════════════════
        Route::middleware('is.authenticated:admin,subscriber')->group(function() {
            Route::get('/stats', [DashboardController::class , 'getStats'])->name('stats');
            Route::get('/analytics', [AnalyticsController::class , 'index'])->name('analytics');
            
            // Read-only article access
            Route::get('articles', [AdminArticleController::class , 'index'])->name('articles.index');
            Route::get('articles/{article}', [AdminArticleController::class , 'show'])->name('articles.show');
            
            // Some shared resources (read-only parts if needed, but for now just basic articles)
            Route::get('sites/names', [SiteController::class , 'names']);
        });

        // ═══════════════════════════════════════════════════════════════
        // ADMIN ONLY ROUTES
        // ═══════════════════════════════════════════════════════════════
        Route::middleware('is.authenticated:admin')->group(function() {
            // CRUD Resources (Excluding what's shared)
            Route::apiResource('article-publications', ArticlePublicationController::class);
            Route::apiResource('sites', SiteController::class)->except(['index']); // site names is shared
            Route::get('sites', [SiteController::class, 'index']); // sites list itself still admin
            
            // Articles CRUD (Excluding shared index/show)
            Route::apiResource('articles', AdminArticleController::class)->except(['index', 'show']);
            
            Route::apiResource('ads', AdminAdController::class);
            Route::apiResource('campaigns', AdminCampaignController::class);
            Route::apiResource('categories', CategoryController::class);
            Route::apiResource('countries', CountryController::class);

            // Custom Article Actions
            Route::patch('articles/{article}/titles', [AdminArticleController::class , 'updateTitles']);
            Route::patch('articles/{id}/pending', [AdminArticleController::class , 'updatePending']);
            Route::post('articles/{id}/publish', [AdminArticleController::class , 'publish']);
            Route::post('articles/{id}/restore', [AdminArticleController::class , 'restore']);

            // Sites Actions
            Route::patch('sites/{id}/toggle-status', [SiteController::class , 'toggleStatus']);
            Route::patch('sites/{id}/refresh-key', [SiteController::class , 'refreshKey']);

            // Restaurants
            Route::get('restaurants/stats', [RestaurantController::class , 'stats'])->name('restaurants.stats');
            Route::get('restaurants/country/{country}', [RestaurantController::class , 'byCountry'])->name('restaurants.byCountry');
            Route::post('restaurants/{id}/publish', [RestaurantController::class , 'publish'])->name('restaurants.publish');
            Route::apiResource('restaurants', RestaurantController::class);

            // Upload
            Route::post('upload/image', [UploadController::class , 'uploadImage'])->name('upload.image');
        });
    });
