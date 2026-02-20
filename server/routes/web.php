<?php

use Illuminate\Support\Facades\Route;

Route::get('/ads/{id}', [App\Http\Controllers\AdDisplayController::class, 'show'])->name('ads.show');