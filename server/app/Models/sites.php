<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class sites extends Model
{
    protected $table = 'sites';
    protected $fillable = [
        'site_name',
        'site_url',
        'site_logo',
        'site_description',
        'site_keywords',
        'site_status',
        'site_contact',
        'contact_name',
        'contact_email',
        'created_at',
        'updated_at',
    ];
}
