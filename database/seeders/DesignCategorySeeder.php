<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Modules\Design\Models\DesignCategory;

class DesignCategorySeeder extends Seeder
{
    public function run()
    {
         DesignCategory::factory()->count(5)->create();
    }
}
