<?php

namespace Database\Seeders;

use App\Modules\Mockup\Models\MockupTemplate;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class TShirtMockupTemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->createTShirtMockup();
    }

    /**
     * Create a t-shirt mockup template with Spatie Media Library integration.
     */
    // private function createTShirtMockup()
    // {
    //     $name = 'Summer T-Shirt Mockup';
    //     // $slug = Str::slug($name) . '-' . Str::random(6);

    //     // Initial configuration arrays without image URLs.
    //     $frontConfig = [
    //         'base_image_url' => '', // To be updated after adding media.
    //         'print_areas' => [
    //             'main_print_area' => [
    //                 'x' => 0.10,         // 10% from the left
    //                 'y' => 0.167,        // ~16.7% from the top
    //                 'width' => 0.30,     // 30% of the image width
    //                 'height' => 0.333,   // ~33.3% of the image height
    //             ]
    //         ],
    //         'recommended_design_size' => [0.25, 0.292],
    //     ];

    //     $backConfig = [
    //         'base_image_url' => '', // To be updated after adding media.
    //         'print_areas' => [
    //             'main_print_area' => [
    //                 'x' => 0.10,         // 10% from the left
    //                 'y' => 0.167,        // ~16.7% from the top
    //                 'width' => 0.30,     // 30% of the image width
    //                 'height' => 0.333,   // ~33.3% of the image height
    //             ]
    //         ],
    //         'recommended_design_size' => [0.25, 0.292],
    //     ];

    //     $sharedConfig = [
    //         'allowDesignEditing' => true,
    //         // Add any additional shared settings here.
    //     ];

    //     // Create the template record.
    //     $template = MockupTemplate::create([
    //         'name'          => $name,
    //         // 'slug'          => $slug,
    //         'description'   => 'A summer t-shirt mockup template with front and back views.',
    //         'view_angle'    => 'front',         // Default view angle.
    //         'color_code'    => '#FFFFFF',       // Default HEX color code.
    //         'model_type'    => 'unisex',
    //         'type'          => 'tshirt',
    //         'front_config'  => json_encode($frontConfig),
    //         'back_config'   => json_encode($backConfig),
    //         'shared_config' => $sharedConfig,//json_encode($sharedConfig),
    //         'file_type'     => 'png',           // Or adjust to svg/jpeg as needed.
    //         'is_active'     => true,
    //     ]);

    //     // Define image paths.
    //     $imageFolder = env('MOCKUP_IMAGE_FOLDER', 'mockups-seed');
    //     // Retrieve actual image dimensions
    //     $frontImagePath = base_path("$imageFolder/t-shirt_mockup_front_view_in_grey_color.png");
    //     $backImagePath = base_path("$imageFolder/t-shirt_mockup_back_view_in_grey_color.png");
    //     // Use Spatie Media Library to add the front image.
    //     if (file_exists($frontImagePath)) {
    //         $frontMedia = $template->addMedia($frontImagePath)
    //             ->preservingOriginal()
    //             ->toMediaCollection('front_mockup_templates');
    //         // Update the front config with the media URL.
    //         $frontConfig['base_image_url'] = $frontMedia->getUrl();
    //     }

    //     // Use Spatie Media Library to add the back image.
    //     if (file_exists($backImagePath)) {
    //         $backMedia = $template->addMedia($backImagePath)
    //             ->preservingOriginal()
    //             ->toMediaCollection('back_mockup_templates');
    //         // Update the back config with the media URL.
    //         $backConfig['base_image_url'] = $backMedia->getUrl();
    //     }

    //     // Update the template record with the new configuration values.
    //     $template->update([
    //         'front_config' => $frontConfig,//json_encode($frontConfig),
    //         'back_config'  => $backConfig,//json_encode($backConfig),
    //         'image_url'    => $frontConfig['base_image_url'],
    //     ]);
    // }
    private function createTShirtMockup()
    {
        DB::beginTransaction();  // Start the transaction

        try {
            $name = 'Summer T-Shirt Mockup';

            // Initial configuration arrays without image URLs.
            $frontConfig = [
                'base_image_url' => '',
                'print_areas' => [
                    'main_print_area' => [
                        'x' => 0.10,
                        'y' => 0.167,
                        'width' => 0.30,
                        'height' => 0.333,
                    ]
                ],
                'recommended_design_size' => [0.25, 0.292],
            ];

            $backConfig = [
                'base_image_url' => '',
                'print_areas' => [
                    'main_print_area' => [
                        'x' => 0.10,
                        'y' => 0.167,
                        'width' => 0.30,
                        'height' => 0.333,
                    ]
                ],
                'recommended_design_size' => [0.25, 0.292],
            ];

            $sharedConfig = [
                'allowDesignEditing' => true,
            ];

            // Create the template record.
            $template = MockupTemplate::create([
                'name'          => $name,
                'description'   => 'A summer t-shirt mockup template with front and back views.',
                'view_angle'    => 'front',  // Default view angle.
                'color_code'    => '#FFFFFF',
                'model_type'    => 'unisex',
                'type'          => 'tshirt',
                'front_config'  => json_encode($frontConfig),
                'back_config'   => json_encode($backConfig),
                'shared_config' => $sharedConfig,
                'file_type'     => 'png',
                'is_active'     => true,
            ]);

            // Define image paths.
            $imageFolder = env('MOCKUP_IMAGE_FOLDER', 'mockups-seed');
            $frontImagePath = base_path("$imageFolder/t-shirt_mockup_front_view_in_grey_color.png");
            $backImagePath = base_path("$imageFolder/t-shirt_mockup_back_view_in_grey_color.png");

            // Use Spatie Media Library to add the front image.
            if (file_exists($frontImagePath)) {
                $frontMedia = $template->addMedia($frontImagePath)
                    ->preservingOriginal()
                    ->toMediaCollection('front_mockup_templates');
                // Update the front config with the media URL.
                $frontConfig['base_image_url'] = $frontMedia->getUrl();
            } else {
                // Rollback the transaction if the file doesn't exist
                DB::rollBack();
                throw new \Exception("Front image file does not exist.");
            }

            // Use Spatie Media Library to add the back image.
            if (file_exists($backImagePath)) {
                $backMedia = $template->addMedia($backImagePath)
                    ->preservingOriginal()
                    ->toMediaCollection('back_mockup_templates');
                // Update the back config with the media URL.
                $backConfig['base_image_url'] = $backMedia->getUrl();
            } else {
                // Rollback the transaction if the file doesn't exist
                DB::rollBack();
                throw new \Exception("Back image file does not exist.");
            }

            // Update the template record with the new configuration values.
            $template->update([
                'front_config' => $frontConfig,
                'back_config'  => $backConfig,
                'image_url'    => $frontConfig['base_image_url'],
            ]);

            // Commit the transaction after everything is successful
            DB::commit();
            echo "Mockup template created successfully!";
        } catch (\Exception $e) {
            // Rollback the transaction if any exception occurs
            DB::rollBack();
            echo "Error: " . $e->getMessage();
        }
    }
}
}


// App\Modules\Mockup\Models\MockupTemplate::destroy('01jscje38ftdp4kphrv4h6tww3');