<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use App\Modules\Design\Models\Design;
use App\Modules\Design\Models\DesignCategory;

class DesignSeeder extends Seeder
{
    public function run()
    {
        // Create 20 designs and attach random design categories to each
        //  Design::factory()->count(20)->create()->each(function ($design) {
        //       $designCategories = DesignCategory::inRandomOrder()->take(rand(1, 3))->pluck('id');
        //       $design->categories()->attach($designCategories);
        //  });


        $user = User::where('email', '=', 'test@example.com')->first();
        // $designs = Design::factory()->count(10)->create();
        // Design::factory()->count(10)->create();
        // dd($designs);
        // for ($i = 0; $i < 10; $i++) {
        Design::factory()->count(10)->for($user)->create()->each(function ($design) {
            $designCategories = DesignCategory::inRandomOrder()->take(rand(1, 3))->pluck('id');
            $design->categories()->attach($designCategories);
        });
    }
}
