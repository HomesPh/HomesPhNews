<?php

// routes/api.php
use Illuminate\Support\Facades\Route;
// ✅ CORRECT CONTROLLER: Import the Admin Article Controller
use App\Http\Controllers\Api\Admin\ArticleController as AdminArticleController;
use App\Http\Controllers\Api\User\ArticleController as UserArticleController;
use App\Http\Controllers\Api\Admin\DashboardController; 
use App\Http\Controllers\Api\AuthController;


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
//To display dynamic feed of Trending, Most Read, Latest Global
// Filtered by params: country, category, search
Route::get('/article', [UserArticleController::class, 'feed']);

// REMOVED: All other individual article routes per user request.
// (search, trending, most-read, latest-global, apiResource)


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