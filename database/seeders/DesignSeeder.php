<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Modules\Design\Models\Design;
use App\Modules\Design\Models\DesignCategory;

class DesignSeeder extends Seeder
{
    public function run()
    {
         // Create 20 designs and attach random design categories to each
         Design::factory()->count(20)->create()->each(function ($design) {
              $designCategories = DesignCategory::inRandomOrder()->take(rand(1, 3))->pluck('id');
              $design->categories()->attach($designCategories);
         });
    }
}
