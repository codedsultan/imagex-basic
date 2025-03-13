<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Modules\Product\Models\Category;

class CategorySeeder extends Seeder
{
    public function run()
    {
         Category::factory()->count(5)->create();
    }
}
