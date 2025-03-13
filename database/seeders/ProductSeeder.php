<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Modules\Product\Models\Product;

class ProductSeeder extends Seeder
{
    public function run()
    {
         Product::factory()->count(20)->create();
    }
}
