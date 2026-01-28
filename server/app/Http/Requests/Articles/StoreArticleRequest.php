<?php

namespace App\Http\Requests\Articles;

use Illuminate\Foundation\Http\FormRequest;

class StoreArticleRequest extends FormRequest
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
            'title' => 'required|string|max:255',
            'summary' => 'required|string|max:1000',
            'content' => 'required|string',
            'category' => 'required|string|max:50',
            'country' => 'required|string|max:100',
            'image' => 'nullable|string|max:500',
            'published_sites' => 'nullable|array',
            'published_sites.*' => 'string',
            'status' => 'nullable|string|in:published,pending review',
            'topics' => 'nullable|array',
        ];
    }
}
