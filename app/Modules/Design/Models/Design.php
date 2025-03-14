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
use App\Traits\HasSlug;
class Design extends Model implements HasMedia
{
    use InteractsWithMedia;
    use HasFactory;
    use HasSlug;

    protected $fillable = [
        'title',
        'description',
        'user_id',
        'is_public',
        'slug',
        'image_path',
        'design_image',
        'design_data',
        'is_ai_generated',
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
        // Collection for the source image (uploaded by the user)
        $this->addMediaCollection('source_images')
             ->singleFile();

        $this
            ->addMediaCollection($this->collectionName)
            // ->useFallbackUrl($fallbackImageUrl)
            ->singleFile();

        // Collection for the generated design image (output from AI or processing)
        $this->addMediaCollection('generated_designs')
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
                ->performOnCollections(['generated_designs', 'design_images']);
        } else {
            $this->addMediaConversion('thumbnail')
                ->width(300)
                ->height(300)
                ->fit(Fit::Contain, 300, 300) // Fit mode PAD resizes while preserving aspect ratio and pads extra space.
                ->background('#ffffff')  // Set the background color for the padding.
                ->quality(75)
                ->performOnCollections(['generated_designs', 'design_images'])
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


    /**
     * Get the URL for the thumbnail conversion of the generated design.
     *
     * @return string
     */
    public function getGeneratedThumbnailAttribute(): string
    {
        return $this->getFirstMediaUrl('generated_designs', 'thumbnail');
    }

    /**
     * Get the URL for the source image.
     *
     * @return string
     */
    public function getSourceImageUrlAttribute(): string
    {
        return $this->getFirstMediaUrl('source_images');
    }


}