<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Modules\Design\Models\DesignCategory;
use Illuminate\Support\Str;

class DesignCategoryFactory extends Factory
{
    protected $model = DesignCategory::class;

    public function definition()
    {
         $name = $this->faker->word;
         return [
              'name'        => $name,
              'slug'        => Str::slug($name) . '-' . $this->faker->unique()->numberBetween(1, 1000),
              'description' => $this->faker->sentence,
         ];
    }
}
