<?php

namespace App\Modules\Design\Interfaces\Repositories;

interface DesignRepositoryInterface
{
    public function getUserDesigns(string $userId);
    public function getDesignById(string $designId);
    public function createDesign(array $attributes);
    public function updateDesign(string $designId, array $attributes);
    public function deleteDesign(string $designId);
    public function addMediaToDesign(string $designId, $file);
}