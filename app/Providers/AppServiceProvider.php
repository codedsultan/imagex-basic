<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Opcodes\LogViewer\Facades\LogViewer;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {



    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        LogViewer::auth(function ($request) {
            // return true to allow viewing the Log Viewer.
            return $request->user()
                && in_array($request->user()->email, [
                    'test@example.com',
                ]);

        });
    }
}
