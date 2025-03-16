<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    {{-- <meta name="csrf-token" content="{{ csrf_token() }}"> --}}

    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <!-- Scripts -->
    @if(str_contains(request()->getHost(), config('app.subdomains.saas') .'.'))
        @routes('saas')
        {!! Vite::reactRefresh() !!} <!-- Must come FIRST -->
        {{-- {!! Vite::reactRefresh() !!} --}}
        {{
            // Vite::reactRefresh(),
            Vite::useHotFile(public_path('hot-saas'))
                ->useBuildDirectory('build/saas')
                ->useManifestFilename('manifest.json')
                ->withEntryPoints(['src/app.tsx'])
                // ->createAssetPathsUsing(function (string $path, ?bool $secure) {
                //     return env('APP_ENV') === 'local'
                //         ? "http:///saas.imagex-basic.test:5177/{$path}"  // Dev server URL
                //         : asset("build/user/{$path}");     // Production path
                // })

                ->createAssetPathsUsing(function (string $path, ?bool $secure) {
                    // Generate asset paths using the secure user frontend URL.
                    // Adjust the URL if you serve assets from a CDN or different subdomain.
                    return "http://saas.imagex-basic.test:5177/{$path}";
                })
        }}



        @viteReactRefresh

    @elseif(str_contains(request()->getHost(), config('app.subdomains.admin') .'.'))
        @routes('admin')
        {{
            Vite::useHotFile(public_path('hot-admin'))
                ->useBuildDirectory('build/admin')
                ->useManifestFilename('manifest.json')
                ->withEntryPoints(['src/app.ts'])
                ->createAssetPathsUsing(function (string $path, ?bool $secure) {
                    return "https://admin.imagex-basic.test/{$path}";
                })
        }}

        {{-- @vite(['src/app.ts','hot-admin']) --}}
        {{-- @vite('src/app.ts', 'build/admin', 'hot-admin') --}}
        {{-- @env('local')
            <script type="module" src="http://hot-user:5173/@vite/client"></script>
            <script type="module" src="http://hot-user:5173/src/app.tsx"></script>
        @else
            @vite('build/user/manifest.json')
        @endenv --}}
    @else
        @routes('users')
        {{-- @viteReactRefresh --}}
        {{-- @viteReactRefresh('build/user') --}}

        {{-- @vite('src/app.tsx', 'build/user') --}}
        {{-- @vite(['src/app.tsx'], 'build/user', 'hot-user') --}}
        {{
            // Vite::reactRefresh(),
            Vite::useHotFile(public_path('hot-user'))
                ->useBuildDirectory('build/user')
                ->useManifestFilename('user-manifest.json')
                ->withEntryPoints(['src/app.tsx'])
                ->createAssetPathsUsing(function (string $path, ?bool $secure) {
                    // Generate asset paths using the secure user frontend URL.
                    // Adjust the URL if you serve assets from a CDN or different subdomain.
                    return "https://imagex-basic.test/{$path}";
                })
        }}
        @viteReactRefresh
        {{-- {!! Vite::reactRefresh() !!} --}}


    @endif

    @inertiaHead
</head>
<body class="font-sans antialiased">
    @inertia
</body>
</html>
