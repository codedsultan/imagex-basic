php artisan tinker

$design = \App\Modules\Design\Models\Design::first();

if (!$design) {
    dd('No designs found in the database.');
}

dd([
    'full_image_url' => $design->full_image_url,
    'thumbnail_url' => $design->thumbnail,
    'generated_thumbnail_url' => $design->generated_thumbnail,
    'source_image_url' => $design->source_image_url
]);


$design = \App\Modules\Design\Models\Design::factory()->create();
