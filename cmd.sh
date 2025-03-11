
# Create directories for factories and seeders if they don't exist
# git checkout -b feature/phase1-backend-foundation
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

# git add .
# git commit -m "feat(phase1): Implement backend foundation with User module, roles, permissions, and activity logging"

#phase 2
# git checkout -b feature/phase2-frontend-foundation

# Create directories for the user-frontend
mkdir -p frontend/user-frontend/src/pages

# Create necessary files
touch frontend/user-frontend/package.json
touch frontend/user-frontend/tsconfig.json
touch frontend/user-frontend/vite.config.ts
touch frontend/user-frontend/tailwind.config.js
touch frontend/user-frontend/postcss.config.js
touch frontend/user-frontend/src/App.tsx
touch frontend/user-frontend/src/index.tsx
touch frontend/user-frontend/src/store.ts
touch frontend/user-frontend/src/pages/Login.tsx
touch frontend/user-frontend/src/pages/Register.tsx
touch frontend/user-frontend/src/pages/Dashboard.tsx

# git add .
# git commit -m "feat(phase2): Set up frontend foundation with React (TypeScript) for user frontend  including Inertia.js integration, Tailwind CSS, and initial build configuration"

# # Create directories for the admin-frontend
mkdir -p frontend/admin-frontend/src/pages

# Create necessary files
touch frontend/admin-frontend/package.json
touch frontend/admin-frontend/tsconfig.json   # Optional if you want to use TypeScript with Vue
touch frontend/admin-frontend/vite.config.ts
touch frontend/admin-frontend/tailwind.config.js
touch frontend/admin-frontend/postcss.config.js
touch frontend/admin-frontend/src/App.vue
touch frontend/admin-frontend/src/main.ts
touch frontend/admin-frontend/src/pages/Login.vue
touch frontend/admin-frontend/src/pages/Dashboard.vue

# git add .
# git commit -m "feat(phase2): Set up frontend foundation with Vue 3 (Composition API) for admin frontend, including Inertia.js integration, Tailwind CSS, and initial build configuration"
touch resources/views/user.blade.php
touch resources/views/admin.blade.php