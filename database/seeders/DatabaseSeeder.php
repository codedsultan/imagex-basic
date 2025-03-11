<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();



        // Seed roles and permissions
        $this->call([
            RolesTableSeeder::class,
            PermissionsTableSeeder::class,
        ]);

        // Create an admin user and assign the 'admin' role
        $admin = User::factory()->create([
            'name'  => 'Admin User',
            'email' => 'admin@example.com',
        ]);


        $admin->assignRole('admin');

        // Create additional dummy users and assign them the 'user' role
        User::factory(10)->create()->each(function ($user) {
            $user->assignRole('user');
        });

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
    }
}
