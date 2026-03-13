<?php

namespace App\Console\Commands;

use App\Models\Article;
use App\Models\ArticlePublication;
use App\Models\Site;
use App\Services\RedisArticleService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class PublishScheduledArticles extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'articles:publish-scheduled';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Process and publish scheduled articles based on the Article Publication Scheduler';

    /**
     * Execute the console command.
     */
    public function handle(RedisArticleService $redisService)
    {
        $now = now();
        $this->info("Checking for scheduled articles at: {$now}");

        $pendingPublications = ArticlePublication::where('status', 'pending')
            ->where('scheduled_at', '<=', $now)
            ->get();

        if ($pendingPublications->isEmpty()) {
            $this->info('No articles scheduled for publication at this time.');
            return 0;
        }

        $this->info('Found ' . $pendingPublications->count() . ' articles to process.');

        foreach ($pendingPublications as $publication) {
            $this->processPublication($publication, $redisService);
        }

        return 0;
    }

    /**
     * Process a single article publication.
     */
    protected function processPublication(ArticlePublication $publication, RedisArticleService $redisService)
    {
        $id = $publication->article_id;
        $this->info("Processing: {$publication->title} (ID: {$id})");

        try {
            DB::beginTransaction();

            // 1. Resolve Article Data
            $existing = Article::where('id', $id)->first();
            $redisArticle = $redisService->getArticle($id);

            if (!$existing && !$redisArticle) {
                $this->error("Article data not found for ID: {$id}");
                $publication->update([
                    'status' => 'failed',
                    'error_message' => 'Article source data not found in Database or Redis.'
                ]);
                DB::commit();
                return;
            }

            // 2. Prepare Data for Persistence
            // Use same hierarchy as ArticleController: Payload > DB > Redis
            $finalData = [
                'status' => 'published',
                'is_deleted' => false,
                'edited_by' => null, // Cron job has no auth user
            ];

            if ($redisArticle) {
                $finalData = array_merge($finalData, [
                    'title' => $redisArticle['title'] ?? $publication->title,
                    'original_title' => $redisArticle['title'] ?? $publication->title,
                    'summary' => $redisArticle['summary'] ?? $publication->summary ?? substr($redisArticle['content'] ?? '', 0, 500),
                    'content' => $redisArticle['content'] ?? '',
                    'image' => $redisArticle['image_url'] ?? $redisArticle['image'] ?? $publication->image_url,
                    'category' => $redisArticle['category'] ?? $publication->category,
                    'country' => $redisArticle['country'] ?? $publication->country,
                    'source' => $redisArticle['source'] ?? $publication->source,
                    'original_url' => $redisArticle['original_url'] ?? '',
                    'keywords' => $redisArticle['keywords'] ?? '',
                    'topics' => $redisArticle['topics'] ?? [],
                    'content_blocks' => $redisArticle['content_blocks'] ?? [],
                    'template' => $redisArticle['template'] ?? '',
                    'author' => $redisArticle['author'] ?? 'System',
                    'slug' => Str::slug($redisArticle['title'] ?? $publication->title),
                ]);
            }

            if ($existing) {
                $finalData = array_merge($finalData, $existing->toArray());
            }

            // Force publication state
            $finalData['status'] = 'published';
            $finalData['is_deleted'] = false;
            
            // Fillable fields only
            $fillableData = collect($finalData)->only((new Article())->getFillable())->toArray();

            if ($existing) {
                $existing->update($fillableData);
                $article = $existing;
            } else {
                $article = Article::create(array_merge(['id' => $id, 'article_id' => $id], $fillableData));
            }

            // 3. Sync Target Sites
            $siteIds = $publication->target_sites ?? [];
            if (!empty($siteIds)) {
                // Ensure they are IDs
                $article->publishedSites()->sync($siteIds);
            }

            // 4. Update Publication Status
            $publication->update([
                'status' => 'published',
                'published_at' => now(),
                'error_message' => null
            ]);

            // 5. Cleanup Redis
            if ($redisArticle) {
                $redisService->deleteArticle($id);
            }

            DB::commit();
            $this->info("Successfully published: {$publication->title}");
            Log::info("Scheduled publication success: Article {$id} published to sites " . json_encode($siteIds));

        } catch (\Exception $e) {
            DB::rollBack();
            $this->error("Failed to process {$id}: " . $e->getMessage());
            Log::error("Scheduled publication failure: " . $e->getMessage(), ['id' => $id, 'trace' => $e->getTraceAsString()]);
            
            $publication->update([
                'status' => 'failed',
                'error_message' => $e->getMessage()
            ]);
        }
    }
}
