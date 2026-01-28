<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StatsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'all' => (int) ($this['all'] ?? 0),
            'published' => (int) ($this['published'] ?? 0),
            'pending' => (int) ($this['pending'] ?? 0),
            'rejected' => (int) ($this['rejected'] ?? 0),
            'pending_review' => (int) ($this['pending_review'] ?? 0),
        ];
    }
}
