<?php

use App\Http\Controllers\Api\Admin\AdUnitController as AdminAdUnitController;
use App\Http\Controllers\Api\Admin\AnalyticsController;
use App\Http\Controllers\Api\Admin\ArticleController as AdminArticleController;
// Admin Controllers
use App\Http\Controllers\Api\Admin\ArticlePublicationController;
use App\Http\Controllers\Api\Admin\CampaignController as AdminCampaignController;
use App\Http\Controllers\Api\Admin\CategoryController;
use App\Http\Controllers\Api\Admin\CountryController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\RestaurantController as AdminRestaurantController;
use App\Http\Controllers\Api\Admin\MailingListGroupController;
use App\Http\Controllers\Api\Admin\SiteController;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Auth\SocialAuthController;
use App\Http\Controllers\Api\PlanSubscriptionController;
// User Controllers
use App\Http\Controllers\Api\SiteContentController;
use App\Http\Controllers\Api\SubscriptionController;
use App\Http\Controllers\Api\SystemController;
// Other Controllers
use App\Http\Controllers\Api\UploadController;
use App\Http\Controllers\Api\User\AdController as UserAdController;
use App\Http\Controllers\Api\User\ArticleController as UserArticleController;
use App\Http\Controllers\Api\User\RestaurantController as UserRestaurantController;
use App\Http\Controllers\v2\ArticleController as ArticleControllerV2;
// v2 Controllers
use App\Http\Controllers\v2\AuthController as AuthControllerV2;
use App\Http\Controllers\v2\RoleController as RoleControllerV2;
use App\Http\Controllers\v2\UserController as UserControllerV2;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Versions
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| External Site Routes
|--------------------------------------------------------------------------
|
| Version-independent routes for external site integration.
|
*/
Route::middleware('site.auth')->prefix('external')->group(function () {
    Route::get('/articles', [SiteContentController::class, 'getArticles']);
});

