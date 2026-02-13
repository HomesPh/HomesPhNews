<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$articleId = 'd2a1c32b-4d2c-4e65-8c53-442db50ad31a';

echo "=================================================\n";
echo "CHECKING PUBLISHED ARTICLE: $articleId\n";
echo "=================================================\n\n";

// 1. Check articles table
$article = \App\Models\Article::find($articleId);

if ($article) {
    echo "✅ FOUND IN 'articles' TABLE\n";
    echo "-----------------------------------\n";
    echo "ID: " . $article->id . "\n";
    echo "Title: " . $article->title . "\n";
    echo "Status: " . $article->status . "\n";
    echo "Category: " . $article->category . "\n";
    echo "Country: " . $article->country . "\n";
    echo "Author: " . ($article->author ?? 'N/A') . "\n";
    echo "Template: " . ($article->template ?? 'N/A') . "\n";
    echo "Content Blocks: " . (is_array($article->content_blocks) ? count($article->content_blocks) . ' blocks' : 'None') . "\n";
    echo "Is Deleted: " . ($article->is_deleted ? 'YES' : 'NO') . "\n";
    echo "Created At: " . $article->created_at . "\n";
    echo "Updated At: " . $article->updated_at . "\n";
    echo "\n";
    
    // 2. Check article_site pivot table (published sites)
    echo "-----------------------------------\n";
    echo "PUBLISHED SITES (article_site table):\n";
    echo "-----------------------------------\n";
    $sites = $article->publishedSites()->get(); // Get the actual collection
    if ($sites->count() > 0) {
        foreach ($sites as $site) {
            echo "  - " . $site->site_name . " (Site ID: " . $site->id . ")\n";
        }
    } else {
        echo "  No sites linked\n";
    }
    echo "\n";
    
    // 3. Check article_images table (gallery images)
    echo "-----------------------------------\n";
    echo "GALLERY IMAGES (article_images table):\n";
    echo "-----------------------------------\n";
    $images = $article->images;
    if ($images->count() > 0) {
        foreach ($images as $img) {
            echo "  - " . $img->image_path . "\n";
        }
    } else {
        echo "  No gallery images\n";
    }
    echo "\n";
    
    // 4. Show content_blocks detail
    if (is_array($article->content_blocks) && count($article->content_blocks) > 0) {
        echo "-----------------------------------\n";
        echo "CONTENT BLOCKS DETAIL:\n";
        echo "-----------------------------------\n";
        foreach ($article->content_blocks as $index => $block) {
            echo "Block " . ($index + 1) . ":\n";
            echo "  Type: " . ($block['type'] ?? 'N/A') . "\n";
            if (isset($block['content'])) {
                $content = is_string($block['content']) ? strip_tags($block['content']) : json_encode($block['content']);
                echo "  Content: " . substr($content, 0, 100) . (strlen($content) > 100 ? '...' : '') . "\n";
            }
            if (isset($block['image'])) {
                echo "  Image: " . $block['image'] . "\n";
            }
            if (isset($block['caption'])) {
                echo "  Caption: " . $block['caption'] . "\n";
            }
            echo "\n";
        }
    }
    
    // 5. Check Redis
    echo "-----------------------------------\n";
    echo "REDIS STATUS:\n";
    echo "-----------------------------------\n";
    $redis = app('redis');
    $redisKey = 'article:' . $articleId;
    $redisData = $redis->get($redisKey);
    if ($redisData) {
        echo "⚠️  STILL IN REDIS (should be deleted after publish)\n";
    } else {
        echo "✅ DELETED FROM REDIS (correct behavior)\n";
    }
    
} else {
    echo "❌ NOT FOUND IN 'articles' TABLE\n";
}

echo "\n=================================================\n";
echo "END OF CHECK\n";
echo "=================================================\n";
