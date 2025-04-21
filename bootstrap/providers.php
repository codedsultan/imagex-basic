<?php

return [
    App\Providers\AppServiceProvider::class,
    App\Modules\User\UserServiceProvider::class,
    App\Providers\InertiaMacroServiceProvider::class,
    App\Modules\Design\Providers\DesignServiceProvider::class,
    App\Modules\Product\Providers\ProductServiceProvider::class,
    App\Modules\Mockup\Providers\MockupServiceProvider::class,
];
