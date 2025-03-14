<?php

namespace App\Modules\Design\Interfaces\Services;
use App\Modules\Design\Models\Design;
use Illuminate\Http\UploadedFile;

interface DesignServiceInterface
{
    public function getUserDesigns(string $userId);
    /**
     * Create a design using direct upload or text-based creation.
     */
    public function createDesign(array $data, ?UploadedFile $file = null): Design;
    public function createDesignFrom(array $data, ?UploadedFile $file = null): Design;

    public function getDesignById(string $designId);
    public function updateDesign(string $designId, array $data, $file = null);
    public function deleteDesign(string $designId);

    /**
     * Generate a design via an AI microservice.
     * $type can be 'text' or 'image'.
     */
    public function generateDesign(array $data, string $type): Design;

    /**
     * Delete a media file from a design.
     */
    public function deleteDesignMedia(int $designId, int $mediaId): bool;

}