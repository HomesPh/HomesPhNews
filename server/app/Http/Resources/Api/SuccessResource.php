<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Resources\Json\JsonResource;

class SuccessResource extends JsonResource
{
    /**
     * Disable wrapping for this resource.
     *
     * @var string|null
     */
    public static $wrap = null;

    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'status' => 'success',
            'message' => $this->resource['message'] ?? 'Operation successful',
            'data' => $this->resource['data'] ?? []
        ];
    }
}
