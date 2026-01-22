<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Analytics extends Model
{
    protected $fillable = [
        'unique_visitors',
        'total_clicks',
        'avg_engagement',
    ];
}
