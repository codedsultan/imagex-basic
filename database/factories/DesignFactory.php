<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Modules\Design\Models\Design;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

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
            'user_id'     => \App\Models\User::factory(),
            'is_public'   => $this->faker->boolean,
            'design_data' => json_encode(['elements' => $this->faker->words(3)]),
        ];
    }

    public function configure()
    {
        return $this->afterCreating(function (Design $design) {
            Log::info("Creating design: ID {$design->id}, Title: {$design->title}");

            // Clear existing media in the "design_images" collection (if any)
            $design->clearMediaCollection('design_images');
            Log::info("Cleared media collection for design ID {$design->id}");

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
            Log::info("Selected image for design ID {$design->id}: {$selectedImage}");

            if (file_exists($originalPath)) {
                $design->addMedia($originalPath)
                    ->preservingOriginal()
                    ->toMediaCollection('design_images');

                Log::info("Image {$selectedImage} successfully added to design ID {$design->id}");
            } else {
                Log::warning("Image file missing: {$originalPath} for design ID {$design->id}");
            }
        });
    }
}
