<?php

namespace App\Services;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Intervention\Image\Drivers\Gd\Driver;

class MediaService
{
    public function __construct()
    {
        //
    }
    public function saveBase64ToModel(string $base64, $model, string $collection = 'default'): Media
    {
        // strip metadata
        [$meta, $data] = explode(',', $base64);
        $decoded = base64_decode($data);

        // read & save to temp file
        $image = (new ImageManager(new Driver()))->read($decoded);
        $tempPath = storage_path('app/temp/' . Str::uuid() . '.png');
        $image->toPng()->save($tempPath);

        // attach via Spatie
        $media = $model
            ->addMedia($tempPath)
            ->preservingOriginal()
            ->toMediaCollection($collection);

        unlink($tempPath);

        return $media;
    }
}


