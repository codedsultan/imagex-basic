<?php

namespace App\Modules\Mockup\Models;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\Tags\HasTags;
use App\Traits\HasSlug;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Support\Str;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\Image\Enums\Fit;

class MockupTemplate extends Model implements HasMedia
{
    use InteractsWithMedia, HasTags ,HasSlug,HasUlids;
    use HasFactory;

    protected $slugField = 'name';

    protected $fillable = [
        'name', 'slug', 'type',
        'front_config', 'back_config',
        'shared_config', 'is_active','image_url'
    ];

    protected $casts = [
        'front_config' => 'array',
        'back_config' => 'array',
        'shared_config' => 'array',
        'is_active' => 'boolean'
    ];

    protected $appends = ['thumbnail'];

    /**
     * Register a media collection for the template images.
     *
     * This allows you to call getFirstMediaPath('template_images')
     * to retrieve the base image for the template.
     */
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('front_mockup_templates')
             ->singleFile(); // Assumes one image per template
        $this->addMediaCollection('back_mockup_templates')
             ->singleFile(); // Assumes one image per template
    }


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
                ->performOnCollections(['front_mockup_templates', 'back_mockup_templates']);
        } else {
            $this->addMediaConversion('thumbnail')
                ->width(300)
                ->height(300)
                ->fit(Fit::Contain, 300, 300) // Fit mode PAD resizes while preserving aspect ratio and pads extra space.
                ->background('#ffffff')  // Set the background color for the padding.
                ->quality(75)
                ->performOnCollections(['front_mockup_templates', 'back_mockup_templates'])
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
        return $this->getFirstMediaUrl('front_mockup_templates', 'thumbnail');
    }

    public function mockups()
    {
        return $this->hasMany(Mockup::class);
    }
    /**
     * Attach a tag specifically for mockup templates.
     *
     * @param string $tagName
     */
    public function attachMockupTemplateTag(string $tagName): void
    {
        $this->attachTag($tagName, 'mockup_template');
    }

    // Getter for comprehensive view configuration
    public function getViewConfiguration(string $view = 'front')
    {
        $viewSpecificConfig = $view === 'front'
            ? $this->front_config
            : $this->back_config;

        return array_merge(
            $this->shared_config ?? [],
            $viewSpecificConfig ?? []
        );
    }


    // Static method to create template with comprehensive configuration
    public static function createWithConfiguration(array $data)
    {
        return self::create([
            'name' => $data['name'],
            'slug' => Str::slug($data['name']),
            'front_config' => $data['front_config'] ?? null,
            'back_config' => $data['back_config'] ?? null,
            'shared_config' => [
                'product_type' => 'tshirt',
                'sizes' => $data['sizes'] ?? ['S', 'M', 'L', 'XL', 'XXL'],
                'colors' => $data['colors'] ?? [],
                'base_price' => $data['base_price'] ?? 0,
            ]
        ]);
    }


    /**
     * Get all versions of this template.
     */
    public function versions()
    {
        return $this->hasMany(MockupTemplateVersion::class);
    }


    public function restoreFromVersion(MockupTemplateVersion $version)
    {
        $this->update([
            'view_angle' => $version->view_angle,
            'color_code' => $version->color_code,
            'model_type' => $version->model_type,
            'template_path' => $version->template_path,
            'design_area' => $version->design_area,
            'layers' => $version->layers,
            'configuration' => $version->configuration,
        ]);
    }


}
