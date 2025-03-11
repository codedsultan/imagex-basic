<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        {{-- @routes
        @viteReactRefresh --}}
        {{-- @vite(['resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"]) --}}
        @if(str_contains(request()->getHost(), config('app.subdomains.users') .'.'))
            @routes('users')
            @viteReactRefresh
            @vite(['src/app.tsx'])
            {{-- @vite('src/app.tsx') --}}

            {{-- @env('local')
                <script src="https://unpkg.com/react-scan/dist/auto.global.js"></script>
            @endenv --}}
        @elseif(str_contains(request()->getHost(), config('app.subdomains.admin') .'.'))
            @routes('admin')
            @vite(['frontend/admin-frontend/app.js'])

        @endif

        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
