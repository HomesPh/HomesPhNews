<?php

use Illuminate\Support\Facades\Route;

Route::get('/ads/{id}', [App\Http\Controllers\AdDisplayController::class, 'show'])->name('ads.show');

Route::get('/preview-email', function () {
    $subscriber = \App\Models\SubscriptionDetail::first() ?? (object)[
        'sub_Id' => 'preview-sub-id',
        'category' => ['Real Estate', 'Business', 'Technology'],
        'country' => ['Philippines', 'Global'],
        'email' => 'preview@homes.ph'
    ];

    $articles = \App\Models\Article::latest()->take(3)->get();
    
    return new \App\Mail\DailyNewsletterMail($subscriber, $articles);
});