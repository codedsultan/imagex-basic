<?php

namespace App\Modules\Design\Interfaces\Services;

interface DesignServiceInterface
{
    public function getUserDesigns(string $userId);
    public function createDesign(array $data, $file = null);
    public function getDesignById(string $designId);
    public function updateDesign(string $designId, array $data, $file = null);
    public function deleteDesign(string $designId);
}