<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileService
{
    /**
     * Upload a base64 encoded image to S3.
     *
     * @param  string  $base64Image  Ensure it starts with 'data:image'
     * @param  string  $pathPrefix  e.g. 'homes-ph-news/avatars'
     * @return string|null Returns the S3 URL of the uploaded image on success, or null if regex fails.
     *
     * @throws \Exception
     */
    public function uploadBase64Image(string $base64Image, string $pathPrefix): ?string
    {
        if (preg_match('/^data:image\/(\w+);base64,/', $base64Image, $type)) {
            $imageData = substr($base64Image, strpos($base64Image, ',') + 1);
            $format = strtolower($type[1]); // png, jpeg, etc.

            if (! in_array($format, ['png', 'jpg', 'jpeg', 'gif', 'webp'])) {
                throw new \Exception('Invalid image format.');
            }

            $imageData = base64_decode($imageData);
            if ($imageData === false) {
                throw new \Exception('Base64 decode failed.');
            }

            $imageName = Str::uuid().'.'.$format;
            $path = trim($pathPrefix, '/').'/'.$imageName;

            Storage::disk('s3')->put($path, $imageData, 'public');

            return Storage::disk('s3')->url($path);
        }

        return null;
    }

    /**
     * Upload a standard HTTP file instance to the specified disk.
     *
     * @param  string  $directory  Directory path (e.g. 'homestv/articles' or 'plan-logos')
     * @param  string  $disk  The storage disk to use ('public', 's3', etc.)
     * @param  string|null  $filename  Optional custom filename. If null, a UUID will be generated.
     * @return array Returns an array containing the path, URL, and filename of the uploaded file.
     *
     * @throws \Exception
     */
    public function uploadFile(UploadedFile $file, string $directory, string $disk = 'public', ?string $filename = null): array
    {
        $filename = $filename ?? Str::uuid().'.'.$file->getClientOriginalExtension();

        $path = $file->storeAs($directory, $filename, $disk);

        if (! $path) {
            throw new \Exception("Failed to upload file to {$disk} disk.");
        }

        $url = Storage::disk($disk)->url($path);

        return [
            'path' => $path,
            'url' => $url,
            'filename' => $filename,
        ];
    }

    /**
     * Upload raw binary image data to the specified disk.
     *
     * @param  string  $imageData  The raw binary image data.
     * @param  string  $directory  Directory path (e.g. 'homes-ph-news/avatars')
     * @param  string  $disk  The storage disk to use ('public', 's3', etc.)
     * @param  string  $extension  File extension (e.g. 'png', 'webp')
     * @return array Returns an array containing the path, URL, and filename of the uploaded file.
     *
     * @throws \Exception
     */
    public function uploadRawImage(string $imageData, string $directory, string $disk = 'public', string $extension = 'webp', string $filenamePrefix = ''): array
    {
        $filename = $filenamePrefix . Str::uuid().'.'.$extension;
        $path = trim($directory, '/').'/'.$filename;

        $success = Storage::disk($disk)->put($path, $imageData, 'public');

        if (! $success) {
            throw new \Exception("Failed to upload raw image to {$disk} disk.");
        }

        $url = Storage::disk($disk)->url($path);

        return [
            'path' => $path,
            'url' => $url,
            'filename' => $filename,
        ];
    }
}
