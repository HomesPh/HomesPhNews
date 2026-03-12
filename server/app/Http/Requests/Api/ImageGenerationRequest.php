<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class ImageGenerationRequest extends FormRequest
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
            'prompt' => 'required|string',
            'options' => 'nullable|array',
            'options.count' => 'nullable|integer|min:1|max:4',
            'options.quality' => 'nullable|string',
            'options.aspect_ratio' => 'nullable|string|in:square,portrait,landscape',
            'options.timeout' => 'nullable|integer|min:1',
            'options.disk' => 'nullable|string',
            'options.directory' => 'nullable|string',
        ];
    }
}
