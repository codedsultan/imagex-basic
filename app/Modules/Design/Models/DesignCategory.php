<?php

namespace App\Modules\Design\Models;

use Database\Factories\DesignCategoryFactory;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HasSlug;
class DesignCategory extends Model
{
    use HasFactory;
    use HasSlug;

    protected $fillable = [
        'name',
        'slug',
        'description',
    ];

    /**
     * Create a new factory instance for the model.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    protected static function newFactory()
    {
        return DesignCategoryFactory::new();
    }

    public function designs()
    {
        return $this->belongsToMany(Design::class, 'design_category_pivot');
    }



}
