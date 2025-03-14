<?php

namespace App\Modules\Product\Models;

use Database\Factories\CategoryFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Traits\HasSlug;

class Category extends Model
{
    use HasFactory;
    use HasSlug;
    protected $fillable = ['name', 'slug', 'description'];

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    /**
     * Create a new factory instance for the model.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    protected static function newFactory()
    {
        return CategoryFactory::new();
    }
}