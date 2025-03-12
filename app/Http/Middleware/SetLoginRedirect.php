<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SetLoginRedirect
{
    public function handle(Request $request, Closure $next)
    {
        $host = $request->getHost();

        if ($host === 'admin.imagex-basic.test' || $host === 'admin.imagex-basic') {
            session(['login_redirect' => route('admin.login')]);
        } elseif ($host === 'users.imagex-basic.test' || $host === 'users.imagex-basic') {
            session(['login_redirect' => route('user.login')]);
        } else {
            session(['login_redirect' => '/']);
        }

        return $next($request);
    }
}
