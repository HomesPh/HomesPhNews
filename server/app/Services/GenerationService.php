<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Laravel\Ai\Image;

use function Laravel\Ai\agent;

/**
 * Service for handling AI-powered content generation.
 *
 * This service provides methods for generating text and images using the Laravel AI SDK,
 * and handles the storage of generated assets via the FileService.
 */
class GenerationService
{
    /**
     * Create a new service instance.
     */
    public function __construct(
        protected FileService $fileService
    ) {}

    /**
     * Generate text based on a provided prompt.
     *
     * @param  string  $prompt  The prompt to send to the AI model.
     * @param  array  $options  Configuration options, including:
     *                          - 'instructions': System instructions for the AI agent (default: 'You are a helpful assistant.')
     * @return string|null The generated text or null on failure.
     */
    public function generateText(string $prompt, array $options = []): ?string
    {
        try {
            $instructions = $options['instructions'] ?? 'You are a helpful assistant.';

            Log::info("AI Text generation started with prompt: {$prompt}");

            // Initialize the AI agent with specific instructions
            $agent = agent(
                instructions: $instructions,
            );

            // Prompt the agent and return the result as a string
            $result = (string) $agent->prompt($prompt);

            Log::info('AI Text generation successful.');

            return $result;
        } catch (\Exception $e) {
            Log::error('AI Text generation failed: '.$e->getMessage(), [
                'prompt' => $prompt,
                'exception' => $e,
            ]);

            return null;
        }
    }

    /**
     * Generate images based on a provided prompt and store them.
     *
     * @param  string  $prompt  The visual description for the image generation.
     * @param  array  $options  Configuration options, including:
     *                          - 'count': Number of images to generate (default: 1).
     *                          - 'quality': The desired image quality.
     *                          - 'aspect_ratio': Desired ratio ('square', 'portrait', 'landscape').
     *                          - 'timeout': Max seconds to wait for generation.
     *                          - 'disk': Storage disk to use (default: 'public').
     *                          - 'directory': Directory to store images (default: 'homestv/generated').
     * @return array Returns an array of URLs for the stored images.
     */
    public function generateImage(string $prompt, array $options = []): array
    {
        try {
            Log::info("AI Image generation started with prompt: {$prompt}", ['options' => $options]);

            $count = $options['count'] ?? 1;
            $disk = $options['disk'] ?? config('filesystems.default', 's3');
            $directory = $options['directory'] ?? 'homestv/generated';
            $urls = [];

            for ($i = 0; $i < $count; $i++) {
                // Initialize image generation request
                $image = Image::of($prompt);

                // Apply quality settings if provided
                if (isset($options['quality'])) {
                    $image->quality($options['quality']);
                }

                // Configure aspect ratio based on option
                if (isset($options['aspect_ratio'])) {
                    match ($options['aspect_ratio']) {
                        'square' => $image->square(),
                        'portrait' => $image->portrait(),
                        'landscape' => $image->landscape(),
                        default => null,
                    };
                }

                // Set generation timeout if specified
                if (isset($options['timeout'])) {
                    $image->timeout($options['timeout']);
                }

                // Execute the generation request
                $generated = $image->generate();

                // Check if any images were actually produced
                if ($generated->count() === 0) {
                    Log::warning("AI Image generation iteration {$i} returned no results for prompt: {$prompt}");
                    continue;
                }

                // Upload generated images to storage using FileService
                foreach ($generated->images as $generatedImage) {
                    $result = $this->fileService->uploadRawImage(
                        imageData: $generatedImage->content(),
                        directory: $directory,
                        disk: $disk,
                        extension: 'png',
                        filenamePrefix: 'gen_'
                    );

                    if (isset($result['url'])) {
                        $urls[] = $result['url'];
                    }
                }
            }

            Log::info('AI Image generation successful. Generated '.count($urls).' images.');

            return $urls;
        } catch (\Exception $e) {
            Log::error('AI Image generation failed: '.$e->getMessage(), [
                'prompt' => $prompt,
                'exception' => $e,
            ]);

            return [];
        }
    }
}
