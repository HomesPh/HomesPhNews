<?php

namespace App\Http\Resources\Restaurants;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class RestaurantCollection extends ResourceCollection
{
    public static $wrap = null;

    public $collects = RestaurantResource::class;

    public function toArray(Request $request): array
    {
        $isPaginator = $this->resource instanceof \Illuminate\Pagination\AbstractPaginator;

        return [
            'data'         => $this->collection,
            'current_page' => $isPaginator ? $this->resource->currentPage() : 1,
            'per_page'     => $isPaginator ? $this->resource->perPage() : $this->collection->count(),
            'total'        => $isPaginator ? $this->resource->total() : $this->collection->count(),
            'last_page'    => $isPaginator ? $this->resource->lastPage() : 1,
            'from'         => $isPaginator ? $this->resource->firstItem() : 1,
            'to'           => $isPaginator ? $this->resource->lastItem() : $this->collection->count(),
        ];
    }
}
