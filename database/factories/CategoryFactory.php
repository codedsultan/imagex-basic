<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Modules\Product\Models\Category;
use Illuminate\Support\Str;

class CategoryFactory extends Factory
{
    protected $model = Category::class;

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
