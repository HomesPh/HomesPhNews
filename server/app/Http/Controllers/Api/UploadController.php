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
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()], 422);
        }

        try {
            if ($request->hasFile('image')) {
                $file = $request->file('image');
                $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
                
                // Store in public/articles directory
                $path = $file->storeAs('articles', $filename, 'public');
                
                // Construct the full URL
                $url = asset('storage/' . $path);
                
                return response()->json([
                    'message' => 'Image uploaded successfully',
                    'url' => $url,
                    'filename' => $filename,
                    'path' => $path
                ], 200);
            }

            return response()->json(['message' => 'No image file provided'], 400);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Upload failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
