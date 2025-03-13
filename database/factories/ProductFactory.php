<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Modules\Product\Models\Product;
use App\Modules\Product\Models\Category;
use Illuminate\Support\Str;

class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition()
    {
         $name = $this->faker->word;
         return [
              'name'         => $name,
              'slug'         => Str::slug($name) . '-' . $this->faker->unique()->numberBetween(1, 1000),
              'description'  => $this->faker->paragraph,
              'price'        => $this->faker->randomFloat(2, 10, 100),
              // Use factory for the related category
              'category_id'  => Category::factory(),
              'product_type' => $this->faker->randomElement(['simple', 'variable', 'digital']),
         ];
    }
}
