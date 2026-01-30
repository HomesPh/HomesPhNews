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
        $isPaginator = $this->resource instanceof \Illuminate\Pagination\AbstractPaginator;

        return [
            'data' => $this->collection,
            'current_page' => $isPaginator ? $this->resource->currentPage() : 1,
            'per_page' => $isPaginator ? $this->resource->perPage() : $this->collection->count(),
            'total' => $isPaginator ? $this->resource->total() : $this->collection->count(),
            'last_page' => $isPaginator ? $this->resource->lastPage() : 1,
            'from' => $isPaginator ? $this->resource->firstItem() : 1,
            'to' => $isPaginator ? $this->resource->lastItem() : $this->collection->count(),
        ];
    }
}
