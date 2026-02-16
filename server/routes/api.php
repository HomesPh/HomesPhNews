<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Redis;

// Auth Controllers
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Auth\SocialAuthController;

// Admin Controllers
use App\Http\Controllers\Api\Admin\AdController as AdminAdController;
use App\Http\Controllers\Api\Admin\AnalyticsController;
use App\Http\Controllers\Api\Admin\ArticleController as AdminArticleController;
use App\Http\Controllers\Api\Admin\ArticlePublicationController;
use App\Http\Controllers\Api\Admin\CampaignController as AdminCampaignController;
use App\Http\Controllers\Api\Admin\CategoryController;
use App\Http\Controllers\Api\Admin\CountryController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\RestaurantController as AdminRestaurantController;
use App\Http\Controllers\Api\Admin\SiteController;

// User Controllers
use App\Http\Controllers\Api\User\AdController as UserAdController;
use App\Http\Controllers\Api\User\ArticleController as UserArticleController;
use App\Http\Controllers\Api\User\RestaurantController as UserRestaurantController;

// Other Controllers
use App\Http\Controllers\Api\PlanSubscriptionController;
use App\Http\Controllers\Api\SiteContentController;
use App\Http\Controllers\Api\SubscriptionController;
use App\Http\Controllers\Api\SystemController;
use App\Http\Controllers\Api\UploadController;


// v2 Controllers
use App\Http\Controllers\v2\AuthController as AuthControllerV2;
use App\Http\Controllers\v2\RoleController as RoleControllerV2;
use App\Http\Controllers\v2\UserController as UserControllerV2;

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

            // Resources
            Route::apiResource('article-publications', ArticlePublicationController::class);
            Route::apiResource('articles', AdminArticleController::class);
            Route::apiResource('ads', AdminAdController::class);
            Route::apiResource('campaigns', AdminCampaignController::class);
            Route::apiResource('categories', CategoryController::class);
            Route::apiResource('countries', CountryController::class);
            // Resource Routes
            Route::get('sites/names', [SiteController::class, 'names']);
            Route::apiResource('sites', SiteController::class);
            
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

            // Restaurant Actions
            Route::post('restaurants/{id}/publish', [AdminRestaurantController::class, 'publish'])->name('restaurants.publish');

            // Uploads
            Route::post('upload/image', [UploadController::class, 'uploadImage'])->name('upload.image');
        });

});

Route::prefix('v2')->group(function () {
    // Auth Routes
    Route::prefix('auth')->group(function () {
        Route::post('/login', [AuthControllerV2::class, 'login']);
        Route::post('/register', [AuthControllerV2::class, 'register']);
    });
    
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthControllerV2::class, 'logout']);
        Route::get('/user', [AuthControllerV2::class, 'me']);
        
        // Roles
        Route::apiResource('roles', RoleControllerV2::class);
        
        // Users
        Route::apiResource('users', UserControllerV2::class);
    });
});
