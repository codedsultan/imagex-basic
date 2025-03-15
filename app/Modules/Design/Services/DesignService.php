<?php

namespace App\Modules\Design\Services;

use App\Modules\Design\Interfaces\Repositories\DesignRepositoryInterface;
use App\Modules\Design\Interfaces\Services\DesignServiceInterface;
use App\Modules\Design\Models\Design;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;


class DesignService implements DesignServiceInterface
{
    public function __construct(
        private DesignRepositoryInterface $designRepository
    ) {}

    public function getUserDesigns(string $userId)
    {
        return $this->designRepository->getUserDesigns($userId);
    }

    public function createDesign(array $data, ?UploadedFile $file = null): Design
    {
        $design = $this->designRepository->createDesign($data);
        $collectionName = 'design_images';
        if ($file) {
            $this->designRepository->addMediaToDesign($design->id, $file,$collectionName);
        }

        return $design;
    }

    public function createDesignFrom(array $data, ?UploadedFile $file = null): Design
    {
        // Create design record first.
        $design = $this->designRepository->createDesign($data);

        // If an uploaded file is provided, attach it to the source_images collection.
        if ($file) {
            // Clear any previous media in case of update.
            $design->clearMediaCollection('source_images');
            $design->addMedia($file)
                ->toMediaCollection('source_images');
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
        $collectionName = 'design_images';
        if ($file) {
            $this->designRepository->addMediaToDesign($designId, $file,$collectionName);
        }

        return $design;
    }

    public function deleteDesign(string $designId)
    {
        return $this->designRepository->deleteDesign($designId);
    }

    public function generateDesign(array $data, string $type): Design
    {
        // If $type == 'text', then the AI microservice expects text-based parameters.
        // If $type == 'image', then it expects the URL of the uploaded source image.
        // Adjust the URL below to your FastAPI microservice endpoint.
        $aiEndpoint = config('services.fastapi.endpoint'); // e.g., https://fastapi.example.com/generate-design

        $response = Http::post($aiEndpoint, $data);

        if ($response->successful()) {
            $aiData = $response->json();

            // Assume the microservice returns a generated image file URL and additional design data.
            $designData = [
                'design_data' => $aiData['design'], // could be JSON or similar
            ];

            // For this example, we create a new design.
            // You may choose to update an existing design or create a new one.
            $design = $this->designRepository->createDesign($designData);

            // Download the generated image from the AI microservice.
            $generatedImageUrl = $aiData['generated_image_url'];
            $imageContents = file_get_contents($generatedImageUrl);
            $tempFile = tempnam(sys_get_temp_dir(), 'design_');
            file_put_contents($tempFile, $imageContents);

            // Attach the downloaded file to the generated_designs collection.
            $design->clearMediaCollection('generated_designs');
            $design->addMedia($tempFile)
                ->toMediaCollection('generated_designs');

            // Delete the temporary file.
            unlink($tempFile);

            return $design;
        }
        // return $design;
        throw new \Exception("AI design generation failed.");
    }

    public function deleteDesignMedia(int $designId, int $mediaId,string $collectionName): bool
    {
        $design = $this->designRepository->getDesignById($designId);

        if (!$design) {
            return false;
        }
        return $this->designRepository->deleteMedia($design, $mediaId,$collectionName);
    }

    public function storeBase64Image(string $base64): string
    {
        $image = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $base64));
        $fileName = Str::uuid() . '.png';
        $path = "temp/{$fileName}";

        Storage::disk('public')->put($path, $image);

        return Storage::disk('public')->path($path);
    }

}