<?php

namespace Database\Seeders;

use App\Models\User;
use App\Modules\Product\Models\Product;
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

        // Create an admin user and assign the 'admin' role
        $admin = User::factory()->create([
            'name'  => 'Admin User',
            'email' => 'admin@example.com',
        ]);


        

        $user = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        

        // Seed roles and permissions
        $this->call([
            RolesTableSeeder::class,
            PermissionsTableSeeder::class,
            CategorySeeder::class,
            DesignCategorySeeder::class,
            DesignSeeder::class,
            ProductSeeder::class,

        ]);

        $admin->assignRole('admin');
        $user->assignRole('user');
        // Create additional dummy users and assign them the 'user' role
        // User::factory(10)->create()->each(function ($user) {
        //     $user->assignRole('user');
        // });

        
    }


    public function usersData()
    {
        // Array of test users data
        $testUsersData = [
            [
                'name'     => 'Test User One',
                'email'    => 'test@example.com',
                'password' => bcrypt('password'),
            ],
            [
                'name'     => 'Test User Two',
                'email'    => 'test1@example.com',
                'password' => bcrypt('password'),
            ],
            [
                'name'     => 'Test User Three',
                'email'    => 'test2@example.com',
                'password' => bcrypt('password'),
            ],
        ];

        // Loop through each test user and seed related entities
        foreach ($testUsersData as $userData) {
            // Create (or retrieve) the test user
            $user = User::firstOrCreate(
                ['email' => $userData['email']],
                $userData
            );

            $user->assignRole('user');
        }
    }
}
