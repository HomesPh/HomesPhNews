<?php

// routes/api.php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\NewsController;

//To display Trending Topics.
Route::get('/news/trending', [NewsController::class, 'trending']);

//To display Most read.
Route::get('/news/most-read', [NewsController::class, 'mostRead']);

//To display Global news.
Route::get('/news/latest-global', [NewsController::class, 'latestGlobal']);


// This one line creates the GET, POST, PUT/PATCH, and DELETE endpoints
// for your news resource, all prefixed with /api/.
Route::apiResource('news', NewsController::class);
