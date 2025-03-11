
# Create directories for factories and seeders if they don't exist
mkdir -p database/factories
mkdir -p database/seeders

# Create (touch) the User factory file
touch database/factories/UserFactory.php

# Create the Roles seeder file
touch database/seeders/RolesTableSeeder.php

# (Optional) Create a separate Permissions seeder file
touch database/seeders/PermissionsTableSeeder.php

# Create the main User module directory
mkdir -p app/Modules/User

# Create subdirectories
mkdir -p app/Modules/User/Controllers
mkdir -p app/Modules/User/Interfaces
mkdir -p app/Modules/User/Models
mkdir -p app/Modules/User/Repositories
mkdir -p app/Modules/User/Services
mkdir -p app/Modules/User/Routes


# Create files within these directories
touch app/Modules/User/Controllers/UserController.php
touch app/Modules/User/Interfaces/UserRepositoryInterface.php
touch app/Modules/User/Interfaces/UserServiceInterface.php
touch app/Modules/User/Models/User.php
touch app/Modules/User/Repositories/EloquentUserRepository.php
touch app/Modules/User/Services/UserService.php
touch app/Modules/User/Routes/web.php
touch app/Modules/User/Routes/api.php


# (Optional) Create a service provider for the module
touch app/Modules/User/UserServiceProvider.php
