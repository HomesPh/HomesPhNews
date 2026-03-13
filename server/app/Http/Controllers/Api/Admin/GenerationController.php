<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\ImageGenerationRequest;
use App\Http\Requests\Api\TextGenerationRequest;
use App\Services\GenerationService;
use Illuminate\Http\JsonResponse;

class GenerationController extends Controller
{
    public function __construct(
        protected GenerationService $generationService
    ) {}

    /**
     * Generate text based on a prompt.
     *
     * @param TextGenerationRequest $request
     * @return JsonResponse
     */
    public function text(TextGenerationRequest $request): JsonResponse
    {
        $result = $this->generationService->generateText(
            $request->input('prompt'),
            $request->input('options', [])
        );

        if ($result === null) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to generate text.',
            ], 500);
        }

        return response()->json([
            'status' => 'success',
            'data' => [
                'text' => $result,
            ],
        ]);
    }

    /**
     * Generate images based on a prompt.
     *
     * @param ImageGenerationRequest $request
     * @return JsonResponse
     */
    public function image(ImageGenerationRequest $request): JsonResponse
    {
        $urls = $this->generationService->generateImage(
            $request->input('prompt'),
            $request->input('options', [])
        );

        if (empty($urls)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to generate images.',
            ], 500);
        }

        return response()->json([
            'status' => 'success',
            'data' => [
                'urls' => $urls,
            ],
        ]);
    }
}
