<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MailingListBroadcastRecipient extends Model
{
    use HasFactory;

    protected $table = 'mailinglist_broadcast_recipients';

    protected $fillable = [
        'broadcast_id',
        'email',
        'status'
    ];

    /**
     * Relationship back to the main broadcast record.
     */
    public function broadcast()
    {
        return $this->belongsTo(MailingListBroadcast::class, 'broadcast_id');
    }
}
