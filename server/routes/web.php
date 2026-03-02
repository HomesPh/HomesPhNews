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

Route::get('/preview-email/welcome-blogger', function () {
    return new \App\Mail\WelcomeBloggerMail(
        'John Doe', 
        'blogger@homes.ph', 
        'password123', 
        env('APP_URL_CLIENT', 'http://localhost:3000') . '/login'
    );
});

Route::get('/preview-email/welcome', function () {
    $articles = \App\Models\Article::latest()->take(3)->get();
    $clientUrl = env('APP_URL_CLIENT', 'http://localhost:3000');
    
    return view('emails.subscription', [
        'subject' => 'Welcome to Homes.ph News Subscription!',
        'title' => 'Successfully Subscribed!',
        'messageText' => 'Thank you for joining Homes.ph News. You will now receive the latest real estate updates tailored to your interests.',
        'email' => 'subscriber@homes.ph',
        'categories' => ['Real Estate', 'Business'],
        'countries' => ['Philippines'],
        'articles' => $articles,
        'clientUrl' => $clientUrl,
        'actionUrl' => $clientUrl . "/subscribe/edit?id=preview-sub-id",
        'actionText' => 'Edit Preferences',
        'subId' => 'preview-sub-id'
    ]);
});

Route::get('/preview-email/welcome-back', function () {
    $clientUrl = env('APP_URL_CLIENT', 'http://localhost:3000');
    
    return view('emails.subscription', [
        'subject' => 'Subscription Already Exists - Homes.ph News',
        'title' => 'Welcome back!',
        'messageText' => 'You are already subscribed to Homes.ph News. We noticed you tried to sign up again, so we\'ve provided a link to manage your current preferences below.',
        'email' => 'subscriber@homes.ph',
        'categories' => ['Real Estate'],
        'countries' => ['Philippines'],
        'articles' => [],
        'clientUrl' => $clientUrl,
        'actionUrl' => $clientUrl . "/subscribe/edit?id=preview-sub-id",
        'actionText' => 'Edit your Preferences',
        'subId' => 'preview-sub-id'
    ]);
});

Route::get('/preview-email/preferences-updated', function () {
    $articles = \App\Models\Article::latest()->take(3)->get();
    $clientUrl = env('APP_URL_CLIENT', 'http://localhost:3000');
    
    return view('emails.subscription', [
        'subject' => 'Preferences Updated - Homes.ph News',
        'title' => 'Preferences Saved!',
        'messageText' => 'Your subscription preferences have been updated successfully. We\'ve selected these latest news pieces based on your new interests.',
        'email' => 'subscriber@homes.ph',
        'categories' => ['Technology', 'Design'],
        'countries' => ['Global'],
        'articles' => $articles,
        'clientUrl' => $clientUrl,
        'actionUrl' => $clientUrl . "/subscribe/edit?id=preview-sub-id",
        'actionText' => 'Manage Preferences',
        'subId' => 'preview-sub-id'
    ]);
});