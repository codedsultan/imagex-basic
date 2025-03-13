<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Modules\Design\Models\Design;
use Illuminate\Support\Str;

class DesignFactory extends Factory
{
    protected $model = Design::class;

    public function definition()
    {
         $title = $this->faker->sentence;
         return [
              'title'       => $title,
              'slug'        => Str::slug($title) . '-' . $this->faker->unique()->numberBetween(1, 1000),
              'description' => $this->faker->paragraph,
              // Assuming your User model is in the default location
              'user_id'     => \App\Models\User::factory(),
              'is_public'   => $this->faker->boolean,
              'design_data' => json_encode(['elements' => $this->faker->words(3)]),
         ];
    }

    public function configure()
    {
        return $this->afterCreating(function (Design $design) {
            // Clear existing media in the "design_images" collection (if any)
            $design->clearMediaCollection('design_images');

            // List of sample design image filenames (must exist in storage/app/public/designs)
            $designImages = [
                'alim.jpg',
                'alimi.jpg',
                'christoph.jpg',
                'fatima-yusuf.jpg',
                'holly-mandarich.jpg',
                'kevin-charit.jpg',
                'logan-weaver.jpg',
                'marek-pavlik.jpg',
                'resource-database.jpg',
                'simone-dinoia.jpg',
                'victoria-wang.jpg'
            ];

            $selectedImage = $designImages[array_rand($designImages)];
            $originalPath = storage_path('app/public/designs/' . $selectedImage);

            if (file_exists($originalPath)) {
                // Attach the image file to the "design_images" collection.
                // This triggers the media conversions defined on the Design model.
                $design->addMedia($originalPath)
                    ->preservingOriginal()
                    ->toMediaCollection('design_images');
            }
        });
    }
}
