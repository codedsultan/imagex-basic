<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Spatie\Image\Enums\Fit;
class EditorTemplate extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia, HasUlids;

    protected $table = 'editor_templates';

    // Disable auto-increment and use UUIDs.
    // public $incrementing = false;
    // protected $keyType = 'string';

    protected $fillable = [
        'id',
        'name',
        'type',
        'layers',
        'configuration',
        'width',
        'height',
    ];

     /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'width' => 'integer',
        'height' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'layers' => 'array',
        'configuration' => 'array',
    ];

    protected $appends = ['thumbnail'];

    public function registerMediaCollections(): void
    {
        // Collection for the source image (uploaded by the user)
        $this->addMediaCollection('editor_templates')
             ->singleFile();

    }
    /**
     * Register media conversions for thumbnail generation.
     */
    public function registerMediaConversions(?Media $media = null): void
    {
        // // Create a thumbnail conversion using Intervention Image.
        // $this->addMediaConversion('thumb')
        //      ->fit('crop', 368, 232)
        //      ->nonQueued();


        if (app()->environment('production')) {
            $this->addMediaConversion('thumbnail')
                ->width(300)
                ->height(300)
                ->fit(Fit::Contain, 300, 300) // Fit mode PAD resizes while preserving aspect ratio and pads extra space.
                ->background('#ffffff')  // Set the background color for the padding.
                ->quality(75)
                ->performOnCollections(['editor_templates']);
        } else {
            $this->addMediaConversion('thumbnail')
                ->width(300)
                ->height(300)
                ->fit(Fit::Contain, 300, 300) // Fit mode PAD resizes while preserving aspect ratio and pads extra space.
                ->background('#ffffff')  // Set the background color for the padding.
                ->quality(75)
                ->performOnCollections(['editor_templates'])
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
        return $this->getFirstMediaUrl('editor_templates', 'thumbnail');
    }

    public function getThumbnailUrlAttribute(): string
    {
        // Returns the URL of the original file in the "design_images" collection.
        // You can also specify a conversion name if needed.
        return $this->getFirstMediaUrl('editor_templates');
    }

    public function getFullImageUrlAttribute(): string
    {
        // Returns the URL of the original file in the "design_images" collection.
        // You can also specify a conversion name if needed.
        return $this->getFirstMediaUrl('editor_templates');
    }

}
