<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    //To connect in the News Table (A Category has News Items.)
    public function news()
    {
        return $this->hasMany(News::class);
    }
}
