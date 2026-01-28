<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SiteResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->site_name,
            'domain' => $this->site_url,
            'status' => $this->site_status,
            'image' => $this->site_logo ?? '/images/HomesTV.png',
            'contact_name' => $this->contact_name,
            'contact_email' => $this->contact_email,
            'description' => $this->site_description ?? '',
            'categories' => $this->site_keywords ?? [],
            'requested' => $this->created_at?->format('Y-m-d') ?? '',
            'articles_count' => (int) ($this->articles_count ?? 0),
            'monthly_views' => 0,
        ];
    }
}
