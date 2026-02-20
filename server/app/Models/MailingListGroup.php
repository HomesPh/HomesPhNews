<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class MailingListGroup extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'name',
        'description'
    ];

    public function subscribers()
    {
        return $this->belongsToMany(
            SubscriptionDetail::class,
            'mailing_list_group_subscriber',
            'group_id',
            'subscriber_id',
            'id',
            'sub_Id'
        );
    }
}
