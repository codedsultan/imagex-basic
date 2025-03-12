<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SetLoginRedirect
{
    /**
     * Handle an incoming request.
     *
     * This middleware sets a session variable "login_redirect" based on the request's host.
     * It can then be used after login to redirect users to the correct login page.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // $host = $request->getHost();

        // if ($host === 'admin.imagex-basic.test' || $host === 'admin.imagex-basic') {
        //     session(['login_redirect' => route('admin.login')]);
        // } elseif ($host === 'users.imagex-basic.test' || $host === 'users.imagex-basic') {
        //     session(['login_redirect' => route('user.login')]);
        // } else {
        //     session(['login_redirect' => '/auth/login']);
        // }

        return $next($request);
    }
}


// XSRF-TOKEN=eyJpdiI6ImRwTTJXOFVzem05YXpCd2FxaGNiSmc9PSIsInZhbHVlIjoiR3pXbkNFWEd0R3dLNTlBeDE4TTdIZ085VDlsOEhDd2l4RjVYVUJ1RWR6Z3grRElrZ29kWEREcE1MNUNMenU0VGZmMXluUE1PbGVsZnMrRkMxeUdXczl4dUxTbTdOUGY3M3dTNGd4K0t5cHdYNlo5RzBYYzM5SUM5NHIwQU1HOFMiLCJtYWMiOiJkM2U0NWQyY2EyM2VhM2IyMGJhMDUyNzkyNTlmYjY5NTJiMmVjMGNhNDZkODE1NmEyZmRmMGE0MjZlODhiYzA2IiwidGFnIjoiIn0%3D; expires=Wed, 12 Mar 2025 14:26:44 GMT; Max-Age=7200; path=/; domain=.imagex-basic.test; secure; samesite=laxXSRF-TOKEN=eyJpdiI6IkNKWW16Q1N5bWRiZ08ydkZSOGt4WGc9PSIsInZhbHVlIjoiUExUTHNaZHp1MEs0YXJjWHUyYVVkUEQvNjB6MDZtZloxcW0wZHh2bzVCSjUyeUphM0hqekZWM3gwWkprck5QN0xTU05GaVgzeS9McFcwQ3lFcGF1dGp1bGpoWnVpM1l1THpaVzhLVE5aS1BBeWEwcVZCKzRlZG9mQzM0SlJwdi8iLCJtYWMiOiI0ZTA5YjljNTU2MWViNWJiMjQ2ZWJmODdkZGU5YzY1MDc4MjA0MjRkNjVlNTQ5ZGQyOGJiYjFiOWZiOTZjZmQ4IiwidGFnIjoiIn0%3D; laravel_session=eyJpdiI6IlNMSDUzenlsbHY0Y0svUEIrRlA3cmc9PSIsInZhbHVlIjoiZW5KN2draDl5S3dHZG9OVmpLU0pwVHFjRVd6WGxtTHFCalF3ZVNHVmY5V0oycjNkSDhLTUVKOENQZWI2UXdCOGNyT3BRNEtZa1VRV3lTN2dqK1pZdEp4anQzeE50UmZwVFFSU25jOVdLZVBuNTdoeTFOc0IrYVJmZHhGdFIxdlYiLCJtYWMiOiI1MTlhNWE3YjgzZWU0M2VlM2Y2ZmIyZTM0NTkxMTkwMjRjNTM3ODg4NDA5MGFmMTdmZDRjMTBlMDNjYzQ3Y2Q2IiwidGFnIjoiIn0%3D; XSRF-TOKEN=eyJpdiI6ImRwTTJXOFVzem05YXpCd2FxaGNiSmc9PSIsInZhbHVlIjoiR3pXbkNFWEd0R3dLNTlBeDE4TTdIZ085VDlsOEhDd2l4RjVYVUJ1RWR6Z3grRElrZ29kWEREcE1MNUNMenU0VGZmMXluUE1PbGVsZnMrRkMxeUdXczl4dUxTbTdOUGY3M3dTNGd4K0t5cHdYNlo5RzBYYzM5SUM5NHIwQU1HOFMiLCJtYWMiOiJkM2U0NWQyY2EyM2VhM2IyMGJhMDUyNzkyNTlmYjY5NTJiMmVjMGNhNDZkODE1NmEyZmRmMGE0MjZlODhiYzA2IiwidGFnIjoiIn0%3D; laravel_session=eyJpdiI6IjYvQWxGTENDNFZIT2dkWWhBdW1UU1E9PSIsInZhbHVlIjoidzhCRktIRS9HNjRudXpKSEFXSlhpVUZPemhzbjQrV0VKcDFLU1g5TUNPTVlhdG1LZU1la2lkL0t4QlZYMlk1RTlPMkdPQzdvUE5OeEtFdzZ6ZnF4ZVZYd04zZFdhcnp2cDRhUGw3THpUeUpuOUFRTUszaVQvNDh5VnEzaHd6ODMiLCJtYWMiOiIyYzI5MmEwMGVjMDQ0OTUyMTM0YzhiNzk2Y2Q0YWFjYWZlMGJmOWFhNjRmODc1MjYxOGFhOGIzZWQ0YTYxNDhhIiwidGFnIjoiIn0%3D
// XSRF-TOKEN=eyJpdiI6IkNKWW16Q1N5bWRiZ08ydkZSOGt4WGc9PSIsInZhbHVlIjoiUExUTHNaZHp1MEs0YXJjWHUyYVVkUEQvNjB6MDZtZloxcW0wZHh2bzVCSjUyeUphM0hqekZWM3gwWkprck5QN0xTU05GaVgzeS9McFcwQ3lFcGF1dGp1bGpoWnVpM1l1THpaVzhLVE5aS1BBeWEwcVZCKzRlZG9mQzM0SlJwdi8iLCJtYWMiOiI0ZTA5YjljNTU2MWViNWJiMjQ2ZWJmODdkZGU5YzY1MDc4MjA0MjRkNjVlNTQ5ZGQyOGJiYjFiOWZiOTZjZmQ4IiwidGFnIjoiIn0%3D; laravel_session=eyJpdiI6IlNMSDUzenlsbHY0Y0svUEIrRlA3cmc9PSIsInZhbHVlIjoiZW5KN2draDl5S3dHZG9OVmpLU0pwVHFjRVd6WGxtTHFCalF3ZVNHVmY5V0oycjNkSDhLTUVKOENQZWI2UXdCOGNyT3BRNEtZa1VRV3lTN2dqK1pZdEp4anQzeE50UmZwVFFSU25jOVdLZVBuNTdoeTFOc0IrYVJmZHhGdFIxdlYiLCJtYWMiOiI1MTlhNWE3YjgzZWU0M2VlM2Y2ZmIyZTM0NTkxMTkwMjRjNTM3ODg4NDA5MGFmMTdmZDRjMTBlMDNjYzQ3Y2Q2IiwidGFnIjoiIn0%3D; XSRF-TOKEN=eyJpdiI6ImRwTTJXOFVzem05YXpCd2FxaGNiSmc9PSIsInZhbHVlIjoiR3pXbkNFWEd0R3dLNTlBeDE4TTdIZ085VDlsOEhDd2l4RjVYVUJ1RWR6Z3grRElrZ29kWEREcE1MNUNMenU0VGZmMXluUE1PbGVsZnMrRkMxeUdXczl4dUxTbTdOUGY3M3dTNGd4K0t5cHdYNlo5RzBYYzM5SUM5NHIwQU1HOFMiLCJtYWMiOiJkM2U0NWQyY2EyM2VhM2IyMGJhMDUyNzkyNTlmYjY5NTJiMmVjMGNhNDZkODE1NmEyZmRmMGE0MjZlODhiYzA2IiwidGFnIjoiIn0%3D; laravel_session=eyJpdiI6IjYvQWxGTENDNFZIT2dkWWhBdW1UU1E9PSIsInZhbHVlIjoidzhCRktIRS9HNjRudXpKSEFXSlhpVUZPemhzbjQrV0VKcDFLU1g5TUNPTVlhdG1LZU1la2lkL0t4QlZYMlk1RTlPMkdPQzdvUE5OeEtFdzZ6ZnF4ZVZYd04zZFdhcnp2cDRhUGw3THpUeUpuOUFRTUszaVQvNDh5VnEzaHd6ODMiLCJtYWMiOiIyYzI5MmEwMGVjMDQ0OTUyMTM0YzhiNzk2Y2Q0YWFjYWZlMGJmOWFhNjRmODc1MjYxOGFhOGIzZWQ0YTYxNDhhIiwidGFnIjoiIn0%3D
