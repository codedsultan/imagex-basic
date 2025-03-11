<?php

namespace App\Http\Middleware;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'ziggy' => fn () => [
                'base_url' => $request->getHost(),
                'location' => $request->url(),
                'query' => $request->query(),
            ],
            'flash' => fn () => [
                'status' => strtolower($request->session()->get('status', '')),
                'message' => $request->session()->get('message'),
                'title' => $request->session()->get('title'),
                'success' => $request->session()->get('success'),
                'meta' => $request->session()->get('meta'),
            ],
            'auth' => fn () => $this->getAuthData($request),
            'app' => $this->getAppName($request),
            'notifications' => fn () => [
                [
                    'id' => 1,
                    'message' => 'New Notification',
                    'title' => 'New Notification',
                    'details' => 'Just a test notification',
                    'type' => 'info',
                    'unread' => true,
                ],
            ] ?? $request->user()->notifications,
        ]);
    }

    private function getAppName(Request $request)
    {
        $domain = $request->getHost();

        if (strpos($domain, config('app.subdomains.admin')) === 0) {
            return 'admin';
        } elseif (strpos($domain, config('app.subdomains.users')) === 0) {
            return 'users';
        }
    }


    private function getAuthData(Request $request)
    {
        $user = $request->user();

        if (! $user) {
            return;
        }

        $domain = $request->getHost();

        return match (true) {
            strpos($domain, config('app.subdomains.admin').'.') === 0 => $this->getAdminAuthData($user),
            strpos($domain, config('app.subdomains.users').'.') === 0 => $this->getUserAuthData($user),
            default => null,
        };
    }


    private function getAdminAuthData(User $user)
    {
        return [
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => $user->profile_photo_url,
                'timezone' => $user->timezone ?? null,
                // 'roles' => $user?->getRoleNames() ?? ['admin'],
                // 'permissions' => $user?->getAllPermissions()?->pluck('name') ?? [],
            ],
        ];
    }



    private function getUserAuthData(User $user)
    {
        return [
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => $user->avatar,
                'timezone' => $user->timezone ?? null,
            ],
        ];
    }
}
