<?php

namespace App\Modules\Mockup\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class MockupVersion extends Model implements HasMedia
{
    use InteractsWithMedia;

    protected $fillable = [
        'mockup_id',
        'version_number',
        'layers',
        'configuration',
    ];

    protected $casts = [
        'layers' => 'array',
        'configuration' => 'array',
    ];

    public function mockup()
    {
        return $this->belongsTo(Mockup::class);
    }

}