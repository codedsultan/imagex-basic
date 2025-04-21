<?php
namespace App\Modules\Mockup\Interfaces\Services;

use App\Modules\Mockup\Models\Mockup;

interface MockupServiceInterface
{
    /**
     * Persist a new Mockup (including canvas JSON and optional base64 image).
     *
     * @param  array  $data  Validated request data (name, template_id, json_data, front_image, etc.)
     * @return Mockup
     */
    public function storeMockup(array $data): Mockup;

    /**
     * Generate a final mockup image URL from a saved Mockup model.
     *
     * @param  Mockup  $mockup
     * @return string  Public URL to the generated image
     */
    public function generateMockupFromModel(Mockup $mockup): string;

    /**
     * (Optional) If you still need the older raw-generation method,
     * you can leave it here for compatibility.
     *
     * @param  array   $designData
     * @param  int     $templateId
     * @param  Mockup  $mockup
     * @return \Spatie\MediaLibrary\MediaCollections\Models\Media
     */
    public function generateMockup(array $designData, int $templateId, Mockup $mockup);
}
