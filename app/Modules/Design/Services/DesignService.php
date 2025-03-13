<?php

namespace App\Modules\Design\Services;

use App\Modules\Design\Interfaces\Repositories\DesignRepositoryInterface;
use App\Modules\Design\Interfaces\Services\DesignServiceInterface;

class DesignService implements DesignServiceInterface
{
    public function __construct(
        private DesignRepositoryInterface $designRepository
    ) {}

    public function getUserDesigns(string $userId)
    {
        return $this->designRepository->getUserDesigns($userId);
    }

    public function createDesign(array $data, $file = null)
    {
        $design = $this->designRepository->createDesign($data);
        
        if ($file) {
            $this->designRepository->addMediaToDesign($design->id, $file);
        }

        return $design;
    }

    public function getDesignById(string $designId)
    {
        return $this->designRepository->getDesignById($designId);
    }

    public function updateDesign(string $designId, array $data, $file = null)
    {
        $design = $this->designRepository->updateDesign($designId, $data);
        
        if ($file) {
            $this->designRepository->addMediaToDesign($designId, $file);
        }

        return $design;
    }

    public function deleteDesign(string $designId)
    {
        return $this->designRepository->deleteDesign($designId);
    }
}