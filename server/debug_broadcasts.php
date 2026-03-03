<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$b = \App\Models\MailingListBroadcast::orderByDesc('sent_at')->first();

if ($b) {
    echo "ID: " . $b->id . "\n";
    echo "Article IDs: " . json_encode($b->article_ids) . "\n";
    echo "Recipient Count: " . $b->recipient_count . "\n";
    echo "Type: " . $b->type . "\n";
} else {
    echo "No broadcasts found.\n";
}
