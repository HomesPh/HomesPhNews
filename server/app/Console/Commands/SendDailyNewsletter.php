<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\SubscriptionDetail;
use App\Models\Article;
use App\Mail\DailyNewsletterMail;
use Illuminate\Support\Facades\Mail;

class SendDailyNewsletter extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'newsletter:send';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send tailored daily news to subscribers at 8:00 AM';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $currentTime = now()->format('H:i');
        $defaultTime = '08:00'; // Users with no time set will receive at this hour

        $this->info("Starting Newsletter distribution for time: {$currentTime}...");

        // Get subscribers who:
        // 1. Specifically requested this time OR
        // 2. Have no time set (only if it's the default 08:00 AM)
        $subscribers = SubscriptionDetail::where(function($query) use ($currentTime, $defaultTime) {
                $query->where('time', $currentTime);
                
                if ($currentTime === $defaultTime) {
                    $query->orWhereNull('time')
                          ->orWhere('time', '');
                }
            })
            ->where(function($query) {
                // Treat 'daily', empty string, or null as daily frequency
                $query->where('frequency', 'daily')
                      ->orWhere('frequency', '')
                      ->orWhereNull('frequency');
            })
            ->get();

        if ($subscribers->isEmpty()) {
            $this->info('No subscribers scheduled for this time.');
            return;
        }

        foreach ($subscribers as $subscriber) {
            // Find articles matching subscriber preferences
            $articles = Article::whereIn('category', $subscriber->category)
                ->whereIn('country', $subscriber->country)
                ->where('status', 'published')
                ->latest()
                ->limit(5)
                ->get();

            if ($articles->isNotEmpty()) {
                try {
                    Mail::to($subscriber->email)->send(new DailyNewsletterMail($subscriber, $articles));
                    $this->info("Newsletter sent to: {$subscriber->email}");
                } catch (\Exception $e) {
                    $this->error("Failed to send to {$subscriber->email}: " . $e->getMessage());
                }
            } else {
                $this->warn("No matching articles for {$subscriber->email}, skipping.");
            }
        }

        $this->info('Daily Newsletter distribution complete!');
    }
}
