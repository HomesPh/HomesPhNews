<?php

namespace App\Http\Requests\Articles;

use Illuminate\Foundation\Http\FormRequest;

class UpdateArticleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'nullable|string|max:255',
            'summary' => 'nullable|string|max:1000',
            'content' => 'nullable|string',
            'category' => 'nullable|string|max:50',
            'country' => 'nullable|string|max:100',
            'image' => 'nullable|string|max:2000',
            'image_url' => 'nullable|string|max:2000', // Support both for flexiblity
            'published_sites' => 'nullable|array',
            'published_sites.*' => 'string',
            'status' => 'nullable|string|in:published,pending review,rejected,deleted',
            'custom_titles' => 'nullable|array',
            'topics' => 'nullable|array',
            'keywords' => 'nullable|string|max:255',
            'content_blocks' => 'nullable|array',
            'template' => 'nullable|string',
            'author' => 'nullable|string',
            // Additional fields from editor
            'gallery_images' => 'nullable|array',
            'galleryImages' => 'nullable|array', // Support both naming conventions
            'split_images' => 'nullable|array',
            'date' => 'nullable|string',
            'slug' => 'nullable|string|max:255',
            'image_position' => 'nullable|integer',
            'image_position_x' => 'nullable|integer',
        ];
    }
}
