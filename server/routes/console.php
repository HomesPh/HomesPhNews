<?php

use App\Mail\DailyNewsletterMail;
use App\Models\Article;
// Import the necessary models and mail classes
use App\Models\SubscriptionDetail;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

// routes/console.php

// Send newsletters every minute
Schedule::command('newsletter:send')->everyMinute()->onOneServer();

// Process scheduled article publications every minute
Schedule::command('articles:publish-scheduled')->everyMinute()->onOneServer();

// artisan newsletter:test {email}
// for testing purposes
Artisan::command('newsletter:test {email}', function (string $email) {
    $subscriber = SubscriptionDetail::where('email', $email)->first();
    if (! $subscriber) {
        $this->error('Subscriber not found');

        return;
    }

    $articles = Article::whereIn('category', $subscriber->category ?? [])
        ->whereIn('country', $subscriber->country ?? [])
        ->where('status', 'published')
        ->latest()
        ->limit(5)
        ->get();

    if ($articles->isEmpty()) {
        $this->warn("No articles found matching the preferences for '{$email}'.");

        return;
    }

    try {
        Mail::to($email)->send(new DailyNewsletterMail($subscriber, $articles));
        $this->info("Test newsletter sent successfully to {$email}!");
    } catch (\Exception $e) {
        $this->error('Failed to send: '.$e->getMessage());
    }
})->purpose('Send a test newsletter to a specific email address');
