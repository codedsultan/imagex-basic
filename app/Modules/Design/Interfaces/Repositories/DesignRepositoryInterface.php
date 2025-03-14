<?php

namespace App\Modules\Design\Interfaces\Repositories;

use App\Modules\Design\Models\Design;
interface DesignRepositoryInterface
{
    public function getUserDesigns(string $userId);
    public function getDesignById(string $designId);
    public function createDesign(array $attributes): Design;
    // public function create(array $data)
    public function updateDesign(string $designId, array $attributes);
    public function deleteDesign(string $designId);
    public function addMediaToDesign(string $designId, $file ,string $collectionName);

    /**
     * Delete a media file from a design.
     */
    public function deleteMedia(Design $design, int $mediaId,string $collectionName): bool;

}