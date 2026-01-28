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
        $this->info('Starting Daily Newsletter distribution...');

        $subscribers = SubscriptionDetail::all();

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
