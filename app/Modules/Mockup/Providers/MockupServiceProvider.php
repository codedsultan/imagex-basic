<?php

namespace App\Modules\Mockup\Providers;

use Illuminate\Support\ServiceProvider;


class MockupServiceProvider extends ServiceProvider
{
    public function register()
    {

        $this->app->bind(
            \App\Modules\Mockup\Interfaces\Services\MockupServiceInterface::class,
            \App\Modules\Mockup\Services\MockupService::class
        );

    }

    public function boot()
    {
        //
    }
}
