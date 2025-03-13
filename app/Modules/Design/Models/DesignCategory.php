<?php

namespace App\Modules\Design\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DesignCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
    ];

    public function designs()
    {
        return $this->belongsToMany(Design::class, 'design_category_pivot');
    }
}
