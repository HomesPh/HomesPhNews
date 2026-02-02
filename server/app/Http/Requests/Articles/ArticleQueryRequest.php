<?php

namespace App\Http\Requests\Articles;

use Illuminate\Foundation\Http\FormRequest;

class ArticleQueryRequest extends FormRequest
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
            'mode' => 'nullable|string|in:feed,list',
            'q' => 'nullable|string|max:100',
            'search' => 'nullable|string|max:100',
            'country' => 'nullable|string|max:50',
            'category' => 'nullable|string|max:50',
            'topic' => 'nullable|string|max:50',
            'topics' => 'nullable|string',
            'limit' => 'nullable|integer|min:1|max:100',
            'offset' => 'nullable|integer|min:0',
            'status' => 'nullable|string|in:published,pending,rejected,pending review,all,deleted',
            'sort_by' => 'nullable|string|in:created_at,views_count,title,timestamp',
            'sort_direction' => 'nullable|string|in:asc,desc',
            'per_page' => 'nullable|integer|min:1|max:100',
            'page' => 'nullable|integer|min:1',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ];
    }
}
