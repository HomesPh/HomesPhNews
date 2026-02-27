<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    /**
     * Handle image upload for articles.
     */
    public function uploadImage(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp|max:5120',
            'type' => 'nullable|string',
        ]);

        $validator->after(function ($validator) use ($request) {
            if ($request->input('type') === 'ad_banner' && $request->hasFile('image') && $request->file('image')->isValid()) {
                $image = $request->file('image');
                $dimensions = getimagesize($image->getRealPath());
                if ($dimensions) {
                    $width = $dimensions[0];
                    $height = $dimensions[1];
                    
                    // Standard IAB Ad Unit Dimensions
                    $validSizes = [
                        [300, 250], // Medium Rectangle
                        [728, 90],  // Leaderboard
                        [160, 600], // Wide Skyscraper
                        [320, 50],  // Mobile Leaderboard
                        [970, 250], // Billboard
                        [300, 600], // Half Page
                        [320, 100], // Large Mobile Banner
                    ];
                    
                    $isValid = false;
                    foreach ($validSizes as $size) {
                        if ($width === $size[0] && $height === $size[1]) {
                            $isValid = true;
                            break;
                        }
                    }
                    
                    if (!$isValid) {
                        $validator->errors()->add('image', "Invalid banner dimensions ({$width}x{$height}px). Allowed fixed sizes are: 300x250, 728x90, 160x600, 320x50, 970x250, 300x600, 320x100.");
                    }
                }
            }
        });

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()], 422);
        }

        try {
            if ($request->hasFile('image')) {
                $file = $request->file('image');
                $filename = Str::uuid().'.'.$file->getClientOriginalExtension();

                // Store in S3 bucket under homestv/articles directory
                $path = $file->storeAs('homestv/articles', $filename, 's3');

                // Construct the full S3 URL
                $url = Storage::disk('s3')->url($path);

                return response()->json([
                    'message' => 'Image uploaded successfully',
                    'url' => $url,
                    'filename' => $filename,
                    'path' => $path,
                ], 200);
            }

            return response()->json(['message' => 'No image file provided'], 400);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Upload failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
