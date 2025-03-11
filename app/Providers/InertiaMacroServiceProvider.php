<?php

declare(strict_types=1);

namespace App\Providers;

use Inertia\Inertia;
use Illuminate\Support\ServiceProvider;
use App\Extensions\Inertia\ResponseFactory;

class InertiaMacroServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Create and bind our extended ResponseFactory
        $this->app->singleton(ResponseFactory::class);
        $this->app->alias(ResponseFactory::class, 'inertia');

        // Replace Inertia's default factory with our extended version
        $this->app->extend('inertia', function () {
            return new ResponseFactory;
        });
    }

    public function boot(): void
    {
        // Register Inertia macros
        $this->registerInertiaMacros();
    }

    protected function registerInertiaMacros(): void
    {
        ResponseFactory::macro('renderAdmin', function (string $component, array $props = []) {
            // Prefix the component path with "Admin::"
            $adminComponent = 'admin-frontend::'.$component;

            // Call the original render method with the modified component path
            /** @var ResponseFactory $this */
            return $this->render($adminComponent, $props);
        });

        ResponseFactory::macro('renderUser', function (string $component, array $props = []) {
            // Prefix the component path with "user-frontend::"
            $businessComponent = 'user-frontend::'.$component;

            // Call the original render method with the modified component path
            /** @var ResponseFactory $this */
            return $this->render($businessComponent, $props);
        });


    }
}
