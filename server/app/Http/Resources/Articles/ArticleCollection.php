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
            'current_page' => method_exists($this->resource, 'currentPage') ? $this->resource->currentPage() : 1,
            'per_page'    => method_exists($this->resource, 'perPage') ? $this->resource->perPage() : $this->collection->count(),
            'total'       => method_exists($this->resource, 'total') ? $this->resource->total() : $this->collection->count(),
            'last_page'   => method_exists($this->resource, 'lastPage') ? $this->resource->lastPage() : 1,
            'from'        => method_exists($this->resource, 'firstItem') ? $this->resource->firstItem() : 1,
            'to'          => method_exists($this->resource, 'lastItem') ? $this->resource->lastItem() : $this->collection->count(),
        ];
    }
}
