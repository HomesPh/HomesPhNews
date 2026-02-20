<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class MailingListBroadcast extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'mailinglist_broadcasts';

    protected $fillable = [
        'article_ids',
        'recipient_count',
        'status',
        'type',
        'sent_at'
    ];

    protected $casts = [
        'article_ids' => 'json',
        'sent_at' => 'datetime'
    ];
}
