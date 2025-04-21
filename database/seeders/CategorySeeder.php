<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Modules\Product\Models\Category;

class CategorySeeder extends Seeder
{
    public function run()
    {
        // Category::factory()->count(5)->create();

         // Parent Category: Clothing
        $clothing = Category::create([
            'name' => 'Clothing',
            'slug' => 'clothing',
            'is_gender_based' => false,
            'parent_id' => null,
        ]);

        // Define subcategories
        $subcategories = ['T-Shirt', 'Hoodie', 'Tank Top', 'Long Sleeve', 'Polo', 'Custom'];

        foreach ($subcategories as $subcategory) {
            $isGenderBased = $subcategory === 'T-Shirt'; // Only T-Shirts have gender-based categories

            $subCategory = Category::create([
                'name' => $subcategory,
                // 'slug' => strtolower(str_replace(' ', '_', $subcategory)),
                'is_gender_based' => $isGenderBased,
                'parent_id' => $clothing->id,
            ]);

            // If gender-based, create gender subcategories
            if ($isGenderBased) {
                $genders = [
                    ['name' => "Men's $subcategory", 'gender' => 'male'],
                    ['name' => "Women's $subcategory", 'gender' => 'female'],
                    ['name' => "Unisex $subcategory", 'gender' => 'unisex'],
                ];

                foreach ($genders as $genderCategory) {
                    Category::create([
                        'name' => $genderCategory['name'],
                        'slug' => strtolower(str_replace(' ', '_', $genderCategory['name'])),
                        'is_gender_based' => true,
                        'parent_id' => $subCategory->id,
                        'gender' => $genderCategory['gender'],
                    ]);
                }
            }
        }

    }
}
