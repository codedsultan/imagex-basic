<?php

namespace App\Modules\Design\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\Image\Enums\Fit;
use Database\Factories\DesignFactory;
class Design extends Model implements HasMedia
{
    use InteractsWithMedia;
    use HasFactory;
    protected $fillable = [
        'title',
        'description',
        'user_id',
        'is_public',
        'slug',
        'image_path',
        'design_image',
        'design_data'
    ];

    protected $casts = [
        'design_data' => 'array',
    ];

    protected $appends = ['full_image_url','thumbnail'];

    protected string $collectionName = 'design_images';


    /**
     * Create a new factory instance for the model.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    protected static function newFactory()
    {
        return DesignFactory::new();
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(DesignCategory::class,'design_category_pivot');
    }

    public function registerMediaCollections(): void
    {
        $this
            ->addMediaCollection($this->collectionName)
            // ->useFallbackUrl($fallbackImageUrl)
            ->singleFile();
        
    }
    

    public function getFullImageUrlAttribute(): string
    {
        // Returns the URL of the original file in the "design_images" collection.
        // You can also specify a conversion name if needed.
        return $this->getFirstMediaUrl('design_images');
    }


    /**
     * Register media conversions for this model.
     */
    public function registerMediaConversions(?Media $media = null): void
    {

        if (app()->environment('production')) {
            $this->addMediaConversion('thumbnail')
                ->width(300)
                ->height(300)
                ->fit(Fit::Contain, 300, 300) // Fit mode PAD resizes while preserving aspect ratio and pads extra space.
                ->background('#ffffff')  // Set the background color for the padding.
                ->quality(75)
                ->performOnCollections('design_images');
        } else {
            $this->addMediaConversion('thumbnail')
                ->width(300)
                ->height(300)
                ->fit(Fit::Contain, 300, 300) // Fit mode PAD resizes while preserving aspect ratio and pads extra space.
                ->background('#ffffff')  // Set the background color for the padding.
                ->quality(75)
                ->performOnCollections('design_images')
                ->nonQueued();
        }
        
       
    }

    /**
     * Get the URL for the thumbnail conversion.
     *
     * @return string
     */
    public function getThumbnailAttribute(): string
    {
        return $this->getFirstMediaUrl('design_images', 'thumbnail');
    }

}