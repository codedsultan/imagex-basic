<?php

namespace App\Modules\Design\Providers;

use Illuminate\Support\ServiceProvider;


class DesignServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->bind(
            \App\Modules\Design\Interfaces\Repositories\DesignRepositoryInterface::class,
            \App\Modules\Design\Repositories\EloquentDesignRepository::class

        );

        $this->app->bind(
            \App\Modules\Design\Interfaces\Services\DesignServiceInterface::class,
            \App\Modules\Design\Services\DesignService::class
        );

    }

    public function boot()
    {
        //
    }
}
