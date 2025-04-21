<?php

namespace App\Modules\Mockup\Models;

use App\Modules\Design\Models\Design;
use App\Modules\Mockup\Notifications\MockupStatusNotification;
use App\Modules\Product\Models\Product;
use App\Traits\HasSlug;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Mockup extends Model implements HasMedia
{
    use InteractsWithMedia;
    use HasSlug;

    protected $slugField = 'name';

    protected $fillable = [
        'template_id', 'name', 'user_id',
        'front_canvas_state', 'back_canvas_state',
        'design_metadata', 'print_areas',
        'layer_configurations', 'current_view'
    ];

    protected $casts = [
        'front_canvas_state' => 'array',
        'back_canvas_state' => 'array',
        'design_metadata' => 'array',
        'print_areas' => 'array',
        'layer_configurations' => 'array'
    ];

    // to be chnaged to enum
    const STATUS_DRAFT = 'draft';
    // const STATUS_PENDING_REVIEW = 'pending_review';
    const STATUS_PUBLISHED = 'published';

    protected $appends = ['thumbnail'];

    public function design()
    {
        return $this->belongsTo(Design::class);
    }

    // public function product()
    // {
    //     return $this->belongsTo(Product::class);
    // }

    /**
     * The template associated with the mockup (if any).
     */
    public function template()
    {
        return $this->belongsTo(MockupTemplate::class);
    }

    /**
     * Check if a mockup is in draft state.
     */
    public function isDraft()
    {
        return $this->status === 'draft';
    }

    // Method to get current view canvas state
    public function getCurrentCanvasState()
    {
        return $this->current_view === 'front'
            ? $this->front_canvas_state
            : $this->back_canvas_state;
    }

    // Method to save canvas state for specific view
    public function saveCanvasState(string $view, array $canvasState)
    {
        $attribute = $view === 'front'
            ? 'front_canvas_state'
            : 'back_canvas_state';

        $this->update([
            $attribute => $canvasState,
            'current_view' => $view
        ]);
    }
    /**
     * Get all versions of this mockup.
     */
    public function versions()
    {
        return $this->hasMany(MockupVersion::class);
    }

    public function createNewVersion()
    {
        return $this->versions()->create([
            'version_number' => $this->generateVersionNumber(),
            'layers' => $this->layers,
            'configuration' => $this->configuration,
        ]);
    }

    private function generateVersionNumber()
    {
        $lastVersion = $this->versions()->latest()->first();
        if (!$lastVersion) return '1.0';

        [$major, $minor] = explode('.', $lastVersion->version_number);
        return $major . '.' . ($minor + 1);
    }



    /**
     * Save layers and update configuration.
     */
    public function updateLayers(array $layers)
    {
        $this->update([
            'layers' => $layers,
        ]);
    }


    /**
     * Scope a query to only include published mockups.
     */
    public function scopePublished($query)
    {
        return $query->where('status', self::STATUS_PUBLISHED);
    }

    /**
     * Save a new version of the mockup before updating layers.
     */
    // public function saveVersion()
    // {
    //     $this->versions()->create([
    //         'mockup_id' => $this->id,
    //         'layers' => $this->layers,
    //         'configuration' => $this->configuration,
    //         'status' => $this->status,
    //     ]);
    // }


    /**
     * Restore a mockup from a previous version.
     */
    public function restoreFromVersion(MockupVersion $version)
    {
        $this->update([
            'layers' => $version->layers,
            'configuration' => $version->configuration,
            'status' => $version->status,
        ]);
    }

    public function approveAndPublish()
    {
        $this->update(['status' => 'approved']);

        $this->user->notify(new MockupStatusNotification($this, "Your mockup has been approved!"));
    }

    public function rejectMockup(string|null $reason = null)
    {
        $this->update(['status' => 'draft']);

        if ($reason) {
            $this->rejections()->create(['reason' => $reason]);
            $this->user->notify(new MockupStatusNotification($this, "Your mockup was rejected: $reason"));
        }
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('mockups')
            // ->useDisk('mockups')
            ->singleFile();

        $this->addMediaCollection('previews')
            ->withResponsiveImages();

        $this->addMediaCollection('exports')
            ->singleFile();

    }

    public function isEditable(): bool
    {
        return in_array($this->status, ['draft', 'rejected']);
    }


    /**
     * Get the URL for the thumbnail conversion.
     *
     * @return string
     */
    public function getThumbnailAttribute(): string
    {
        // return $this->getFirstMediaUrl('mockups', 'thumbnail');
        return $this->getFirstMediaUrl('mockups');
    }

}
