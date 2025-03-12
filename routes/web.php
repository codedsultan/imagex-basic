
<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;


// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');
// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
// User subdomain routes
$domain = config('app.subdomains.users').'.'.config('app.domain');
$adminDomain = config('app.subdomains.admin').'.'.config('app.domain');
$saasDomain = config('app.subdomains.saas').'.'.config('app.domain');
// foreach (glob(app_path('Modules/*/Routes/web.php')) as $moduleRouteFile) {
//     require $moduleRouteFile;
// }
Route::domain($saasDomain)->group(function () {
    foreach (glob(app_path('Modules/*/Routes/web.php')) as $moduleRouteFile) {
        require $moduleRouteFile;
    }
});
Route::get('/', function (Request $request) {
    
        $domain = $request->getHost();

        if (strpos($domain, config('app.subdomains.admin')) === 0) {
            return Inertia::render('Auth/Login'); 
        } elseif (strpos($domain, config('app.subdomains.users')) === 0) {
            return Inertia::render('LandingPage'); 
        } elseif (strpos($domain, config('app.subdomains.saas')) === 0) {
            return Inertia::render('LandingPage'); 
        }  
        else {
            return Inertia::render('LandingPage'); 
        }
     // Ensure you have a LandingPage component

})->name('landing');
Route::domain($adminDomain)->group(function () {
    // Route::get('/', function () {
    //     // dd('here');
    //     return Inertia::render('Auth/Login'); // Ensure you have a LandingPage component
    // })->name('admin.login');

    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->middleware(['auth', 'verified'])->name('dashboard');
});

// Load module API routes
// foreach (glob(app_path('Modules/*/Routes/api.php')) as $moduleRouteFile) {
//     require $moduleRouteFile;
// }

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');