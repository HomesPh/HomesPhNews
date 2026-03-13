<?php

namespace Tests\Unit\Services;

use App\Services\FileService;
use App\Services\GenerationService;
use Illuminate\Support\Facades\Log;
use Laravel\Ai\AnonymousAgent;
use Laravel\Ai\Image;
use Mockery;
use Tests\TestCase;

class GenerationServiceTest extends TestCase
{
    protected GenerationService $service;

    protected $fileServiceMock;

    protected function setUp(): void
    {
        parent::setUp();

        $this->fileServiceMock = Mockery::mock(FileService::class);
        $this->service = new GenerationService($this->fileServiceMock);
    }

    public function test_generate_text_success()
    {
        AnonymousAgent::fake(['Hello from the fake agent!']);
        Log::shouldReceive('info')->twice();

        $result = $this->service->generateText('Hello');

        $this->assertEquals('Hello from the fake agent!', $result);

        AnonymousAgent::assertPrompted('Hello');
    }

    public function test_generate_text_failure_returns_null()
    {
        AnonymousAgent::fake(function () {
            throw new \Exception('API Error');
        });
        Log::shouldReceive('info')->once();
        Log::shouldReceive('error')->once();

        $result = $this->service->generateText('Hello');

        $this->assertNull($result);
    }

    public function test_generate_image_success_with_multiple_images()
    {
        Image::fake();
        Log::shouldReceive('info')->twice();

        $this->fileServiceMock->shouldReceive('uploadRawImage')
            ->twice()
            ->andReturn(['url' => 'https://example.com/image.png']);

        $results = $this->service->generateImage('A futuristic city', [
            'count' => 2,
            'disk' => 's3',
        ]);

        $this->assertCount(2, $results);
        $this->assertEquals('https://example.com/image.png', $results[0]);
        $this->assertEquals('https://example.com/image.png', $results[1]);

        Image::assertGenerated(function ($prompt) {
            return $prompt->contains('A futuristic city');
        });
    }

    public function test_generate_image_failure_returns_empty_array()
    {
        Image::fake();
        Log::shouldReceive('info')->once();
        Log::shouldReceive('error')->once();

        $this->fileServiceMock->shouldReceive('uploadRawImage')
            ->andThrow(new \Exception('Upload failed'));

        $results = $this->service->generateImage('A futuristic city');

        $this->assertIsArray($results);
        $this->assertEmpty($results);
    }
}
