<?php

namespace App\Modules\Design\Repositories;

use App\Modules\Design\Interfaces\Repositories\DesignRepositoryInterface;
use App\Modules\Design\Models\Design;

class EloquentDesignRepository implements DesignRepositoryInterface
{
    public function getUserDesigns(string $userId)
    {
        return Design::where('user_id', $userId)
            ->with(['media', 'categories'])
            ->get();
    }

    public function getDesignById(string $designId)
    {
        return Design::with(['media', 'categories'])->findOrFail($designId);
    }

    public function createDesign(array $attributes)
    {
        return Design::create($attributes);
    }

    public function updateDesign(string $designId, array $attributes)
    {
        $design = Design::findOrFail($designId);
        $design->update($attributes);
        return $design;
    }

    public function deleteDesign(string $designId)
    {
        return Design::destroy($designId);
    }

    public function addMediaToDesign(string $designId, $file)
    {
        $design = Design::findOrFail($designId);
        return $design->addMedia($file)->toMediaCollection('design_files');
    }
}