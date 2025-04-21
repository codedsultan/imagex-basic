<?php

namespace App\Modules\Mockup\Models;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\Tags\HasTags;


class MockupTemplateVersion extends Model implements HasMedia
{
    use InteractsWithMedia, HasTags;
    use HasFactory;

    protected $fillable = [
        'template_id',
        'name',
        'slug',
        'category_id',
        'view_angle',
        'color_code',
        'model_type',
        'template_path',
        'design_area',
        'layers',
        'configuration',
    ];

    protected $casts = [
        'design_area' => 'array',
        'layers' => 'array',
        'configuration' => 'array',
    ];

    /**
     * Relationship: A version belongs to a mockup template.
     */
    public function template()
    {
        return $this->belongsTo(MockupTemplate::class, 'template_id');
    }
}
