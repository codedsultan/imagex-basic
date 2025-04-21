<?php

namespace Database\Seeders;

use App\Models\EditorTemplate;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class EditorTemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Create mockup templates
        $this->createMockupTemplates();

        // Create design templates
        $this->createDesignTemplates();

        // Create packaging templates
        $this->createPackagingTemplates();

        // // Create some random templates
        // EditorTemplate::factory()->count(5)->create();
    }

    /**
     * Create predefined mockup templates
     */
    private function createMockupTemplates()
    {

        $templates = [
            [
                'name' => 'Product Mockup',
                'configuration' => [
                    'width' => 800,
                    'height' => 600,
                    'backgroundGrid' => true,
                    'snapToGrid' => true,
                    'gridSize' => 10
                ]
            ],
            [
                'name' => 'T-shirt Mockup',
                'configuration' => [
                    'width' => 1000,
                    'height' => 1200,
                    'backgroundGrid' => true,
                    'snapToGrid' => true,
                    'gridSize' => 10
                ]
            ]
        ];

        // Create an instance of ImageManager (using GD driver; you can change to imagick if desired)
        $manager = new ImageManager( new Driver());

        foreach ($templates as $template) {
            $imageFolder = env('MOCKUP_IMAGE_FOLDER', 'mockups-seed');

            // Retrieve actual image dimensions
            $frontImage = base_path("$imageFolder/t-shirt_mockup_font_view_in_grey_color.png");
            $imagePath = base_path("$imageFolder/t-shirt_mockup_back_view_in_grey_color.png");
            $defaultWidth = $template['configuration']['width'];
            $defaultHeight = $template['configuration']['height'];

            if (file_exists($imagePath)) {
                $image = $manager->read($imagePath);
                $imageWidth = $image->width();
                $imageHeight = $image->height();
            } else {
                // Fallback to configuration defaults if file not found.
                $imageWidth = $defaultWidth;
                $imageHeight = $defaultHeight;
            }

            $template =  EditorTemplate::create([
                // 'id' => Str::uuid()->toString(),
                'name' => $template['name'],
                'type' => 'mockup',
                'layers' => '[]',
                'configuration' => json_encode($template['configuration']),
                'width' => $template['configuration']['width'],
                'height' => $template['configuration']['height'],
                // 'thumbnail_url' => 'https://via.placeholder.com/200x150?text=' . urlencode($template['name'])
            ]);

            // dd($imagePath);
            $imagePath = base_path("$imageFolder/t-shirt_mockup_back_view_in_grey_color.png");
            // dd($imagePath);
            $media = $template->addMedia($imagePath)
                ->preservingOriginal()
                ->toMediaCollection('editor_templates');

            $imageSrc = $media->getUrl();

            $defaultLayers = [
                [
                    'type' => 'image',
                    'version' => '6.6.1',
                    'originX' => 'left',
                    'originY' => 'top',
                    'left' => 0,
                    'top' => 0,
                    'width' => $imageWidth,
                    'height' => $imageHeight,
                    'scaleX' => 1,
                    'scaleY' => 1,
                    'src' => $imageSrc,
                    'selectable' => true,
                    'hasControls' => true,
                    'lockMovementX' => false,
                    'lockMovementY' => false,
                    'metadata' => [
                        'id' => 'default-image',
                        'category' => 'background'
                    ],
                    'crossOrigin' => 'anonymous'
                ],
                [
                    'type' => 'textbox',
                    'version' => '6.6.1',
                    'left' => $defaultWidth / 2,
                    'top' => $defaultHeight / 2,
                    'originX' => 'center',
                    'originY' => 'center',
                    'text' => 'Default text here',
                    'fontSize' => 48,
                    'fontFamily' => 'Arial',
                    'fill' => '#FFFFFF',
                    'selectable' => true,
                    'hasControls' => true,
                    'metadata' => [
                        'id' => 'default-text',
                        'editable' => true
                    ],
                    'crossOrigin' => 'anonymous'
                ]
            ];

            $template->update(['layers' =>json_encode($defaultLayers)]);

        }
    }

    /**
     * Create predefined design templates
     */
    private function createDesignTemplates()
    {
        $templates = [
            [
                'name' => 'Social Media Post',
                'configuration' => [
                    'width' => 1200,
                    'height' => 1200,
                    'backgroundGrid' => false,
                    'snapToGrid' => false,
                    'artboard' => true
                ]
            ],
            [
                'name' => 'Business Card',
                'configuration' => [
                    'width' => 1050,
                    'height' => 600,
                    'backgroundGrid' => true,
                    'snapToGrid' => true,
                    'artboard' => true
                ]
            ]
        ];

        foreach ($templates as $template) {

        // Define meaningful default layers for a design template.
            $defaultLayers = [
                [
                    'id' => 'artboard',
                    'type' => 'rect',
                    'version' => '6.6.1', // Ensure compatibility with Fabric.js
                    'left' => 0,
                    'top' => 0,
                    'width' => $template['configuration']['width'],
                    'height' => $template['configuration']['height'],
                    'fill' => '#ffffff',
                    'selectable' => false,
                    'hasControls' => false, // Artboard should not be editable
                    'metadata' => [
                        'id' => 'artboard-layer',
                        'category' => 'background'
                    ]
                ],
                [
                    'id' => 'design-text',
                    'type' => 'textbox',
                    'version' => '6.6.1', // Fabric.js version
                    'text' => 'Design your content here',
                    'left' => $template['configuration']['width'] / 2, // Center horizontally
                    'top' => $template['configuration']['height'] / 2, // Center vertically
                    'fontSize' => 24,
                    'fontFamily' => 'Helvetica',
                    'fill' => '#333333',
                    'originX' => 'center',
                    'originY' => 'center',
                    'selectable' => true,
                    'hasControls' => true,
                    'metadata' => [
                        'id' => 'design-text-layer',
                        'editable' => true
                    ],
                    'crossOrigin' => 'anonymous' // Ensure proper loading for text layers
                ]
            ];

                // Path to the new seed images folder
            $designImagesPath = base_path('designs-seed/');

            // List images in the new folder
            $designImages = glob($designImagesPath . '*.{jpg,png}', GLOB_BRACE);
            $selectedImage = $designImages[array_rand($designImages)];
            $template =  EditorTemplate::create([
                    // 'id' => Str::uuid()->toString(),
                    'name' => $template['name'],
                    'type' => 'design',
                    'layers' => json_encode($defaultLayers),
                    'configuration' => $template['configuration'],
                    'width' => $template['configuration']['width'],
                    'height' => $template['configuration']['height'],
                    // 'thumbnail_url' => 'https://via.placeholder.com/200x150?text=' . urlencode($template['name'])
                ]);

                // Attach a sample image as a thumbnail.
            // Ensure that the file exists at storage/app/public/sample-mockup.jpg.
            $template->addMedia($selectedImage)
                ->preservingOriginal()
                ->toMediaCollection('editor_templates');
        }
    }

    /**
     * Create predefined packaging templates
     */
    private function createPackagingTemplates()
    {
        $templates = [
            [
                'name' => 'Box Package',
                'configuration' => [
                    'width' => 1000,
                    'height' => 1000,
                    'backgroundGrid' => true,
                    'snapToGrid' => true,
                    'gridSize' => 20,
                    'dieLine' => true
                ]
            ],
            [
                'name' => 'Label Design',
                'configuration' => [
                    'width' => 800,
                    'height' => 500,
                    'backgroundGrid' => true,
                    'snapToGrid' => true,
                    'gridSize' => 10,
                    'dieLine' => true
                ]
            ]
        ];

        foreach ($templates as $template) {
            // Define meaningful default layers for a packaging template.
            $defaultLayers = [
                [
                    'id' => 'dieline',
                    'type' => 'path',
                    'version' => '6.6.1', // Ensure compatibility with Fabric.js
                    'path' => 'M10 10 L990 10 L990 990 L10 990 Z', // Simple square dieline
                    'stroke' => '#000000',
                    'strokeWidth' => 2,
                    'fill' => 'transparent',
                    'selectable' => false,
                    'hasControls' => false, // Dieline should not be editable
                    'metadata' => [
                        'id' => 'dieline-layer',
                        'category' => 'guidelines'
                    ]
                ],
                [
                    'id' => 'packaging-image',
                    'type' => 'image',
                    'version' => '6.6.1', // Ensure compatibility with Fabric.js
                    'src' => '', // Leave empty or provide a default
                    'left' => 50,
                    'top' => 50,
                    'scaleX' => 1,
                    'scaleY' => 1,
                    'selectable' => true,
                    'hasControls' => true, // Allow image resizing
                    'crossOrigin' => 'anonymous', // Prevent CORS issues
                    'metadata' => [
                        'id' => 'packaging-image-layer',
                        'editable' => true
                    ]
                ]
            ];

            $designImagesPath = base_path('designs-seed/');

            // List images in the new folder
            $designImages = glob($designImagesPath . '*.{jpg,png}', GLOB_BRACE);
            $selectedImage = $designImages[array_rand($designImages)];
            $template = EditorTemplate::create([
                    // 'id' => Str::uuid()->toString(),
                    'name' => $template['name'],
                    'type' => 'packaging',
                    'layers' => json_encode($defaultLayers),
                    'configuration' => $template['configuration'],
                    'width' => $template['configuration']['width'],
                    'height' => $template['configuration']['height'],
                    // 'thumbnail_url' => 'https://via.placeholder.com/200x150?text=' . urlencode($template['name'])
            ]);

            $template->addMedia($selectedImage)
                ->preservingOriginal()
                ->toMediaCollection('editor_templates');
        }
    }
}
