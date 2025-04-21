# Laravel Inertia React Vue Js Application

## Overview
This is an open-source Laravel Inertia React application that provides a modern full-stack development experience. It utilizes Laravel as the backend, Inertia.js for server-driven frontends, and React for building dynamic user interfaces.

- 🚀 **Laravel Backend** – Robust API and database management
- ⚡ **Inertia.js Integration** – Server-driven rendering without the need for a traditional REST API
- 🎨 **React Frontend** – Dynamic UI with state management
- 🔐 **Authentication** – User registration, login, and role-based access control (RBAC)
- 📊 **Dashboard** – Vue Js Admin panel with analytics and reports
- 📦 **Modular Architecture** – Easy-to-extend components and services

## Features
- Design Upload
- Design Preview
- Mockup Creation
- Mockup Preview

## TODO
- Mobile Responsive
- Unit tests - In Progress
- Integration tests - In Progress
- CI/CD - WIP

## Roadmap

- Version 1: Basic Design upload & Mockup creation
- Version 2: AI Workflow
- ...

## Demo
[Live Demo](https://merchersnet.com)

## Tech Stack
- **Backend**: Laravel 12+, PHP 8+
- **Frontend**: React,VueJs, Inertia.js, Tailwind CSS
- **Database**: MySQL / PostgreSQL / SQLite
- **Authentication**: Laravel Sanctum
- **State Management**: Zustand / Context API

## Installation
### Prerequisites
Ensure you have the following installed:
- PHP 8+
- Composer
- Node.js & npm
- MySQL / PostgreSQL / SQLite

### Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/laravel-inertia-react.git
   cd laravel-inertia-react
   ```
2. Install backend dependencies:
   ```bash
   composer install
   ```
3. Install frontend dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
5. Run migrations:
   ```bash
   php artisan migrate
   ```
6. Start the development server:
   ```bash
   php artisan serve
   npm run dev
   ```

## Usage
After setup, visit `http://localhost:8000` to access the application. You can log in, manage users, and interact with the dashboard.

## Contributing
We welcome contributions! Feel free to fork the repository, make changes, and submit a pull request.

## License
This project is licensed under the MIT License.

## Acknowledgements

Developed by [Olusegun Ibraheem](https://github.com/codedsultan).
