<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Dashboard</title>
    <!-- Load the CSS built for the user frontend -->
    <link rel="stylesheet" href="{{ asset('build/user-frontend/app.css') }}">
    @routes {{-- Ziggy routes if needed --}}
</head>
<body>
    @inertia
    <!-- Load the JavaScript bundle for the user frontend -->
    {{-- <script src="{{ asset('build/user-frontend/app.js') }}"></script> --}}
    {{-- @vite('resources/js/app.tsx') --}}
    @vite('frontend/user-frontend/src/index.tsx')


</body>
</html>
