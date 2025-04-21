<?php

namespace Database\Seeders;

use App\Modules\Mockup\Models\MockupTemplate;
use App\Modules\Product\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Spatie\Tags\Tag;

class MockupTemplateSeeder extends Seeder
{
    public function run()
    {
        $imageFolder = env('MOCKUP_IMAGE_FOLDER', 'mockups-seed');

        $templates = [
            [
                'name' => 'Black T-Shirt Front',
                'category_slug' => 't-shirt',
                'view_angle' => 'front',
                'color_code' => '#000000',
                'model_type' => 'unisex',
                'template_path' => "$imageFolder/t-shirt_mockup_front_view_in_black_color.png",
                'design_area' => json_encode([
                    'x' => 250, 'y' => 150, 'width' => 300, 'height' => 350, 'rotation' => 0
                ]),
                'is_active' => true
            ],
            [
                'name' => 'Black T-Shirt Back',
                'category_slug' => 't-shirt',
                'view_angle' => 'back',
                'color_code' => '#000000',
                'model_type' => 'unisex',
                'template_path' => "$imageFolder/t-shirt_mockup_back_view_in_black_color.png",
                'design_area' => json_encode([
                    'x' => 250, 'y' => 150, 'width' => 300, 'height' => 350, 'rotation' => 0
                ]),
                'is_active' => true
            ],
            [
                'name' => 'White T-Shirt Front',
                'category_slug' => 't-shirt',
                'view_angle' => 'front',
                'color_code' => '#FFFFFF',
                'model_type' => 'unisex',
                'template_path' => "$imageFolder/t-shirt_mockup_front_view_in_white_color.png",
                'design_area' => json_encode([
                    'x' => 250, 'y' => 150, 'width' => 300, 'height' => 350, 'rotation' => 0
                ]),
                'is_active' => true
            ],
            [
                'name' => 'Red T-Shirt Back',
                'category_slug' => 't-shirt',
                'view_angle' => 'back',
                'color_code' => '#FF0000',
                'model_type' => 'unisex',
                'template_path' => "$imageFolder/t-shirt_mockup_back_view_in_red_color.png",
                'design_area' => json_encode([
                    'x' => 250, 'y' => 150, 'width' => 300, 'height' => 350, 'rotation' => 0
                ]),
                'is_active' => true
            ],
        ];

        foreach ($templates as $template) {
            $category = Category::where('slug', $template['category_slug'])->first();

            if ($category) {
                $template = MockupTemplate::create([
                    'name' => $template['name'],
                    'slug' => Str::slug($template['name']), // Generate slug from name
                    'category_id' => $category->id,
                    'view_angle' => $template['view_angle'],
                    'color_code' => $template['color_code'],
                    'model_type' => $template['model_type'],
                    'template_path' => $template['template_path'],
                    'design_area' => $template['design_area'],
                    'is_active' => $template['is_active'],
                ]);


                // Handle Image Upload to Spatie Media Library
                // $designImagesPath = base_path('designs-seed/');
                $imagePath = base_path("{$template['template_path']}"); // Adjust based on your storage setup
                if (file_exists($imagePath)) {
                    $template->addMedia($imagePath)->preservingOriginal()->toMediaCollection('template_images');
                } else {
                    echo "Image not found: $imagePath\n"; // Debugging
                }

                // Retrieve all available tags for mockup templates.
                // $allTags = Tag::where('type', 'mockup_template')->pluck('name')->toArray();
                // Retrieve all available tags for mockup templates.
                $allTags = Tag::where('type', 'mockup_template')->get();

                // Randomly select 3 tags. (Ensure there are at least 3 available!)
                $randomTags = $allTags->random(3)->pluck('name')->toArray();

                // Attach all tags to your MockupTemplate model instance.
                $template->syncTags($randomTags, 'mockup_template');
            }
        }
    }
}
