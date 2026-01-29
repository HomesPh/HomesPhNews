<?php

namespace App\Http\Resources\Articles;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class ArticleCollection extends ResourceCollection
{
    /**
     * Disable wrapping for this collection to match frontend expectations.
     */
    public static $wrap = null;

    /**
     * The resource that this resource collects.
     */
    public $collects = ArticleResource::class;

    /**
     * Transform the resource collection into an array.
     *
     * @return array{data: \Illuminate\Http\Resources\Json\AnonymousResourceCollection}
     */
    public function toArray(Request $request): array
    {
        return [
            'data' => $this->collection,
            'current_page' => $this->resource->currentPage(),
            'per_page'    => $this->resource->perPage(),
            'total'       => $this->resource->total(),
            'last_page'   => $this->resource->lastPage(),
            'from'        => $this->resource->firstItem(),
            'to'          => $this->resource->lastItem(),
        ];
    }
}
