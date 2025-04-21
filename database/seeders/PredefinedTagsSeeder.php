<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Tags\Tag;

class PredefinedTagsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $tags = [
            'Modern',
            'Classic',
            'Minimal',
            'Bold',
            'Vintage',
        ];

        foreach ($tags as $tagName) {
            // You can specify a type (e.g., 'default') if you want; otherwise, omit it.
            Tag::findOrCreate($tagName, 'default');
        }

        $mockupTemplateTags = [
            'Modern',
            'Classic',
            'Minimal',
            'Bold',
            'Vintage',
        ];

        foreach ($mockupTemplateTags as $tagName) {
            // Create or find tag with type 'mockup_template'
            Tag::findOrCreate($tagName, 'mockup_template');
        }

    }
}
