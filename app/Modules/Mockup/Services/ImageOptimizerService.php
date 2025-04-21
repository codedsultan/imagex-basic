<?php

namespace App\Modules\Mockup\Services;

use Spatie\ImageOptimizer\OptimizerChain;
use Spatie\Image\Image;

class ImageOptimizerService
{
    public function optimizeMockup(string $path)
    {
        $optimizerChain = (new OptimizerChain)
            ->useLogger(app('log'))
            ->setTimeout(30);

        Image::load($path)
            ->optimize($optimizerChain)
            ->save();
    }
}