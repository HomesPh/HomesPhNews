<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class AdMetricQueryRequest extends FormRequest
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
            'period' => 'sometimes|in:hourly,daily,weekly,monthly',
            'from' => 'sometimes|date_format:Y-m-d',
            'to' => 'sometimes|date_format:Y-m-d',
            'group_by' => 'sometimes|in:date,ad_unit_id,campaign_id',
            'sort_by' => 'sometimes|in:date,impressions,clicks',
            'sort_order' => 'sometimes|in:asc,desc',
            'per_page' => 'sometimes|integer|min:1|max:100',
        ];
    }

    /**
     * Get the query parameter documentation for Scramble.
     */
    public function queryParameters(): array
    {
        return [
            'period' => [
                'description' => 'Aggregation period.',
                'example' => 'daily',
            ],
            'from' => [
                'description' => 'Start date (Y-m-d). Defaults to 30 days ago.',
                'example' => '2026-01-01',
            ],
            'to' => [
                'description' => 'End date (Y-m-d). Defaults to today.',
                'example' => '2026-02-20',
            ],
            'group_by' => [
                'description' => 'Field to group results by.',
                'example' => 'date',
            ],
            'sort_by' => [
                'description' => 'Field to sort results by.',
                'example' => 'date',
            ],
            'sort_order' => [
                'description' => 'Direction of sorting.',
                'example' => 'desc',
            ],
            'per_page' => [
                'description' => 'Number of items per page.',
                'example' => 15,
            ],
        ];
    }
}
