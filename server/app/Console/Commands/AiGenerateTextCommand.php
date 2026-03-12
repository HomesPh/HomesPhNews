<?php

namespace App\Console\Commands;

use App\Services\GenerationService;
use Illuminate\Console\Command;

class AiGenerateTextCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'ai:generate-text 
                            {prompt : The prompt for text generation} 
                            {--instructions= : System instructions for the AI agent}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate text using AI';

    /**
     * Execute the console command.
     */
    public function handle(GenerationService $service)
    {
        $prompt = $this->argument('prompt');
        $options = [
            'instructions' => $this->option('instructions'),
        ];

        // Filter out null options
        $options = array_filter($options, fn($value) => !is_null($value));

        $this->info("Generating text for: \"$prompt\"...");

        try {
            $result = $service->generateText($prompt, $options);

            if ($result) {
                $this->info('Text generated successfully:');
                $this->line($result);
            } else {
                $this->error('Failed to generate text. Check logs for details.');
            }
        } catch (\Exception $e) {
            $this->error('Exception: '.$e->getMessage());
        }
    }
}
