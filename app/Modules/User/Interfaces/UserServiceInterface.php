<?php

namespace App\Modules\User\Interfaces;

use App\Models\User;

interface UserServiceInterface
{
    public function register(array $data): User;
    public function updateProfile(User $user, array $data): bool;
    public function assignRole(User $user, string $role): void;
    public function logActivity(string $description, array $properties = []): void;
}
