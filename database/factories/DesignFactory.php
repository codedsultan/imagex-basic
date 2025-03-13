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
         ];
    }
}
