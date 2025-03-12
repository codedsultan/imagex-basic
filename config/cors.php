<?php

return [
    'paths' => ['sanctum/csrf-cookie'], 

    'allowed_origins' => [
        // '*',
        env('USER_CLIENT_URL', 'https://users.imagex-basic.test'),
        env('ADMIN_CLIENT_URL' , 'https://admin.imagex-basic.test'),
        env('APP_URL' , 'https://imagex-basic.test'),
        
        'http://127.0.0.1:3000',
    ],

    'allowed_methods' => ['*'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
