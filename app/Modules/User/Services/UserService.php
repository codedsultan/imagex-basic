<?php

namespace App\Modules\User\Services;

use App\Modules\User\Interfaces\UserServiceInterface;
use App\Modules\User\Interfaces\UserRepositoryInterface;
use App\Models\User;
use Spatie\Activitylog\Facades\LogBatch;
use Spatie\Activitylog\Models\Activity;
use function activity; // Spatie activity() helper

class UserService implements UserServiceInterface
{
    protected UserRepositoryInterface $userRepository;

    public function __construct(UserRepositoryInterface $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function register(array $data): User
    {
        $user = $this->userRepository->create($data);

        // Example: log an activity
        $this->logActivity('User Registered', ['user_id' => $user->id]);

        return $user;
    }

    public function updateProfile(User $user, array $data): bool
    {
        $updated = $this->userRepository->update($user, $data);

        if ($updated) {
            $this->logActivity('User Profile Updated', ['user_id' => $user->id]);
        }

        return $updated;
    }

    public function assignRole(User $user, string $role): void
    {
        $user->assignRole($role);
        $this->logActivity("Role '{$role}' assigned to user", ['user_id' => $user->id, 'role' => $role]);
    }

    public function logActivity(string $description, array $properties = []): void
    {
        activity()
            ->withProperties($properties)
            ->log($description);
    }
}
