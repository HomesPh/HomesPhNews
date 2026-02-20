<?php

namespace App\Http\Requests\Articles;

use Illuminate\Foundation\Http\FormRequest;

class ArticleActionRequest extends FormRequest
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
            // Action-related fields
            'published_sites' => 'required|array',
            'published_sites.*' => 'string',
            'custom_titles' => 'nullable|array',
            
            // Article Data fields (Atomic Publish support)
            'title' => 'nullable|string|max:255',
            'summary' => 'nullable|string',
            'content' => 'nullable|string',
            'category' => 'nullable|string',
            'country' => 'nullable|string',
            'image' => 'nullable|string',
            'image_url' => 'nullable|string',
            'topics' => 'nullable|array',
            'keywords' => 'nullable|string',
            'content_blocks' => 'nullable|array',
            'template' => 'nullable|string',
            'author' => 'nullable|string',
            'gallery_images' => 'nullable|array',
            'slug' => 'nullable|string',
            'image_position' => 'nullable|integer',
            'image_position_x' => 'nullable|integer',
        ];
    }
}
