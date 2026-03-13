<?php

namespace App\Console\Commands;

use App\Services\GenerationService;
use Illuminate\Console\Command;

class AiGenerateImageCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'ai:generate-image 
                            {prompt : The visual description for the image generation} 
                            {--count=1 : Number of images to generate}
                            {--aspect_ratio= : Aspect ratio (square, portrait, landscape)}
                            {--quality= : Image quality}
                            {--disk=s3 : Storage disk to use}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate images using AI';

    /**
     * Execute the console command.
     */
    public function handle(GenerationService $service)
    {
        $prompt = $this->argument('prompt');
        $options = [
            'count' => (int) $this->option('count'),
            'aspect_ratio' => $this->option('aspect_ratio'),
            'quality' => $this->option('quality'),
            'disk' => $this->option('disk'),
        ];

        // Filter out null options
        $options = array_filter($options, fn ($value) => ! is_null($value));

        $this->info('Generating '.($options['count'] ?? 1)." image(s) for: \"$prompt\"...");

        try {
            $urls = $service->generateImage($prompt, $options);

            if (! empty($urls)) {
                $this->info('Images generated successfully:');
                foreach ($urls as $url) {
                    $this->line(" - $url");
                }
            } else {
                $this->error('Failed to generate image(s). Check logs for details.');
            }
        } catch (\Exception $e) {
            $this->error('Exception: '.$e->getMessage());
        }
    }
}
