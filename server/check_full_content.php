<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$articleId = 'd995deca-d73d-4336-9bca-68c30e0957c9';
$article = \App\Models\Article::find($articleId);

if ($article) {
    echo "Full Content:\n";
    echo $article->content . "\n";
    echo "\nContent Blocks:\n";
    print_r($article->content_blocks);
}
