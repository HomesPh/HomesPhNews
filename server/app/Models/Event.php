<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_title',
        'date',
        'time',
        'location',
        'details',
        'category',
        'country',
        'color',
        'bg_color',
        'border_color',
        'is_public_holiday',
    ];

    protected $casts = [
        'is_public_holiday' => 'boolean',
        'date' => 'date',
    ];
}
