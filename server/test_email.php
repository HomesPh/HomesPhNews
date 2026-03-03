<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\Mail;
use App\Models\SubscriptionDetail;
use App\Models\Article;
use App\Mail\DailyNewsletterMail;

// Get a real subscriber or use a dummy
$subscriber = SubscriptionDetail::first();
if (!$subscriber) {
    die("No subscribers found in DB.\n");
}

// Override email for testing
$testEmail = 'ranidelpadoga@gmail.com'; // User's email from .env or my own if I want to test
echo "Using subscriber: {$subscriber->email} (Overriding to {$testEmail} for test)\n";
$subscriber->email = $testEmail;

// Get some articles
$articles = Article::limit(3)->get();
if ($articles->isEmpty()) {
    die("No articles found in DB.\n");
}

echo "Articles found: " . $articles->count() . "\n";

try {
    echo "Attempting to send email synchronously...\n";
    Mail::to($testEmail)->send(new DailyNewsletterMail($subscriber, $articles));
    echo "✅ Email sent successfully (synchronous).\n";
} catch (\Exception $e) {
    echo "❌ Failed to send email: " . $e->getMessage() . "\n";
    echo "Stack trace: " . $e->getTraceAsString() . "\n";
}
