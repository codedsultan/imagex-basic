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
        // $this->app->bind(UserRepositoryInterface::class, EloquentUserRepository::class);
        // $this->app->bind(UserServiceInterface::class, UserService::class);
    }

    public function boot()
    {
        //
    }
}