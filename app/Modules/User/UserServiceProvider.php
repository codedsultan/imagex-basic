<?php

namespace App\Modules\User;

use Illuminate\Support\ServiceProvider;
use App\Modules\User\Interfaces\UserRepositoryInterface;
use App\Modules\User\Repositories\EloquentUserRepository;
use App\Modules\User\Interfaces\UserServiceInterface;
use App\Modules\User\Services\UserService;

class UserServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->bind(UserRepositoryInterface::class, EloquentUserRepository::class);
        $this->app->bind(UserServiceInterface::class, UserService::class);
    }

    public function boot()
    {
        //
    }
}
