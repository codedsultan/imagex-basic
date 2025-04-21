<?php

namespace App\Modules\Mockup\Services;

use App\Modules\Mockup\Exceptions\FileNotFoundException;
use App\Modules\Mockup\Exceptions\InvalidLayerException;
use App\Modules\Mockup\Exceptions\MockupGenerationException;
use Exception;
use Illuminate\Support\Facades\Log;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use App\Modules\Mockup\Models\Mockup;
use App\Modules\Mockup\Models\MockupTemplate;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use App\Modules\Mockup\Interfaces\Services\MockupServiceInterface;
use App\Services\MediaService;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Image as InterventionImage;
use Spatie\ImageOptimizer\OptimizerChain;
use Spatie\ImageOptimizer\OptimizerChainFactory;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class MockupService implements MockupServiceInterface
{
    protected ImageManager $imageManager;
    protected OptimizerChain $optimizerChain;

    public function __construct(
        protected MediaService $mediaService
    ) {
        $this->imageManager = new ImageManager(new Driver());
        $this->optimizerChain = OptimizerChainFactory::create();
    }

    public function storeMockup(array $data): Mockup
    {
        $canvasData = json_decode($data['json_data'], true);

        return DB::transaction(function () use ($data, $canvasData) {
            $mockup = Mockup::create([
                'user_id'            => Auth::id(),
                'name'               => $data['name'],
                'design_id'          => $data['design_id'],
                'product_id'         => $data['product_id'],
                'template_id'        => $data['template_id'],
                'front_canvas_state' => $canvasData['front'] ?? null,
                'back_canvas_state'  => $canvasData['back'] ?? null,
            ]);

            if (!empty($data['front_image'])) {
                $this->mediaService
                     ->saveBase64ToModel($data['front_image'], $mockup, 'mockups');
            }

            return $mockup;
        });
    }


    /**
     * Update the given mockup’s canvas state, name, images, etc.
     *
     * @param  Mockup  $mockup
     * @param  array   $data  Validated request data
     * @return Mockup
     */
    public function updateMockup(Mockup $mockup, array $data): Mockup
    {
        $canvasData = json_decode($data['json_data'], true);

        return DB::transaction(function () use ($mockup, $data, $canvasData) {
            $mockup->update([
                'name'               => $data['name'],
                'design_id'          => $data['design_id'],
                'product_id'         => $data['product_id'],
                'front_canvas_state' => $canvasData['front'],
                'back_canvas_state'  => $canvasData['back'] ?? $mockup->back_canvas_state,
                // …any other updatable fields…
            ]);

            if (!empty($data['front_image'])) {
                // replace the old image if needed
                $this->mediaService
                     ->saveBase64ToModel($data['front_image'], $mockup, 'mockups');
            }

            return $mockup;
        });
    }

    /**
     * Delete the given Mockup, its media and any related versions.
     *
     * @param  Mockup  $mockup
     * @return void
     */
    public function deleteMockup(Mockup $mockup): void
    {
        DB::transaction(function () use ($mockup) {
            // If you have versions or related models, delete them first
            // $mockup->versions()->delete();

            // Clear all media in the 'mockups' collection
            $mockup->clearMediaCollection('mockups');

            // Finally delete the model itself
            $mockup->delete();
        });
    }
    public function generateMockupFromModel(Mockup $mockup): string
    {
        // Reuse your existing generateMockup() under the hood if you like:
        $media = $this->generateMockup(
            json_decode($mockup->json_data, true),
            $mockup->template_id,
            $mockup
        );

        return asset("storage/" . $media->getPath());
    }
    /**
     * {@inheritdoc}
     */

    /**
     * {@inheritdoc}
     */
    public function generateMockup(array $designData, int $templateId, Mockup $mockup): Media
    {
        $tempPath = null;
        $baseImage = null;

        try {
            // 1. Get template and validate
            $template = MockupTemplate::with('media')->findOrFail($templateId);
            $this->validateTemplateMedia($template);

            // 2. Process base image
            $baseImage = $this->imageManager->read(
                $template->getFirstMediaPath('template_images')
            );

            // 3. Apply design layers
            $this->applyDesignLayers($baseImage, $designData);

            // 4. Save temporary file
            $tempPath = $this->createTempFile();
            $this->saveProcessedImage($baseImage, $tempPath);

            // 5. Store media and optimize
            $media = $this->storeMedia($mockup, $tempPath);
            $this->optimizeImage($media->getPath());

            return $media;

        } catch (Exception $e) {
            Log::error('Mockup generation failed: ' . $e->getMessage());
            throw new MockupGenerationException('Failed to generate mockup image', 0, $e);

        } finally {
            $this->cleanupResources($baseImage, $tempPath);
        }
    }

    private function validateCreationParameters(int $designId, int $templateId, array $config): void
    {
        if ($designId <= 0 || $templateId <= 0) {
            throw new InvalidLayerException('Invalid design or template ID');
        }

        if (!isset($config['layers']) || !is_array($config['layers'])) {
            throw new InvalidLayerException('Invalid layer configuration');
        }
    }

    private function validateTemplateMedia(MockupTemplate $template): void
    {
        if (!$template->hasMedia('template_images')) {
            throw new FileNotFoundException('Template base image not found');
        }
    }

    private function applyDesignLayers(InterventionImage $baseImage, array $designData): void
    {
        foreach ($designData['layers'] as $layer) {
            if (!$this->validateLayer($layer)) {
                throw new InvalidLayerException("Invalid layer configuration");
            }

            $layerPath = Storage::disk($layer['disk'])->path($layer['path']);
            if (!file_exists($layerPath)) {
                throw new FileNotFoundException("Layer image not found: {$layer['path']}");
            }

            $layerImage = $this->processLayerImage(
                $this->imageManager->read($layerPath),
                $layer
            );

            $baseImage->place(
                $layerImage,
                'top-left',
                $layer['x'],
                $layer['y'],
                $layer['opacity'] ?? 100
            );

            // $layerImage->destroy();
            $layerImage = null;
        }
    }

    private function processLayerImage(InterventionImage $image, array $layer): InterventionImage
    {
        return $image->resize(
            $layer['width'],
            $layer['height'],
            function ($constraint) {
                $constraint->aspectRatio();
                $constraint->upsize();
            }
        )->rotate($layer['rotation']);
    }

    private function validateLayer(array $layer): bool
    {
        $requiredKeys = ['disk', 'path', 'width', 'height', 'x', 'y'];

        foreach ($requiredKeys as $key) {
            if (!array_key_exists($key, $layer)) {
                return false;
            }
        }

        return true;
    }

    private function createTempFile(): string
    {
        $tempPath = tempnam(sys_get_temp_dir(), 'mockup');
        if (!$tempPath) {
            throw new Exception('Failed to create temporary file');
        }
        return $tempPath;
    }

    private function saveProcessedImage(InterventionImage $image, string $path): void
    {
        try {
            $image->toWebp(85)->save($path);
        } catch (Exception $e) {
            $image->toJpeg(85)->save($path);
        }
    }

    private function storeMedia(Mockup $mockup, string $path): Media
    {
        try {
            return $mockup->addMedia($path)
                ->usingFileName(Str::uuid() . '.' . pathinfo($path, PATHINFO_EXTENSION))
                ->toMediaCollection('mockups', config('media-library.disk_name'));
        } catch (Exception $e) {
            throw new MockupGenerationException("Media storage failed: " . $e->getMessage());
        }
    }

    private function optimizeImage(string $path): void
    {
        try {
            $this->optimizerChain->optimize($path);
        } catch (Exception $e) {
            Log::warning("Image optimization failed: " . $e->getMessage());
        }
    }

    private function cleanupResources(?InterventionImage $image, ?string $tempPath): void
    {
        try {
            if ($image instanceof InterventionImage) {
                // $image->destroy();
                $image = null;

            }
            if ($tempPath && file_exists($tempPath)) {
                unlink($tempPath);
            }
        } catch (Exception $e) {
            Log::error('Cleanup failed: ' . $e->getMessage());
        }
    }

    // private function generateExport(Mockup $design, array $jsonData)
    // {
    //     // Convert Fabric JSON to image using Intervention
    //     $width = $jsonData['width'] ?? 800;
    //     $height = $jsonData['height'] ?? 600;

    //     $image = Image::canvas($width, $height, '#ffffff');

    //     // Logic to render Fabric elements onto the image
    //     // This would depend on your specific needs

    //     // Save the export
    //     $tempFile = tempnam(sys_get_temp_dir(), 'design_export_');
    //     $image->save($tempFile);

    //     $design->addMedia($tempFile)
    //         ->toMediaCollection('exports');

    //     @unlink($tempFile);
    // }

}