Route::prefix('v1')->group(function () {
    /*
    |--------------------------------------------------------------------------
    | System Routes
    |--------------------------------------------------------------------------
    |
    | Routes for system health checks, testing, and scheduled tasks.
    |
    */

    Route::get('/redis-test', [SystemController::class, 'redisTest']);
    Route::get('/db-test', [SystemController::class, 'dbTest']);

    Route::get('/scheduler/run', function () {
        // ⚠️ Security Note: In production, you should protect this route!
        // Example: if (request('key') !== env('CRON_KEY')) abort(403);

        \Illuminate\Support\Facades\Artisan::call('schedule:run');

        return response()->json([
            'message' => 'Schedule executed',
            'output' => \Illuminate\Support\Facades\Artisan::output(),
        ]);
    });

    /*
    |--------------------------------------------------------------------------
    | Authentication Routes (Public)
    |--------------------------------------------------------------------------
    |
    | Routes for user login, registration, and social authentication.
    |
    */

    // Traditional Auth
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:login');
    Route::post('/auth/register', [AuthController::class, 'register']);

    // Social Auth
    Route::get('/auth/google/redirect', [SocialAuthController::class, 'redirectToGoogle']);
    Route::get('/auth/google/callback', [SocialAuthController::class, 'handleGoogleCallback']);

    /*
    |--------------------------------------------------------------------------
    | Public Data Routes
    |--------------------------------------------------------------------------
    |
    | Routes accessible to the public without authentication.
    |
    */

    // Articles
    Route::group(['prefix' => 'articles', 'as' => 'articles.'], function () {
        Route::get('/', [UserArticleController::class, 'index'])->name('index');
        Route::get('/feed', [UserArticleController::class, 'feed'])->name('feed');
        Route::get('/{id}', [UserArticleController::class, 'show'])->name('show');
        Route::post('/{id}/view', [UserArticleController::class, 'incrementViews'])->name('view');
    });
    // Legacy Article Alias
    Route::get('/article', [UserArticleController::class, 'index']);

    // Stats
    Route::get('/stats', [UserArticleController::class, 'stats']);

    // Ads
    Route::get('/ads', [UserAdController::class, 'index']);
    Route::get('/ads/{name}', [UserAdController::class, 'showByName']);

    // Restaurants
    Route::group(['prefix' => 'restaurants', 'as' => 'restaurants.'], function () {
        Route::get('/', [UserRestaurantController::class, 'index'])->name('index');
        Route::get('/{id}', [UserRestaurantController::class, 'show'])->name('show');
        Route::get('/country/{country}', [UserRestaurantController::class, 'byCountry'])->name('byCountry');
    });

    // Subscription (Newsletter/Updates)
    Route::post('/subscribe', [SubscriptionController::class, 'store']);
    Route::get('/subscribe/{id}', [SubscriptionController::class, 'show']);
    Route::patch('/subscribe/{id}', [SubscriptionController::class, 'update']);

    /*
    |--------------------------------------------------------------------------
    | Authenticated User Routes
    |--------------------------------------------------------------------------
    |
    | Routes requiring the user to be logged in (Sanctum).
    |
    */

    Route::middleware('auth:sanctum')->group(function () {
        // User Info
        Route::get('/user', [AuthController::class, 'me']);
        Route::get('/login', [AuthController::class, 'me'])->name('login'); // Re-using me endpoint for check

        // Auth Actions
        Route::post('/logout', [AuthController::class, 'logout']);

        // Plan Subscriptions
        Route::post('/plans/subscribe', [PlanSubscriptionController::class, 'store']);
    });

    /*
    |--------------------------------------------------------------------------
    | Admin Routes
    |--------------------------------------------------------------------------
    |
    | Routes requiring authentication AND admin privileges.
    |
    */

    Route::middleware(['auth:sanctum', 'is.authenticated:admin'])
        ->prefix('admin')
        ->name('admin.')
        ->group(function () {

            // Dashboard & Analytics
            Route::get('/stats', [DashboardController::class, 'getStats'])->name('stats');
            Route::get('/analytics', [AnalyticsController::class, 'index'])->name('analytics');
            Route::get('/analytics/mailing-list', [AnalyticsController::class, 'mailingListStats']);

            // Resources
            Route::apiResource('article-publications', ArticlePublicationController::class);
            Route::apiResource('articles', AdminArticleController::class);
            Route::apiResource('campaigns', AdminCampaignController::class);
            Route::apiResource('ad-units', AdminAdUnitController::class);
            Route::apiResource('categories', CategoryController::class);
            Route::apiResource('countries', CountryController::class);
            // Resource Routes
            Route::get('sites/names', [SiteController::class, 'names']);
            Route::apiResource('sites', SiteController::class);
            Route::apiResource('mailing-list-groups', MailingListGroupController::class);

            Route::get('restaurants/stats', [AdminRestaurantController::class, 'stats'])->name('restaurants.stats');
            Route::get('restaurants/country/{country}', [AdminRestaurantController::class, 'byCountry'])->name('restaurants.byCountry');
            Route::apiResource('restaurants', AdminRestaurantController::class);

            // Additional Management
            Route::patch('sites/{id}/toggle-status', [SiteController::class, 'toggleStatus']);
            Route::patch('sites/{id}/refresh-key', [SiteController::class, 'refreshKey']);

            // Article Actions
            Route::patch('articles/{article}/titles', [AdminArticleController::class, 'updateTitles']);
            Route::patch('articles/{id}/pending', [AdminArticleController::class, 'updatePending']);
            Route::post('articles/{id}/publish', [AdminArticleController::class, 'publish']);
            Route::post('articles/{id}/restore', [AdminArticleController::class, 'restore']);
            Route::post('articles/{id}/send-newsletter', [AdminArticleController::class, 'sendToSubscribers']);
            Route::post('articles/bulk-send-newsletter', [AdminArticleController::class, 'bulkSend']);
            Route::get('subscribers', [AdminArticleController::class, 'getSubscribers']);
            Route::delete('articles/{id}/hard-delete', [AdminArticleController::class, 'hardDelete']);

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
});