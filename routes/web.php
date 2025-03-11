<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;



// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
// User subdomain routes
// Route::domain(config('app.subdomains.users').'.'.config('app.domain'), function () {
// dd(config('app.subdomains.users').'.'.config('app.domain'));
$domain = config('app.subdomains.users').'.'.config('app.domain');
Route::domain($domain)->group(function () {
    // dd('here');
    // Route::get('/', function () {
    //     // Return the user blade view which loads the user bundle (e.g., from public/build/user-frontend)
    //     return view('user');
    // });

    // Additional user routes can be placed here
    Route::get('/user/login', function () {
        // dd('here');
        return Inertia::render('Login'); // This will load the Dashboard component for user
    });
});


foreach (glob(app_path('Modules/*/Routes/web.php')) as $moduleRouteFile) {
    require $moduleRouteFile;
}

// Load module API routes
// foreach (glob(app_path('Modules/*/Routes/api.php')) as $moduleRouteFile) {
//     require $moduleRouteFile;
// }
