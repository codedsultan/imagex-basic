<?php

namespace App\Modules\Product\Providers;

use Illuminate\Support\ServiceProvider;


class ProductServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->bind(
            \App\Modules\Product\Interfaces\Repositories\ProductRepositoryInterface::class,
            \App\Modules\Product\Repositories\EloquentProductRepository::class

        );

        $this->app->bind(
            \App\Modules\Product\Interfaces\Services\ProductServiceInterface::class,
            \App\Modules\Product\Services\ProductService::class
        );

        
    }

    public function boot()
    {
        //
    }
}