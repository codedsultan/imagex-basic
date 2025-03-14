<?php

namespace App\Modules\Product\Models;

use Database\Factories\ProductFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Traits\HasSlug;
class Product extends Model implements HasMedia
{
    use InteractsWithMedia;
    use HasFactory;
    use HasSlug;

    protected $fillable = [
        'name',
        'description',
        'price',
        'category_id',
        'product_type',
        'slug'
    ];

    /**
     * Create a new factory instance for the model.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    protected static function newFactory()
    {
        return ProductFactory::new();
    }
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('product_images')
            ->useDisk('public')
            ->singleFile();
    }
}