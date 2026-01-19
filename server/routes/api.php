<?php

// routes/api.php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\User\NewsController;
use App\Http\Controllers\Api\Admin\DashboardController; 
use App\Http\Controllers\Api\AuthController;

// Public login route
Route::post('/login', [AuthController::class, 'login']);

// Named route 'login' for unauthenticated redirection
Route::get('/login', function () {
    return response()->json(['message' => 'Unauthenticated.'], 401);
})->name('login');



//To display Trending Topics.
Route::get('/news/trending', [NewsController::class, 'trending']);

//To display Most read.
Route::get('/news/most-read', [NewsController::class, 'mostRead']);

//To display Global news.
Route::get('/news/latest-global', [NewsController::class, 'latestGlobal']);


// This one line creates the GET, POST, PUT/PATCH, and DELETE endpoints
// for your news resource, all prefixed with /api/.
Route::apiResource('news', NewsController::class);


// --- ADMIN ROUTES ---
/*  middleware(['auth:sanctum', 'is.admin']): This is the security. It says a user must first be authenticated via Sanctum 
 (logged in with a token) AND they must pass our is.admin check. */
// This group protects all routes within it.
Route::middleware(['auth:sanctum', 'is.admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        
        // Example Route: GET /api/admin/stats
        Route::get('/stats', [DashboardController::class, 'getStats'])->name('stats');

        // You can add more admin-only routes here in the future
        // For example:
        // Route::post('/news/{news}/publish', ...);
        // Route::get('/users', ...);
    });